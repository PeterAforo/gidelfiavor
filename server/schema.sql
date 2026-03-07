-- Neon PostgreSQL Schema for Gidel Fiavor Website

-- Books Table
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

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100),
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    quote TEXT NOT NULL,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Content Table
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

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO admin_users (email, password, name) 
VALUES ('admin@gidelfiavor.com', 'admin123', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default site content
INSERT INTO site_content (hero_title, hero_subtitle, about_heading, about_bio, contact_email)
VALUES (
    'Gidel Kwasi Fiavor',
    'A passionate healthcare marketing specialist, theologian, marriage counsellor, and author with nearly three decades of professional experience.',
    'Inspiring Excellence in Healthcare, Faith & Family',
    'With nearly three decades of professional experience, I have dedicated my life to serving others through healthcare marketing, theological education, and marriage counseling.',
    'info@gidelfiavor.com'
)
ON CONFLICT DO NOTHING;
