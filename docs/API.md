# API Documentation

Base URL: `https://gidelfiavor-api.onrender.com`

---

## Authentication

### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "New User"
}
```

---

## Books

### GET /api/books
Get all published books.

**Query Parameters:**
- `published` (boolean): Filter by published status

**Response:**
```json
[
  {
    "id": 1,
    "title": "Book Title",
    "description": "Book description...",
    "cover_image": "https://...",
    "amazon_link": "https://amazon.com/...",
    "published": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/books/:id
Get a single book by ID.

### POST /api/books
Create a new book (requires authentication).

### PUT /api/books/:id
Update a book (requires authentication).

### DELETE /api/books/:id
Delete a book (requires authentication).

---

## Articles

### GET /api/articles
Get all published articles.

**Query Parameters:**
- `published` (boolean): Filter by published status
- `category` (string): Filter by category
- `limit` (number): Limit results

**Response:**
```json
[
  {
    "id": 1,
    "title": "Article Title",
    "content": "Article content...",
    "excerpt": "Short excerpt...",
    "category": "Healthcare",
    "image_url": "https://...",
    "published": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/articles/:id
Get a single article by ID.

### POST /api/articles
Create a new article (requires authentication).

### PUT /api/articles/:id
Update an article (requires authentication).

### DELETE /api/articles/:id
Delete an article (requires authentication).

---

## Gallery

### GET /api/gallery
Get all gallery albums.

### GET /api/gallery/:id
Get album with media items.

### POST /api/gallery
Create a new album (requires authentication).

### POST /api/gallery/:id/media
Add media to an album (requires authentication).

### DELETE /api/gallery/:id
Delete an album (requires authentication).

---

## Testimonials

### GET /api/testimonials
Get all approved testimonials.

### POST /api/testimonials
Submit a new testimonial.

### PUT /api/testimonials/:id
Update testimonial (requires authentication).

### DELETE /api/testimonials/:id
Delete testimonial (requires authentication).

---

## Pages (Page Builder)

### GET /api/pages
Get all pages.

### GET /api/pages/:slug
Get page by slug with sections.

### POST /api/pages
Create a new page (requires authentication).

### PUT /api/pages/:id
Update page (requires authentication).

### DELETE /api/pages/:id
Delete page (requires authentication).

---

## Page Sections

### GET /api/pages/:pageId/sections
Get all sections for a page.

### POST /api/pages/:pageId/sections
Add section to page (requires authentication).

### PUT /api/sections/:id
Update section (requires authentication).

### DELETE /api/sections/:id
Delete section (requires authentication).

---

## Contact

### POST /api/contact
Submit contact form.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

---

## Newsletter

### POST /api/newsletter/subscribe
Subscribe to newsletter.

**Request:**
```json
{
  "email": "subscriber@example.com"
}
```

---

## Site Settings

### GET /api/site-settings
Get public site settings.

### PUT /api/site-settings
Update site settings (requires authentication).

---

## Health & Monitoring

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 123456,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### GET /api/monitoring/alerts
Get system alerts (requires authentication).

---

## SEO

### GET /sitemap.xml
Dynamic sitemap for search engines.

### GET /robots.txt
Robots.txt file.

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- Standard endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 requests per hour
- Contact form: 20 requests per 15 minutes

---

## Authentication Headers

For protected endpoints, include the JWT token:

```
Authorization: Bearer <token>
```
