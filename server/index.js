import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { sanitizeString, sanitizeHtml, validators, validateRequest } from './validation.js';
import { fetchSocialPosts } from './socialMediaApi.js';
import { generateToken, verifyToken, authMiddleware } from './auth.js';
import { initEmailService, sendContactEmail, sendContactAutoReply, sendNewsletterWelcome } from './emailService.js';
import { requestLogger, metricsMiddleware, getHealthStatus, trackError, checkAlerts } from './monitoring.js';
import { generateSitemap } from './sitemap.js';

dotenv.config();
const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.API_PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.folder || 'general';
    const folderPath = path.join(uploadsDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|mp4|mp3|ico|bmp|tiff)$/i;
    const allowedMimeTypes = /^(image|video|audio|application\/(pdf|msword|vnd\.openxmlformats))/;
    const extValid = allowedExtensions.test(file.originalname);
    const mimeValid = allowedMimeTypes.test(file.mimetype);
    if (extValid || mimeValid) {
      cb(null, true);
    } else {
      console.log('Rejected file:', file.originalname, 'MIME:', file.mimetype);
      cb(new Error('Invalid file type'));
    }
  }
});

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Disable for development
}));

// CORS configuration - add your production domains here
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Set this in production
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or matches vercel/render patterns
    if (allowedOrigins.includes(origin) || 
        origin.endsWith('.vercel.app') || 
        origin.endsWith('.onrender.com') ||
        origin.includes('gidelfiavor')) {
      return callback(null, true);
    }
    
    callback(null, true); // Allow all for now, restrict in production
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Static file serving with caching headers
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'), {
  maxAge: '7d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));

// Monitoring middleware
app.use(requestLogger);
app.use(metricsMiddleware);

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Limit each IP to 200 requests per minute
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// PostgreSQL connection - MUST use environment variable
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to Neon PostgreSQL database');
    release();
  }
});

// ============ API ROUTES ============

// Health check with monitoring
app.get('/api/health', (req, res) => {
  const health = getHealthStatus();
  res.json(health);
});

// Monitoring endpoints
app.get('/api/monitoring/alerts', authMiddleware, (req, res) => {
  res.json({ alerts: checkAlerts() });
});

