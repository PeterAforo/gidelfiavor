# Product Requirements Document (PRD)

## Gidel Fiavor - Author Website

---

## 1. Project Overview

**What:** A personal author website for Gidel Fiavor, an author, counselor, and speaker based in Accra, Ghana. The site showcases books, articles, a photo gallery, testimonials, and contact information.

**Who it's for:**
- **Primary:** Readers interested in Gidel Fiavor's books on healing, self-discovery, and personal growth
- **Secondary:** Event organizers, media professionals, and potential collaborators
- **Admin:** The author (Gidel Fiavor) to manage content via a built-in CMS

**Purpose:** Establish an online presence, promote published works, share insights through articles, and provide a way for visitors to connect.

---

## 2. Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18.3 + Vite 5.4 |
| **Language** | TypeScript 5.8 |
| **Styling** | Tailwind CSS 3.4 + CSS Variables |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Routing** | React Router DOM 6.30 |
| **State Management** | TanStack React Query 5.83 |
| **Animations** | Framer Motion 12.34 |
| **Backend/Database** | Supabase (PostgreSQL + Auth + Storage) |
| **Forms** | React Hook Form + Zod validation |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Notifications** | Sonner (toast notifications) |
| **Testing** | Vitest + Testing Library |
| **Build Tool** | Vite with SWC plugin |

---

## 3. Site Architecture

### Public Routes

| Route | Page Component | Description |
|-------|----------------|-------------|
| `/` | `Index.tsx` | Homepage with hero, about preview, books, testimonials, newsletter |
| `/about` | `AboutPage.tsx` | Full author biography and timeline |
| `/books` | `BooksPage.tsx` | List of all published books with details |
| `/articles` | `ArticlesPage.tsx` | Blog/articles listing page |
| `/articles/:id` | `ArticleDetailPage.tsx` | Individual article view |
| `/gallery` | `GalleryPage.tsx` | Photo gallery with masonry layout |
| `/contact` | `ContactPage.tsx` | Contact information and social links |
| `*` | `NotFound.tsx` | 404 error page |

### Admin Routes (Protected)

| Route | Page Component | Description |
|-------|----------------|-------------|
| `/admin` | `AdminLogin.tsx` | Admin login page |
| `/admin/setup` | `AdminSetup.tsx` | Initial admin setup |
| `/admin/dashboard` | `AdminDashboard.tsx` | CMS dashboard with stats |
| `/admin/site-content` | `AdminSiteContent.tsx` | Edit hero, about, contact text |
| `/admin/books` | `AdminBooks.tsx` | CRUD for books |
| `/admin/articles` | `AdminArticles.tsx` | CRUD for articles |
| `/admin/gallery` | `AdminGallery.tsx` | CRUD for gallery images |
| `/admin/testimonials` | `AdminTestimonials.tsx` | CRUD for testimonials |

### Component Map

```
src/
├── components/
│   ├── Navbar.tsx          # Main navigation (responsive)
│   ├── Footer.tsx          # Site footer with links/social
│   ├── HeroSection.tsx     # Homepage hero with stats bar
│   ├── PublicLayout.tsx    # Wrapper for public pages
│   ├── AdminLayout.tsx     # Admin sidebar layout
│   ├── AdminGuard.tsx      # Auth protection for admin routes
│   ├── NavLink.tsx         # Navigation link component
│   └── ui/                 # 49 shadcn/ui components
├── hooks/
│   ├── useCms.ts           # All Supabase data hooks
│   └── useAuth.tsx         # Authentication context
├── integrations/
│   └── supabase/
│       ├── client.ts       # Supabase client config
│       └── types.ts        # Database type definitions
└── assets/                 # Static images (11 files)
```

---

## 4. Feature Inventory

### ✅ Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| **Homepage** | Complete | Hero, about preview, books, testimonials, newsletter sections |
| **Navigation** | Complete | Responsive navbar with mobile menu, scroll-aware styling |
| **Footer** | Complete | Quick links, contact info, social icons |
| **About Page** | Complete | Biography, portrait, stats (years, books, lives touched) |
| **Books Page** | Complete | Book cards with covers, descriptions, tags, alternating layout |
| **Articles Page** | Complete | Article grid with categories, dates, excerpts |
| **Article Detail** | Complete | Full article view with back navigation |
| **Gallery Page** | Complete | Masonry layout with hover captions |
| **Contact Page** | Complete | Email, phone, location, social links |
| **Admin Login** | Complete | Email/password authentication via Supabase |
| **Admin Dashboard** | Complete | Stats cards linking to content sections |
| **Admin Site Content** | Complete | Edit hero tagline, subtitle, about bio, contact info |
| **Admin Books CRUD** | Complete | Add/edit/delete books with cover upload |
| **Admin Articles CRUD** | Complete | Add/edit/delete articles with publish toggle |
| **Admin Gallery CRUD** | Complete | Add/edit/delete images with captions |
| **Admin Testimonials CRUD** | Complete | Add/edit/delete testimonials |
| **File Upload** | Complete | Image upload to Supabase Storage |
| **Role-Based Access** | Complete | Admin role check via `has_role` RPC function |
| **Animations** | Complete | Framer Motion scroll-triggered animations |
| **Dark Theme** | Complete | Dark color scheme with CSS variables |
| **Responsive Design** | Complete | Mobile-first with Tailwind breakpoints |

### ⚠️ Partial/Placeholder Features

| Feature | Status | What's Missing |
|---------|--------|----------------|
| **Newsletter Form** | UI Only | Form exists but `onSubmit` just prevents default - no backend integration |
| **Book Purchase Links** | Placeholder | "Get the Book" buttons link to `#` |
| **Social Media Links** | Placeholder | All social icons link to `#` |
| **SEO Metadata** | Incomplete | `index.html` has TODO comments and placeholder Lovable metadata |

