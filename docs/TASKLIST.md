# Task List

## Gidel Fiavor - Author Website

---

## Completed

### Navigation
- [x] Responsive navbar with mobile hamburger menu
- [x] Scroll-aware navbar background transition
- [x] Active link highlighting based on current route
- [x] Logo linking to homepage

### Hero Section
- [x] Full-height hero with background image
- [x] Animated tagline, title, and subtitle
- [x] Two CTA buttons (Explore Books, Learn More)
- [x] Stats bar at bottom (Years, Readers, Workshops, Lives)
- [x] Content editable via CMS (hero_tagline, hero_subtitle)

### About Page
- [x] Author portrait with decorative border
- [x] Multi-paragraph biography (CMS-editable)
- [x] Stats display (20+ years, 3 books, 10K+ lives)
- [x] Scroll-triggered animations

### Books Page
- [x] Book listing with alternating layout
- [x] Book cover images (from CMS or fallback)
- [x] Title, year, description, tags display
- [x] "Get the Book" CTA buttons
- [x] Fallback content when database is empty

### Articles/Blog
- [x] Articles listing page with grid layout
- [x] Category badges and date display
- [x] Article excerpts with "Read more" links
- [x] Individual article detail page
- [x] Back navigation to articles list
- [x] Empty state message when no articles

### Gallery
- [x] Masonry/columns layout for images
- [x] Hover effect with caption overlay
- [x] Lazy loading for images
- [x] Fallback images when database is empty

### Contact Page
- [x] Email, phone, location display
- [x] Social media icon links
- [x] CMS-editable contact information

### Footer
- [x] Brand name and tagline
- [x] Quick links navigation
- [x] Contact information
- [x] Social media icons
- [x] Copyright notice

### Admin CMS
- [x] Admin login with email/password
- [x] Role-based access control (admin role check)
- [x] Dashboard with content stats
- [x] Site content editor (hero, about, contact fields)
- [x] Books CRUD with image upload
- [x] Articles CRUD with publish/draft toggle
- [x] Gallery images CRUD with captions
- [x] Testimonials CRUD
- [x] Responsive admin sidebar layout
- [x] Toast notifications for actions

### Technical Infrastructure
- [x] Supabase database integration
- [x] Supabase authentication
- [x] Supabase storage for file uploads
- [x] React Query for data fetching/caching
- [x] TypeScript type definitions for database
- [x] Framer Motion animations
- [x] Tailwind CSS with custom design tokens
- [x] shadcn/ui component library (49 components)
- [x] Vite build configuration
- [x] ESLint configuration

---

## In Progress / Partial

### Newsletter Section
- [x] Newsletter form UI on homepage
- [x] Email input field with subscribe button
- [ ] **Backend integration missing** - form `onSubmit` only prevents default, no actual subscription logic

### SEO & Metadata
- [x] Basic HTML structure in index.html
- [ ] **Page title is placeholder** - "Lovable App" needs to be "Gidel Fiavor"
- [ ] **Meta description is placeholder** - "Lovable Generated Project"
- [ ] **OG tags are placeholder** - Lovable branding instead of author branding
- [ ] **OG image is placeholder** - Points to Lovable image

### Book Purchase Links
- [x] "Get the Book" button UI exists
- [ ] **Links are placeholder** - All buttons link to `#` instead of actual purchase URLs

### Social Media Links
- [x] Social icon buttons in footer and contact page
- [ ] **Links are placeholder** - All icons link to `#` instead of actual profiles

---

## To Do — High Priority

### SEO & Metadata
- [ ] Update `index.html` title to "Gidel Fiavor - Author, Counselor, Speaker"
- [ ] Update meta description with author-specific content
- [ ] Update OG title, description, and image
- [ ] Remove TODO comments from index.html
- [ ] Add favicon (currently using default)

### Newsletter Integration
- [ ] Choose email service provider (Mailchimp, ConvertKit, Resend, etc.)
- [ ] Implement newsletter subscription API
- [ ] Add success/error handling to newsletter form
- [ ] Store subscriber emails or send to external service