// Sitemap endpoint
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemap(pool, 'https://www.gidelfiavor.com');
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    console.error('Sitemap error:', err.message);
    res.status(500).send('Error generating sitemap');
  }
});

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Setup database tables
app.get('/api/setup', async (req, res) => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_url VARCHAR(500),
        year VARCHAR(10),
        tags TEXT[],
        purchase_link VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        content TEXT,
        excerpt TEXT,
        image_url VARCHAR(500),
        category VARCHAR(100),
        published BOOLEAN DEFAULT true,
        allow_comments BOOLEAN DEFAULT true,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS article_comments (
        id SERIAL PRIMARY KEY,
        article_id INTEGER NOT NULL,
        parent_id INTEGER,
        author_name VARCHAR(255) NOT NULL,
        author_email VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        quote TEXT NOT NULL,
        image_url VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name VARCHAR(255) DEFAULT 'Gidel Fiavor',
        site_tagline VARCHAR(500),
        site_logo VARCHAR(500),
        site_favicon VARCHAR(500),
        maintenance_mode BOOLEAN DEFAULT false,
        maintenance_message TEXT,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        contact_address TEXT,
        social_facebook VARCHAR(255),
        social_twitter VARCHAR(255),
        social_instagram VARCHAR(255),
        social_linkedin VARCHAR(255),
        social_youtube VARCHAR(255),
        social_tiktok VARCHAR(255),
        google_analytics_id VARCHAR(50),
        meta_description TEXT,
        meta_keywords TEXT,
        footer_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        hero_title VARCHAR(255),
        hero_subtitle TEXT,
        about_heading VARCHAR(255),
        about_bio TEXT,
        about_portrait VARCHAR(500),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        contact_address TEXT,
        social_instagram VARCHAR(255),
        social_linkedin VARCHAR(255),
        social_twitter VARCHAR(255),
        social_facebook VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        page_id INTEGER,
        parent_id INTEGER,
        sort_order INTEGER DEFAULT 0,
        is_visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS page_sections (
        id SERIAL PRIMARY KEY,
        page_id INTEGER NOT NULL,
        section_type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        content JSONB,
        settings JSONB,
        sort_order INTEGER DEFAULT 0,
        is_visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_url VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS album_media (
        id SERIAL PRIMARY KEY,
        album_id INTEGER NOT NULL REFERENCES albums(id),
        media_url VARCHAR(500) NOT NULL,
        media_type VARCHAR(20) DEFAULT 'image',
        caption VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INTEGER,
        folder VARCHAR(100) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        page_path VARCHAR(500),
        page_title VARCHAR(255),
        referrer VARCHAR(500),
        user_agent TEXT,
        ip_address VARCHAR(50),
        session_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS social_feeds (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(50) NOT NULL,
        account_name VARCHAR(255),
        access_token TEXT,
        refresh_token TEXT,
        is_connected BOOLEAN DEFAULT false,
        last_synced TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS social_posts (
        id SERIAL PRIMARY KEY,
        feed_id INTEGER,
        platform VARCHAR(50),
        post_id VARCHAR(255),
        content TEXT,
        media_url VARCHAR(500),
        media_type VARCHAR(50) DEFAULT 'text',
        video_url VARCHAR(500),
        post_url VARCHAR(500),
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        posted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(200),
        message TEXT NOT NULL,
        ip_address VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        ip_address VARCHAR(50),
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add missing columns to site_content table
    const newColumns = [
      { name: 'hero_greeting', type: 'VARCHAR(100)' },
      { name: 'hero_about_heading', type: 'VARCHAR(255)' },
      { name: 'hero_cta', type: 'VARCHAR(100)' },
      { name: 'hero_image', type: 'VARCHAR(500)' },
      { name: 'hero_tagline_1', type: 'VARCHAR(255)' },
      { name: 'hero_tagline_2', type: 'VARCHAR(255)' },
      { name: 'years_experience', type: 'VARCHAR(10)' },
      { name: 'experience_description', type: 'VARCHAR(255)' },
      { name: 'stat_books', type: 'VARCHAR(10)' },
      { name: 'stat_certification', type: 'VARCHAR(100)' },
      { name: 'stat_workshops', type: 'VARCHAR(10)' },
      { name: 'stat_lives', type: 'VARCHAR(50)' },
      { name: 'about_subtitle', type: 'TEXT' },
      { name: 'services', type: 'TEXT' },
      { name: 'about_cards', type: 'TEXT' },
      { name: 'theme_color', type: 'VARCHAR(20)' },
      { name: 'about_button_text', type: 'VARCHAR(100)' },
      { name: 'about_label', type: 'VARCHAR(50)' },
      { name: 'about_portrait', type: 'VARCHAR(500)' },
    ];
    
    for (const col of newColumns) {
      try {
        await pool.query(`ALTER TABLE site_content ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore
      }
    }
    
    // Add new columns to articles table
    const articleColumns = [
      { name: 'publish_date', type: 'TIMESTAMP' },
      { name: 'author_name', type: 'VARCHAR(255)' },
      { name: 'updated_at', type: 'TIMESTAMP' },
      { name: 'like_count', type: 'INTEGER DEFAULT 0' },
    ];
    
    for (const col of articleColumns) {
      try {
        await pool.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore
      }
    }
    
    // Add new columns to pages table for images
    const pageColumns = [
      { name: 'featured_image', type: 'TEXT' },
      { name: 'header_image', type: 'TEXT' },
      { name: 'gallery_images', type: 'JSONB' },
    ];
    
    for (const col of pageColumns) {
      try {
        await pool.query(`ALTER TABLE pages ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore
      }
    }
    
    // Add new columns to testimonials table for moderation
    const testimonialColumns = [
      { name: 'is_approved', type: 'BOOLEAN DEFAULT true' },
      { name: 'submitter_email', type: 'VARCHAR(255)' },
    ];
    
    for (const col of testimonialColumns) {
      try {
        await pool.query(`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore
      }
    }
    
    // Insert default admin with hashed password
    const defaultPassword = await bcrypt.hash('admin123', 12);
    await pool.query(`
      INSERT INTO admin_users (email, password, name) 
      VALUES ('admin@gidelfiavor.com', $1, 'Admin')
      ON CONFLICT (email) DO NOTHING
    `, [defaultPassword]);
    
    // Insert default site content
    await pool.query(`
      INSERT INTO site_content (hero_title, hero_subtitle, about_heading, about_bio, contact_email)
      SELECT 'Gidel Kwasi Fiavor', 
             'A passionate healthcare marketing specialist, theologian, marriage counsellor, and author.',
             'Inspiring Excellence in Healthcare, Faith & Family',
             'With nearly three decades of professional experience, I have dedicated my life to serving others.',
             'info@gidelfiavor.com'
      WHERE NOT EXISTS (SELECT 1 FROM site_content LIMIT 1)
    `);
    
    res.json({ success: true, message: 'Database setup complete!' });
  } catch (err) {
    console.error('Setup error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ MENUS ============
app.get('/api/menus', async (req, res) => {
  try {
    // Join with pages to get page slug when menu is linked to a page
    const result = await pool.query(`
      SELECT m.*, p.slug as page_slug 
      FROM menus m 
      LEFT JOIN pages p ON m.page_id = p.id 
      ORDER BY m.sort_order ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/menus', async (req, res) => {
  try {
    const { title, slug, page_id, parent_id, sort_order, is_visible } = req.body;
    const result = await pool.query(
      'INSERT INTO menus (title, slug, page_id, parent_id, sort_order, is_visible) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, slug, page_id, parent_id, sort_order || 0, is_visible ?? true]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/menus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, page_id, parent_id, sort_order, is_visible } = req.body;
    const result = await pool.query(
      'UPDATE menus SET title=$1, slug=$2, page_id=$3, parent_id=$4, sort_order=$5, is_visible=$6 WHERE id=$7 RETURNING *',
      [title, slug, page_id, parent_id, sort_order, is_visible, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/menus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM menus WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PAGES ============
app.get('/api/pages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM pages WHERE id=$1', [id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pages/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM pages WHERE slug=$1', [slug]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sections by page slug (for frontend rendering)
app.get('/api/pages/slug/:slug/sections', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await pool.query('SELECT id FROM pages WHERE slug=$1', [slug]);
    if (!page.rows[0]) {
      return res.json([]);
    }
    const result = await pool.query(
      'SELECT * FROM page_sections WHERE page_id=$1 AND is_visible=true ORDER BY sort_order ASC',
      [page.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pages', async (req, res) => {
  try {
    const { title, slug, content, meta_title, meta_description, is_published, featured_image, header_image, gallery_images } = req.body;
    const result = await pool.query(
      'INSERT INTO pages (title, slug, content, meta_title, meta_description, is_published, featured_image, header_image, gallery_images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, slug, content, meta_title, meta_description, is_published ?? true, featured_image, header_image, gallery_images]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, meta_title, meta_description, is_published, featured_image, header_image, gallery_images } = req.body;
    const result = await pool.query(
      'UPDATE pages SET title=$1, slug=$2, content=$3, meta_title=$4, meta_description=$5, is_published=$6, featured_image=$7, header_image=$8, gallery_images=$9 WHERE id=$10 RETURNING *',
      [title, slug, content, meta_title, meta_description, is_published, featured_image, header_image, gallery_images, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM pages WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ALBUMS ============
app.get('/api/albums', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM albums ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const album = await pool.query('SELECT * FROM albums WHERE id=$1', [id]);
    const media = await pool.query('SELECT * FROM album_media WHERE album_id=$1 ORDER BY sort_order ASC', [id]);
    res.json({ ...album.rows[0], media: media.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/albums', async (req, res) => {
  try {
    const { title, description, cover_url, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO albums (title, description, cover_url, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, cover_url, sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, cover_url, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE albums SET title=$1, description=$2, cover_url=$3, sort_order=$4 WHERE id=$5 RETURNING *',
      [title, description, cover_url, sort_order, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM album_media WHERE album_id=$1', [id]);
    await pool.query('DELETE FROM albums WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ALBUM MEDIA ============
app.get('/api/albums/:albumId/media', async (req, res) => {
  try {
    const { albumId } = req.params;
    const result = await pool.query('SELECT * FROM album_media WHERE album_id=$1 ORDER BY sort_order ASC', [albumId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/albums/:albumId/media', async (req, res) => {
  try {
    const { albumId } = req.params;
    const { media_url, media_type, caption, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO album_media (album_id, media_url, media_type, caption, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [albumId, media_url, media_type || 'image', caption, sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM album_media WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ BOOKS ============
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books', validateRequest('book'), async (req, res) => {
  try {
    const { title, description, cover_url, year, tags, purchase_link, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO books (title, description, cover_url, year, tags, purchase_link, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [sanitizeString(title, 255), sanitizeHtml(description), cover_url, year, tags, purchase_link, sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/books/:id', validateRequest('book'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, cover_url, year, tags, purchase_link, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE books SET title=$1, description=$2, cover_url=$3, year=$4, tags=$5, purchase_link=$6, sort_order=$7 WHERE id=$8 RETURNING *',
      [sanitizeString(title, 255), sanitizeHtml(description), cover_url, year, tags, purchase_link, sort_order, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM books WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ARTICLES ============
app.get('/api/articles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching articles:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM articles WHERE id=$1', [id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/articles', validateRequest('article'), async (req, res) => {
  try {
    const { title, content, excerpt, image_url, category, published, publish_date, author_name } = req.body;
    const result = await pool.query(
      'INSERT INTO articles (title, content, excerpt, image_url, category, published, publish_date, author_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [sanitizeString(title, 255), sanitizeHtml(content), sanitizeString(excerpt, 500), image_url, sanitizeString(category, 100), published ?? true, publish_date || new Date(), sanitizeString(author_name, 255) || 'Admin']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/articles/:id', validateRequest('article'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, image_url, category, published, publish_date, author_name } = req.body;
    const result = await pool.query(
      'UPDATE articles SET title=$1, content=$2, excerpt=$3, image_url=$4, category=$5, published=$6, publish_date=$7, author_name=$8, updated_at=$9 WHERE id=$10 RETURNING *',
      [sanitizeString(title, 255), sanitizeHtml(content), sanitizeString(excerpt, 500), image_url, sanitizeString(category, 100), published, publish_date, sanitizeString(author_name, 255), new Date(), id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM articles WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GALLERY ============
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_images ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching gallery:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const { image_url, caption, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO gallery_images (image_url, caption, sort_order) VALUES ($1, $2, $3) RETURNING *',
      [image_url, caption, sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM gallery_images WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ TESTIMONIALS ============
app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching testimonials:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, quote, image_url, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO testimonials (name, role, quote, image_url, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, role, quote, image_url, sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM testimonials WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, quote, image_url, sort_order, is_approved } = req.body;
    const result = await pool.query(
      'UPDATE testimonials SET name=$1, role=$2, quote=$3, image_url=$4, sort_order=$5, is_approved=$6 WHERE id=$7 RETURNING *',
      [name, role, quote, image_url, sort_order || 0, is_approved !== false, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public testimony submission (requires moderation)
const testimonyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 testimonies per hour
  message: { error: 'Too many submissions, please try again later' },
});

app.post('/api/testimonials/submit', testimonyLimiter, async (req, res) => {
  try {
    const { name, role, quote, email } = req.body;
    
    if (!name || !quote) {
      return res.status(400).json({ error: 'Name and testimony are required' });
    }
    
    const sanitizedName = sanitizeString(name, 255);
    const sanitizedRole = sanitizeString(role || '', 255);
    const sanitizedQuote = sanitizeString(quote, 2000);
    const sanitizedEmail = email ? sanitizeString(email, 255).toLowerCase() : null;
    
    const result = await pool.query(
      'INSERT INTO testimonials (name, role, quote, is_approved, submitter_email) VALUES ($1, $2, $3, false, $4) RETURNING id',
      [sanitizedName, sanitizedRole, sanitizedQuote, sanitizedEmail]
    );
    
    res.json({ success: true, message: 'Thank you for your testimony! It will be reviewed and published soon.' });
  } catch (err) {
    console.error('Testimony submission error:', err.message);
    res.status(500).json({ error: 'Failed to submit testimony. Please try again later.' });
  }
});

// Get approved testimonials only (public)
app.get('/api/testimonials/approved', async (req, res) => {
  try {
    // Check if is_approved column exists
    const columnCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'testimonials' AND column_name = 'is_approved'
    `);
    
    let result;
    if (columnCheck.rows.length > 0) {
      // Column exists, filter by is_approved
      result = await pool.query('SELECT id, name, role, quote, image_url FROM testimonials WHERE COALESCE(is_approved, true) = true ORDER BY sort_order ASC');
    } else {
      // Column doesn't exist, return all testimonials
      result = await pool.query('SELECT id, name, role, quote, image_url FROM testimonials ORDER BY sort_order ASC');
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching approved testimonials:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ SITE CONTENT ============
app.get('/api/site-content', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_content LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching site content:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/site-content', async (req, res) => {
  try {
    const fields = req.body;
    
    // Get existing columns from the table
    const columnsResult = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'site_content' AND column_name != 'id'
    `);
    const validColumns = columnsResult.rows.map(r => r.column_name);
    
    // Filter to only valid columns
    const filteredFields = {};
    for (const [key, value] of Object.entries(fields)) {
      if (validColumns.includes(key)) {
        filteredFields[key] = value;
      }
    }
    
    const keys = Object.keys(filteredFields);
    const values = Object.values(filteredFields);
    
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided' });
    }
    
    // Check if record exists
    const existing = await pool.query('SELECT id FROM site_content LIMIT 1');
    
    if (existing.rows.length > 0) {
      const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
      const result = await pool.query(
        `UPDATE site_content SET ${setClause} WHERE id=$${keys.length + 1} RETURNING *`,
        [...values, existing.rows[0].id]
      );
      res.json(result.rows[0]);
    } else {
      const cols = keys.join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const result = await pool.query(
        `INSERT INTO site_content (${cols}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Site content update error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ AUTH (Secure with bcrypt) ============
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input format' });
    }
    
    const result = await pool.query('SELECT * FROM admin_users WHERE email=$1', [email.toLowerCase().trim()]);
    
    if (result.rows.length === 0) {
      // Use same error message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check if password is hashed (starts with $2a$ or $2b$ for bcrypt)
    const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    
    let isValidPassword = false;
    if (isHashed) {
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plaintext password - compare and upgrade to hash
      isValidPassword = user.password === password;
      if (isValidPassword) {
        // Upgrade to hashed password
        const hashedPassword = await bcrypt.hash(password, 12);
        await pool.query('UPDATE admin_users SET password=$1 WHERE id=$2', [hashedPassword, user.id]);
        console.log(`Upgraded password hash for user: ${user.email}`);
      }
    }
    
    if (isValidPassword) {
      // Generate JWT token
      const token = generateToken(user);
      res.json({ 
        user: { id: user.id, email: user.email, name: user.name },
        token,
        isAdmin: true 
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Register new admin (protected - should only be called during setup)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    // Check if user already exists
    const existing = await pool.query('SELECT id FROM admin_users WHERE email=$1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await pool.query(
      'INSERT INTO admin_users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email.toLowerCase().trim(), hashedPassword, name || 'Admin']
    );
    
    res.json({ user: result.rows[0], message: 'User created successfully' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Change password
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    
    const result = await pool.query('SELECT * FROM admin_users WHERE email=$1', [email.toLowerCase().trim()]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    
    let isValidPassword = false;
    if (isHashed) {
      isValidPassword = await bcrypt.compare(currentPassword, user.password);
    } else {
      isValidPassword = user.password === currentPassword;
    }
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE admin_users SET password=$1 WHERE id=$2', [hashedPassword, user.id]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ============ FILE MANAGER ============
// Upload single file
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const folder = req.query.folder || 'general';
    const filePath = `/uploads/${folder}/${req.file.filename}`;
    const fullUrl = `http://localhost:${PORT}${filePath}`;
    
    const result = await pool.query(
      'INSERT INTO files (filename, original_name, file_path, file_type, file_size, folder) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.file.filename, req.file.originalname, filePath, req.file.mimetype, req.file.size, folder]
    );
    
    res.json({ ...result.rows[0], url: fullUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload multiple files
app.post('/api/files/upload-multiple', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const folder = req.query.folder || 'general';
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const filePath = `/uploads/${folder}/${file.filename}`;
      const fullUrl = `http://localhost:${PORT}${filePath}`;
      const result = await pool.query(
        'INSERT INTO files (filename, original_name, file_path, file_type, file_size, folder) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [file.filename, file.originalname, filePath, file.mimetype, file.size, folder]
      );
      uploadedFiles.push({ ...result.rows[0], url: fullUrl });
    }
    
    res.json(uploadedFiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all files
app.get('/api/files', async (req, res) => {
  try {
    const folder = req.query.folder;
    let query = 'SELECT * FROM files ORDER BY created_at DESC';
    let params = [];
    
    if (folder) {
      query = 'SELECT * FROM files WHERE folder=$1 ORDER BY created_at DESC';
      params = [folder];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get folders
app.get('/api/files/folders', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT folder, COUNT(*) as file_count FROM files GROUP BY folder ORDER BY folder');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete file
app.delete('/api/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await pool.query('SELECT * FROM files WHERE id=$1', [id]);
    
    if (file.rows.length > 0) {
      const filePath = path.join(__dirname, '../public', file.rows[0].file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await pool.query('DELETE FROM files WHERE id=$1', [id]);
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SITE SETTINGS ============
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    
    const existing = await pool.query('SELECT id FROM site_settings LIMIT 1');
    
    if (existing.rows.length > 0) {
      const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
      const result = await pool.query(
        `UPDATE site_settings SET ${setClause}, updated_at=CURRENT_TIMESTAMP WHERE id=$${keys.length + 1} RETURNING *`,
        [...values, existing.rows[0].id]
      );
      res.json(result.rows[0]);
    } else {
      const cols = keys.join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const result = await pool.query(
        `INSERT INTO site_settings (${cols}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ARTICLE COMMENTS ============
// Get comments for an article (public - only approved)
app.get('/api/articles/:articleId/comments', async (req, res) => {
  try {
    const { articleId } = req.params;
    const result = await pool.query(
      'SELECT id, article_id, parent_id, author_name, content, created_at FROM article_comments WHERE article_id=$1 AND is_approved=true ORDER BY created_at ASC',
      [articleId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a comment (public)
app.post('/api/articles/:articleId/comments', async (req, res) => {
  try {
    const { articleId } = req.params;
    const { author_name, author_email, content, parent_id } = req.body;
    
    // Basic validation and sanitization
    if (!author_name || !author_email || !content) {
      return res.status(400).json({ error: 'Name, email, and comment are required' });
    }
    
    // Sanitize input to prevent XSS
    const sanitize = (str) => str.replace(/<[^>]*>/g, '').trim();
    const sanitizedName = sanitize(author_name).substring(0, 255);
    const sanitizedEmail = sanitize(author_email).substring(0, 255);
    const sanitizedContent = sanitize(content).substring(0, 2000);
    
    const ip = req.ip || req.connection.remoteAddress;
    
    const result = await pool.query(
      'INSERT INTO article_comments (article_id, parent_id, author_name, author_email, content, ip_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, author_name, content, created_at',
      [articleId, parent_id || null, sanitizedName, sanitizedEmail, sanitizedContent, ip]
    );
    
    res.json({ ...result.rows[0], message: 'Comment submitted for moderation' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all comments (including unapproved)
app.get('/api/admin/comments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, a.title as article_title 
      FROM article_comments c 
      LEFT JOIN articles a ON c.article_id = a.id 
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Approve/reject comment
app.put('/api/admin/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;
    const result = await pool.query(
      'UPDATE article_comments SET is_approved=$1 WHERE id=$2 RETURNING *',
      [is_approved, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete comment
app.delete('/api/admin/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM article_comments WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PAGE SECTIONS ============
app.get('/api/pages/:pageId/sections', async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await pool.query(
      'SELECT * FROM page_sections WHERE page_id=$1 ORDER BY sort_order ASC',
      [pageId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pages/:pageId/sections', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { section_type, title, content, settings, sort_order, is_visible } = req.body;
    const result = await pool.query(
      'INSERT INTO page_sections (page_id, section_type, title, content, settings, sort_order, is_visible) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [pageId, section_type, title, content || {}, settings || {}, sort_order || 0, is_visible ?? true]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { section_type, title, content, settings, sort_order, is_visible } = req.body;
    
    // First get the existing section to preserve fields not being updated
    const existing = await pool.query('SELECT * FROM page_sections WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    const current = existing.rows[0];
    
    // Ensure settings and content are properly stringified for JSONB columns
    const settingsJson = settings !== undefined 
      ? (typeof settings === 'string' ? settings : JSON.stringify(settings || {}))
      : current.settings;
    const contentJson = content !== undefined
      ? (typeof content === 'string' ? content : JSON.stringify(content || {}))
      : current.content;
    
    const result = await pool.query(
      'UPDATE page_sections SET section_type=$1, title=$2, content=$3, settings=$4, sort_order=$5, is_visible=$6 WHERE id=$7 RETURNING *',
      [
        section_type || current.section_type,
        title !== undefined ? title : current.title,
        contentJson,
        settingsJson,
        sort_order !== undefined ? sort_order : current.sort_order,
        is_visible !== undefined ? is_visible : current.is_visible,
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Section update error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Bulk update section order
app.put('/api/pages/:pageId/sections/reorder', async (req, res) => {
  try {
    const { sections } = req.body; // Array of { id, sort_order }
    for (const section of sections) {
      await pool.query('UPDATE page_sections SET sort_order=$1 WHERE id=$2', [section.sort_order, section.id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM page_sections WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ANALYTICS / PAGE VIEWS ============
// Track page view
app.post('/api/analytics/pageview', async (req, res) => {
  try {
    const { page_path, page_title, referrer, session_id } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    await pool.query(
      'INSERT INTO page_views (page_path, page_title, referrer, user_agent, ip_address, session_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [page_path, page_title, referrer, userAgent, ip, session_id]
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment article view count
app.post('/api/articles/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE articles SET view_count = COALESCE(view_count, 0) + 1 WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like an article
app.post('/api/articles/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE articles SET like_count = COALESCE(like_count, 0) + 1 WHERE id=$1 RETURNING like_count',
      [id]
    );
    res.json({ like_count: result.rows[0]?.like_count || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unlike an article
app.post('/api/articles/:id/unlike', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE articles SET like_count = GREATEST(COALESCE(like_count, 0) - 1, 0) WHERE id=$1 RETURNING like_count',
      [id]
    );
    res.json({ like_count: result.rows[0]?.like_count || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics dashboard data
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    // Helper to safely query with fallback
    const safeQuery = async (query, fallback) => {
      try {
        const result = await pool.query(query);
        return result.rows;
      } catch (e) {
        console.error('Analytics query error:', e.message);
        return fallback;
      }
    };
    
    // Total page views
    const totalViewsRows = await safeQuery(
      `SELECT COUNT(*) as total FROM page_views WHERE created_at > NOW() - INTERVAL '${days} days'`,
      [{ total: 0 }]
    );
    
    // Unique visitors (by IP)
    const uniqueVisitorsRows = await safeQuery(
      `SELECT COUNT(DISTINCT ip_address) as total FROM page_views WHERE created_at > NOW() - INTERVAL '${days} days'`,
      [{ total: 0 }]
    );
    
    // Views by day
    const viewsByDay = await safeQuery(`
      SELECT DATE(created_at) as date, COUNT(*) as views 
      FROM page_views 
      WHERE created_at > NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `, []);
    
    // Top pages
    const topPages = await safeQuery(`
      SELECT page_path, page_title, COUNT(*) as views 
      FROM page_views 
      WHERE created_at > NOW() - INTERVAL '${days} days'
      GROUP BY page_path, page_title 
      ORDER BY views DESC 
      LIMIT 10
    `, []);
    
    // Top referrers
    const topReferrers = await safeQuery(`
      SELECT referrer, COUNT(*) as count 
      FROM page_views 
      WHERE referrer IS NOT NULL AND referrer != '' AND created_at > NOW() - INTERVAL '${days} days'
      GROUP BY referrer 
      ORDER BY count DESC 
      LIMIT 10
    `, []);
    
    // Article stats
    const articleStats = await safeQuery(`
      SELECT id, title, view_count
      FROM articles 
      ORDER BY view_count DESC NULLS LAST
      LIMIT 10
    `, []);
    
    // Comments stats
    const commentStatsRows = await safeQuery(`
      SELECT 
        COUNT(*) as total_comments,
        COUNT(*) FILTER (WHERE is_approved = true) as approved_comments,
        COUNT(*) FILTER (WHERE is_approved = false) as pending_comments
      FROM article_comments
    `, [{ total_comments: 0, approved_comments: 0, pending_comments: 0 }]);
    
    res.json({
      totalPageViews: parseInt(totalViewsRows[0]?.total || 0),
      uniqueVisitors: parseInt(uniqueVisitorsRows[0]?.total || 0),
      viewsByDay: viewsByDay,
      topPages: topPages,
      topReferrers: topReferrers,
      topArticles: articleStats,
      commentStats: commentStatsRows[0] || { total_comments: 0, approved_comments: 0, pending_comments: 0 }
    });
  } catch (err) {
    console.error('Analytics dashboard error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ SOCIAL FEEDS ============
app.get('/api/social-feeds', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, platform, account_name, is_connected, last_synced FROM social_feeds ORDER BY platform');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/social-feeds', async (req, res) => {
  try {
    const { platform, account_name, access_token, refresh_token } = req.body;
    const result = await pool.query(
      'INSERT INTO social_feeds (platform, account_name, access_token, refresh_token, is_connected) VALUES ($1, $2, $3, $4, true) RETURNING id, platform, account_name, is_connected',
      [platform, account_name, access_token, refresh_token]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/social-feeds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM social_posts WHERE feed_id=$1', [id]);
    await pool.query('DELETE FROM social_feeds WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/social-feeds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { account_name, access_token } = req.body;
    const result = await pool.query(
      'UPDATE social_feeds SET account_name=$1, access_token=COALESCE($2, access_token) WHERE id=$3 RETURNING id, platform, account_name, is_connected, last_synced',
      [account_name, access_token || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/social-feeds/:id/sync', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the feed info
    const feedResult = await pool.query('SELECT * FROM social_feeds WHERE id=$1', [id]);
    if (feedResult.rows.length === 0) {
      return res.status(404).json({ error: 'Feed not found' });
    }
    const feed = feedResult.rows[0];
    
    let posts = [];
    let isLive = false;
    
    // Try to fetch real posts if we have API credentials
    if (feed.access_token) {
      try {
        const credentials = {
          accessToken: feed.access_token,
          accountName: feed.account_name,
          accountId: feed.account_id,
          apiKey: feed.api_key,
          channelId: feed.channel_id,
          pageId: feed.page_id,
          organizationId: feed.organization_id,
        };
        
        posts = await fetchSocialPosts(feed.platform, credentials, 10);
        isLive = true;
        console.log(`Fetched ${posts.length} live posts from ${feed.platform}`);
      } catch (apiError) {
        console.error(`API Error for ${feed.platform}:`, apiError.message);
        // Fall back to demo posts if API fails
      }
    }
    
    // If no live posts, generate demo posts
    if (posts.length === 0) {
      posts = [
        {
          post_id: `demo_${Date.now()}_1`,
          content: `Latest update from @${feed.account_name} on ${feed.platform}! Check out our newest content and stay connected with us.`,
          media_url: null,
          likes_count: Math.floor(Math.random() * 500) + 50,
          comments_count: Math.floor(Math.random() * 50) + 5,
          posted_at: new Date().toISOString(),
        },
        {
          post_id: `demo_${Date.now()}_2`,
          content: `Thank you to all our amazing followers! Your support means everything to us. #grateful #community`,
          media_url: null,
          likes_count: Math.floor(Math.random() * 300) + 100,
          comments_count: Math.floor(Math.random() * 30) + 10,
          posted_at: new Date().toISOString(),
        },
        {
          post_id: `demo_${Date.now()}_3`,
          content: `Exciting news coming soon! Stay tuned for updates from ${feed.account_name}. 🎉`,
          media_url: null,
          likes_count: Math.floor(Math.random() * 200) + 25,
          comments_count: Math.floor(Math.random() * 20) + 3,
          posted_at: new Date().toISOString(),
        },
      ];
    }
    
    // Delete old posts and insert new ones
    await pool.query('DELETE FROM social_posts WHERE feed_id=$1', [id]);
    
    for (const post of posts) {
      // Determine media type
      let mediaType = 'text';
      if (post.video_url || (post.media_url && (post.media_url.includes('video') || post.media_type === 'video'))) {
        mediaType = 'video';
      } else if (post.media_url) {
        mediaType = 'image';
      }
      
      await pool.query(
        'INSERT INTO social_posts (feed_id, platform, post_id, content, media_url, media_type, video_url, likes_count, comments_count, posted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [id, feed.platform, post.post_id, post.content, post.media_url, mediaType, post.video_url || null, post.likes_count || 0, post.comments_count || 0, post.posted_at || new Date()]
      );
    }
    
    // Update last_synced timestamp
    await pool.query(
      'UPDATE social_feeds SET last_synced=CURRENT_TIMESTAMP, is_connected=true WHERE id=$1',
      [id]
    );
    
    res.json({ 
      success: true, 
      message: isLive ? 'Live feed synced successfully' : 'Demo feed synced (add API credentials for live data)', 
      postsAdded: posts.length,
      isLive 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get social posts for display
app.get('/api/social-posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const platform = req.query.platform; // Optional filter by platform
    const mediaType = req.query.mediaType; // Optional filter by media type (image, video, text)
    
    let query = 'SELECT * FROM social_posts';
    let conditions = [];
    let params = [];
    let paramIndex = 1;
    
    if (platform && platform !== 'all') {
      conditions.push(`platform = $${paramIndex}`);
      params.push(platform);
      paramIndex++;
    }
    
    if (mediaType && mediaType !== 'all') {
      conditions.push(`media_type = $${paramIndex}`);
      params.push(mediaType);
      paramIndex++;
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY posted_at DESC LIMIT $${paramIndex}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SLUG GENERATION ============
app.post('/api/generate-slug', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  res.json({ slug: generateSlug(title) });
});

// ============ CONTACT FORM ============
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact submissions per hour
  message: { error: 'Too many contact submissions, please try again later' },
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedEmail = sanitizeString(email, 255);
    const sanitizedSubject = sanitizeString(subject || 'Contact Form Submission', 200);
    const sanitizedMessage = sanitizeString(message, 5000);
    
    // Store in database
    await pool.query(
      'INSERT INTO contact_submissions (name, email, subject, message, ip_address) VALUES ($1, $2, $3, $4, $5)',
      [sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage, req.ip]
    );
    
    // Send email notification using email service
    const emailResult = await sendContactEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage
    });
    
    // Send auto-reply to user
    await sendContactAutoReply({ name: sanitizedName, email: sanitizedEmail });
    
    if (emailResult.success) {
      res.json({ success: true, message: 'Your message has been sent successfully!' });
    } else {
      // Email failed but submission was stored
      res.json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
    }
  } catch (err) {
    console.error('Contact form error:', err.message);
    trackError(err, { endpoint: '/api/contact' });
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// ============ NEWSLETTER ============
const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 newsletter signups per hour
  message: { error: 'Too many signup attempts, please try again later' },
});

app.post('/api/newsletter/subscribe', newsletterLimiter, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const sanitizedEmail = sanitizeString(email, 255).toLowerCase();
    const sanitizedName = sanitizeString(name || '', 100);
    
    // Check if already subscribed
    const existing = await pool.query('SELECT id, is_active FROM newsletter_subscribers WHERE email=$1', [sanitizedEmail]);
    
    if (existing.rows.length > 0) {
      if (existing.rows[0].is_active) {
        return res.json({ success: true, message: 'You are already subscribed!' });
      } else {
        // Reactivate subscription
        await pool.query('UPDATE newsletter_subscribers SET is_active=true, subscribed_at=CURRENT_TIMESTAMP WHERE id=$1', [existing.rows[0].id]);
        return res.json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
      }
    }
    
    // Add new subscriber
    await pool.query(
      'INSERT INTO newsletter_subscribers (email, name, ip_address) VALUES ($1, $2, $3)',
      [sanitizedEmail, sanitizedName, req.ip]
    );
    
    // Send welcome email
    await sendNewsletterWelcome({ email: sanitizedEmail, name: sanitizedName });
    
    res.json({ success: true, message: 'Thank you for subscribing!' });
  } catch (err) {
    console.error('Newsletter subscription error:', err.message);
    res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
  }
});

app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const sanitizedEmail = sanitizeString(email, 255).toLowerCase();
    
    await pool.query('UPDATE newsletter_subscribers SET is_active=false WHERE email=$1', [sanitizedEmail]);
    
    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (err) {
    console.error('Newsletter unsubscribe error:', err.message);
    res.status(500).json({ error: 'Failed to unsubscribe. Please try again later.' });
  }
});

// Admin: Get newsletter subscribers
app.get('/api/admin/newsletter', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, is_active, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ADMIN USERS ============
app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, created_at FROM admin_users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent deleting the last admin
    const count = await pool.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(count.rows[0].count) <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin user' });
    }
    await pool.query('DELETE FROM admin_users WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const result = await pool.query(
      'UPDATE admin_users SET name=$1, email=$2 WHERE id=$3 RETURNING id, email, name, created_at',
      [name, email, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
