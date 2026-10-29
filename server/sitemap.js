// Sitemap generator for SEO
// Generates sitemap.xml dynamically based on database content

export const generateSitemap = async (pool, baseUrl = 'https://www.gidelfiavor.com') => {
  const urls = [];
  const now = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/books', priority: '0.9', changefreq: 'weekly' },
    { loc: '/articles', priority: '0.9', changefreq: 'daily' },
    { loc: '/gallery', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.6', changefreq: 'yearly' },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.loc}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  try {
    // Custom CMS pages (built-in pages like "about" already have their own routes above)
    const builtInSlugs = ['home', 'about', 'books', 'articles', 'gallery', 'contact'];
    const pagesResult = await pool.query(
      'SELECT slug, created_at FROM pages WHERE is_published = true AND NOT (slug = ANY($1)) ORDER BY created_at DESC',
      [builtInSlugs]
    );
    pagesResult.rows.forEach(page => {
      urls.push({
        loc: `${baseUrl}/page/${page.slug}`,
        lastmod: page.created_at ? new Date(page.created_at).toISOString().split('T')[0] : now,
        changefreq: 'monthly',
        priority: '0.7',
      });
    });

    // Articles
    const articlesResult = await pool.query(
      'SELECT id, created_at FROM articles WHERE published = true ORDER BY created_at DESC'
    );
    // Article detail pages are loaded by numeric id (/articles/:id)
    articlesResult.rows.forEach(article => {
      urls.push({
        loc: `${baseUrl}/articles/${article.id}`,
        lastmod: article.created_at ? new Date(article.created_at).toISOString().split('T')[0] : now,
        changefreq: 'monthly',
        priority: '0.8',
      });
    });

  } catch (err) {
    console.error('Error generating sitemap:', err.message);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export default { generateSitemap };