### Real Content
- [ ] Replace placeholder author bio with real biography
- [ ] Add real book data (titles, descriptions, purchase links)
- [ ] Upload actual book cover images
- [ ] Upload real author portrait photo
- [ ] Upload real gallery photos
- [ ] Add real testimonials from readers
- [ ] Set correct contact email, phone, location

### Social Media
- [ ] Add actual Instagram profile URL
- [ ] Add actual Twitter/X profile URL
- [ ] Add actual Facebook profile URL
- [ ] Add actual YouTube channel URL

### Book Purchase
- [ ] Add Amazon or purchase links to each book
- [ ] Consider adding multiple purchase options (Amazon, direct, etc.)

---

## To Do — Nice to Have

### Features
- [ ] Contact form with email sending (currently just displays contact info)
- [ ] Events/speaking engagements page
- [ ] Search functionality for articles
- [ ] Article categories/tags filtering
- [ ] Related articles suggestions
- [ ] Book preview/sample chapters
- [ ] Author video introduction
- [ ] Podcast appearances section

### Analytics & Tracking
- [ ] Google Analytics or Plausible integration
- [ ] Event tracking for CTA clicks
- [ ] Newsletter signup tracking

### Performance
- [ ] Image optimization pipeline (WebP, responsive sizes)
- [ ] Sitemap.xml generation
- [ ] Robots.txt file
- [ ] Preload critical assets

### Accessibility
- [ ] Full accessibility audit
- [ ] Improve ARIA labels on social media buttons
- [ ] Verify color contrast ratios
- [ ] Add skip-to-content link
- [ ] Test with screen reader

### Design Enhancements
- [ ] Light mode theme option
- [ ] Theme toggle in navbar
- [ ] Page transition animations
- [ ] Loading skeletons for content
- [ ] Image lightbox for gallery
- [ ] Scroll progress indicator

### Admin Enhancements
- [ ] Rich text editor for articles (currently plain textarea)
- [ ] Image cropping/resizing on upload
- [ ] Drag-and-drop reordering for books/gallery
- [ ] Preview mode before publishing
- [ ] Content revision history
- [ ] Multiple admin users support

---

## Technical Debt

### Code Cleanup
- [ ] Remove `lovable-tagger` dev dependency (Lovable-specific)
- [ ] Update package name from `vite_react_shadcn_ts` to `gidel-fiavor-website`
- [ ] Remove unused shadcn/ui components to reduce bundle size
- [ ] Add proper TypeScript types to `any` usages in hooks

### Configuration
- [ ] Remove TODO comments from `index.html`
- [ ] Update README.md with project-specific documentation
- [ ] Add `.env.example` file for environment variables
- [ ] Configure production environment variables

### Testing
- [ ] Add unit tests for hooks (useCms, useAuth)
- [ ] Add component tests for key UI components
- [ ] Add E2E tests for critical user flows
- [ ] Test admin CRUD operations

### Documentation
- [ ] Document Supabase database schema setup
- [ ] Document admin user creation process
- [ ] Add deployment instructions
- [ ] Document environment variables required

---

## Environment Variables Required

| Variable | Purpose | Current Status |
|----------|---------|----------------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ Set in .env |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | ✅ Set in .env |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | ✅ Set in .env |

---

## Known Issues

1. **index.html TODO comments** - Two TODO comments need to be addressed:
   - Line 6: `<!-- TODO: Set the document title to the name of your application -->`
   - Line 11: `<!-- TODO: Update og:title to match your application name -->`

2. **Newsletter form non-functional** - The newsletter form in `Index.tsx` line 116 has `onSubmit={(e) => e.preventDefault()}` with no actual submission logic.

3. **Placeholder links** - Multiple `href="#"` links throughout:
   - Book "Get the Book" buttons in `BooksPage.tsx` line 71
   - Social media icons in `Footer.tsx` line 43
   - Social media icons in `ContactPage.tsx` line 41

4. **Generic metadata** - `index.html` contains Lovable placeholder branding that needs to be replaced with Gidel Fiavor branding.

---

*Task list generated: February 2026*
