# Gidel Fiavor Website - PHP Version

A PHP/Bootstrap/MySQL version of the Gidel Fiavor personal website.

## Tech Stack

- **Backend:** PHP 7.4+
- **Frontend:** Bootstrap 5.3, jQuery 3.7
- **Database:** MySQL/MariaDB
- **Icons:** Bootstrap Icons
- **Fonts:** Playfair Display, Inter (Google Fonts)

## Requirements

- XAMPP (or similar with Apache, PHP, MySQL)
- PHP 7.4 or higher
- MySQL 5.7+ or MariaDB 10.3+

## Installation

### 1. Database Setup

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database called `gidelfiavor`
3. Import the schema file: `database/schema.sql`

Or run via MySQL CLI:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure Database Connection

Edit `config/database.php` if needed:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'gidelfiavor');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### 3. Configure Site URL

Edit `config/config.php`:
```php
define('SITE_URL', 'http://localhost/GidelFiavor/php');
```

### 4. Add Images

Copy images to the `assets/images/` folder:
- `hero-image.png` - Hero section image
- `about-portrait.jpg` - About page portrait
- `author-avatar.jpg` - Small author avatar
- `book-placeholder.jpg` - Default book cover
- `article-placeholder.jpg` - Default article image
- `gallery-placeholder.jpg` - Default gallery image

### 5. Access the Site

- **Frontend:** `http://localhost/GidelFiavor/php/`
- **Admin Panel:** `http://localhost/GidelFiavor/php/admin/`

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

**Important:** Change the default password after first login!

## Project Structure

```
php/
├── admin/                  # Admin panel
│   ├── includes/          # Admin header/footer
│   ├── articles.php       # Manage articles
│   ├── books.php          # Manage books
│   ├── dashboard.php      # Admin dashboard
│   ├── gallery.php        # Manage gallery
│   ├── login.php          # Admin login
│   ├── logout.php         # Logout
│   ├── messages.php       # Contact messages
│   ├── site-content.php   # Edit site content
│   └── testimonials.php   # Manage testimonials
├── api/                   # AJAX endpoints
│   ├── contact.php        # Contact form handler
│   └── newsletter.php     # Newsletter subscription
├── assets/
│   ├── css/style.css      # Custom styles
│   ├── js/main.js         # Custom JavaScript
│   └── images/            # Image assets
├── config/
│   ├── config.php         # Site configuration
│   └── database.php       # Database connection
├── database/
│   └── schema.sql         # Database schema
├── includes/
│   ├── header.php         # Site header
│   └── footer.php         # Site footer
├── about.php              # About page
├── article.php            # Single article page
├── articles.php           # Articles listing
├── books.php              # Books listing
├── contact.php            # Contact page
├── gallery.php            # Gallery page
└── index.php              # Homepage
```

## Features

### Frontend
- Responsive design with Bootstrap 5
- Hero section with animated text overlay
- Books showcase with purchase links
- Articles/blog with categories
- Image gallery with lightbox
- Contact form with AJAX submission
- Newsletter subscription

### Admin Panel
- Dashboard with statistics
- CRUD for Books, Articles, Gallery, Testimonials
- Contact message management
- Site content editor (hero, about, contact info, social links)

## Customization

### Colors
Edit CSS variables in `assets/css/style.css`:
```css
:root {
    --primary: #E85A4F;
    --primary-dark: #D14B40;
    --secondary: #F5F5F5;
    --dark: #1A1A1A;
}
```

### Fonts
Fonts are loaded from Google Fonts in `includes/header.php`.

## Security Notes

1. Change default admin password immediately
2. In production, set `display_errors` to `0` in `config/config.php`
3. Use HTTPS in production
4. Sanitize all user inputs (already implemented)
5. Consider adding CSRF protection for forms

## License

Private - Gidel Fiavor