---

## 5. Content Requirements

### Per-Page Content Needs

| Page | Content Required |
|------|------------------|
| **Homepage** | Hero tagline, subtitle, about preview text, stats (editable via CMS) |
| **About** | Full biography (multi-paragraph), portrait image, timeline milestones |
| **Books** | For each book: title, year, description, cover image, tags, purchase URL |
| **Articles** | For each article: title, category, excerpt, full content, publish date |
| **Gallery** | For each image: image file, caption, sort order |
| **Contact** | Email address, phone number, location, social media URLs |
| **Testimonials** | For each: quote text, person name, role/title |

### Current Placeholder Content

- Author bio uses fallback text about "two decades of experience"
- Books page has 3 fallback books if database is empty
- Gallery has 6 fallback images from assets folder
- Contact info defaults to `hello@gidelfiavor.com`, `+1 (234) 567-890`, `Accra, Ghana`

---

## 6. Design System

### Colors (CSS Variables - Dark Theme)

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `0 0% 7%` | Page background |
| `--foreground` | `0 0% 95%` | Primary text |
| `--primary` | `0 72% 51%` | Accent color (red/coral) |
| `--card` | `0 0% 10%` | Card backgrounds |
| `--muted` | `0 0% 14%` | Muted backgrounds |
| `--muted-foreground` | `0 0% 55%` | Secondary text |
| `--border` | `0 0% 16%` | Border color |

### Typography

| Element | Font Family | Weight |
|---------|-------------|--------|
| Headings | Sora | 300-800 |
| Body | Inter | 300-900 |

### Component Library

- **49 shadcn/ui components** installed (accordion, dialog, dropdown, form, toast, etc.)
- Custom components: `HeroSection`, `Navbar`, `Footer`, `AdminLayout`

### Animations

- Framer Motion `useInView` for scroll-triggered fade-in-up effects
- Navbar background transition on scroll
- Mobile menu slide animation
- Hover effects on cards and buttons

---

## 7. Integrations

### Active Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| **Supabase Database** | PostgreSQL for all content (books, articles, gallery, testimonials, site_content) | ✅ Connected |
| **Supabase Auth** | Admin authentication with role-based access | ✅ Connected |
| **Supabase Storage** | Image uploads for book covers and gallery | ✅ Connected |

### Planned/Missing Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| **Newsletter Provider** | Email subscription (Mailchimp, ConvertKit, Resend) | ❌ Not connected |
| **Analytics** | Google Analytics or similar | ❌ Not implemented |
| **Book Purchase** | Amazon, Gumroad, or direct purchase links | ❌ Placeholder links |
| **Social Media** | Actual profile URLs | ❌ Placeholder links |

---

## 8. Non-Functional Requirements

### SEO

| Requirement | Current Status |
|-------------|----------------|
| Page titles | ❌ Generic "Lovable App" in index.html |
| Meta descriptions | ❌ Placeholder "Lovable Generated Project" |
| Open Graph tags | ❌ Placeholder Lovable branding |
| Sitemap | ❌ Not implemented |
| Robots.txt | ❌ Not implemented |

### Performance

| Requirement | Current Status |
|-------------|----------------|
| Image optimization | ⚠️ Using `loading="lazy"` but no image optimization pipeline |
| Code splitting | ✅ Vite handles automatic chunking |
| Bundle size | ✅ Reasonable with tree-shaking |

### Accessibility

| Requirement | Current Status |
|-------------|----------------|
| Semantic HTML | ✅ Proper heading hierarchy, nav, main, footer |
| ARIA labels | ⚠️ Some buttons have labels, social icons have generic labels |
| Keyboard navigation | ✅ Standard browser behavior preserved |
| Color contrast | ⚠️ Dark theme may need contrast review |

### Mobile Responsiveness

| Requirement | Current Status |
|-------------|----------------|
| Mobile navigation | ✅ Hamburger menu with slide-out |
| Responsive layouts | ✅ Grid/flex with Tailwind breakpoints |
| Touch targets | ✅ Adequate button/link sizes |

---

## 9. Open Questions

1. **Newsletter Integration:** Which email service should be used? (Mailchimp, ConvertKit, Resend, etc.)

2. **Book Purchase Flow:** Should books link to Amazon, a direct purchase page, or both?

3. **Social Media URLs:** What are the actual social media profile URLs for Gidel Fiavor?

4. **Contact Form:** Should there be a contact form, or is displaying contact info sufficient?

5. **Analytics:** Which analytics platform should be integrated?

6. **Domain & Hosting:** What is the production domain? Will this be deployed via Lovable, Vercel, or another platform?

7. **Content Migration:** Is there existing content (books, articles, bio) to migrate into the CMS?

8. **Image Assets:** Are the current placeholder images acceptable, or do real photos need to be uploaded?

9. **Author Stats:** Are the stats in the hero section (25 years, 20K+ readers, etc.) accurate or placeholders?

10. **Events/Speaking:** Should there be an events or speaking engagements page?

---

## Database Schema (Supabase)

### Tables

| Table | Columns |
|-------|---------|
| `books` | id, title, year, description, cover_url, tags[], sort_order, created_at, updated_at |
| `articles` | id, title, excerpt, content, category, published, published_at, created_at, updated_at |
| `gallery_images` | id, image_url, caption, sort_order, created_at |
| `testimonials` | id, name, role, quote, sort_order, created_at |
| `site_content` | id, key, value, updated_at |
| `user_roles` | id, user_id, role (enum: admin, user) |

### Functions

| Function | Purpose |
|----------|---------|
| `has_role(_user_id, _role)` | Check if user has specified role |

---

*Document generated: February 2026*
