# cPanel Deployment Guide

## Build Output

The static site has been built and is ready in the `out/` folder.

## Deployment Steps

### 1. Upload Files to cPanel

1. Log in to your **cPanel** account
2. Open **File Manager**
3. Navigate to `public_html` (or your domain's root folder)
4. **Delete** any existing files (backup first if needed)
5. **Upload** all contents from the `out/` folder:
   - You can zip the `out` folder, upload it, and extract in cPanel
   - Or use FTP (FileZilla) to upload all files

### 2. File Structure

After upload, your `public_html` should contain:
```
public_html/
├── _next/           (CSS, JS assets)
├── about/
├── blog/
├── books/
├── contact/
├── events/
├── press/
├── 404.html
├── favicon.ico
├── index.html
├── robots.txt
└── sitemap.xml
```

### 3. Configure .htaccess (Important!)

Create a `.htaccess` file in `public_html` with this content:

```apache
RewriteEngine On

# Handle trailing slashes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteRule ^(.*)$ /$1/ [L,R=301]

# Serve index.html for directories
DirectoryIndex index.html

# Custom 404 page
ErrorDocument 404 /404.html

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
```

### 4. Update Domain URLs

After deployment, update these files with your actual domain:

1. **sitemap.xml** - Replace `https://gidelfiavor.com` with your domain
2. **robots.txt** - Update the sitemap URL

### 5. Contact Form Setup

The contact form uses Formspree. To enable it:

1. Go to [formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form
4. Copy your form ID
5. Update `contact/index.html` - replace `YOUR_FORM_ID` with your actual ID

### 6. SSL Certificate

Ensure SSL is enabled in cPanel:
1. Go to **SSL/TLS** in cPanel
2. Install a free Let's Encrypt certificate
3. Force HTTPS redirect

## Updating Content

Since this is a static site, to update content:

1. Edit the source files in `src/app/(site)/`
2. Run `npm run build`
3. Re-upload the `out/` folder contents to cPanel

## Troubleshooting

**Pages not loading:**
- Check that `.htaccess` is uploaded
- Verify mod_rewrite is enabled

**Styles not loading:**
- Ensure the `_next/` folder was uploaded completely
- Check browser console for 404 errors

**Contact form not working:**
- Verify Formspree form ID is correct
- Check Formspree dashboard for submissions
