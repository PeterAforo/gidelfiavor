# Gidel Kwasi Fiavor - Personal Portfolio & CMS

Official website for **Elder Gidel Kwasi Fiavor** - Author, Theologian & Healthcare Marketing Specialist.

🌐 **Live Site**: [www.gidelfiavor.com](https://www.gidelfiavor.com)

---

## Features

- **Full CMS** - Manage books, articles, gallery, testimonials
- **Page Builder** - Drag-and-drop page sections
- **Admin Dashboard** - Complete content management
- **Blog/Articles** - Rich text editor with categories
- **Gallery** - Album-based photo management
- **Contact Form** - With email notifications
- **Newsletter** - Subscriber management
- **SEO Optimized** - Sitemap, meta tags, structured data
- **Responsive** - Mobile-first design

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Express.js, Node.js |
| Database | PostgreSQL (Neon) |
| Auth | JWT, bcrypt |
| Hosting | Vercel (frontend), Render (backend) |
| Images | Cloudinary CDN |

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Clone repository
git clone https://github.com/PeterAforo/gidelfiavor.git
cd gidelfiavor

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run development servers
npm run dev:all
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run server` | Start backend server |
| `npm run dev:all` | Start both servers |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
├── src/                  # Frontend React app
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   └── test/            # Unit tests
├── server/              # Backend Express API
│   ├── index.js         # Main server file
│   ├── auth.js          # JWT authentication
│   ├── emailService.js  # Email sending
│   └── cloudinary.js    # Image uploads
├── e2e/                 # Playwright E2E tests
├── docs/                # Documentation
│   ├── API.md           # API documentation
│   ├── COMPONENTS.md    # Component docs
│   ├── SMTP_SETUP.md    # Email configuration
│   └── CLOUDINARY_SETUP.md  # Image storage setup
└── public/              # Static assets
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-key
```

### Backend (server/.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email
SMTP_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

---

## Deployment

### Frontend (Vercel)
- Connect GitHub repo to Vercel
- Set `VITE_API_URL` to production API URL
- Deploy automatically on push

### Backend (Render)
- Create Web Service from GitHub
- Set environment variables
- Deploy automatically on push

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## Documentation

- [API Documentation](docs/API.md)
- [Component Documentation](docs/COMPONENTS.md)
- [SMTP Setup](docs/SMTP_SETUP.md)
- [Cloudinary Setup](docs/CLOUDINARY_SETUP.md)

---

## Testing

```bash
# Unit tests
npm run test

# E2E tests (requires Playwright)
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Author

**Gidel Kwasi Fiavor**
- Website: [gidelfiavor.com](https://www.gidelfiavor.com)
- GitHub: [PeterAforo](https://github.com/PeterAforo)
