# Gidel Fiavor — Author Website: Windsurf Cascade Prompt Document

> **Purpose:** This document is a master prompt/blueprint for building the Gidel Fiavor author website in Windsurf IDE using Cascade. Feed sections of this document into Cascade step-by-step to scaffold the entire project. Each section is a self-contained prompt you can copy/paste or reference.

---

## TABLE OF CONTENTS

1. [Project Initialization](#1-project-initialization)
2. [Sanity CMS Setup](#2-sanity-cms-setup)
3. [Sanity Schemas](#3-sanity-schemas)
4. [Sanity Studio Customization](#4-sanity-studio-customization)
5. [Global Layout (Navbar + Footer)](#5-global-layout)
6. [Homepage](#6-homepage)
7. [About Page](#7-about-page)
8. [Books Page & Individual Book Pages](#8-books-page)
9. [Blog Page & Individual Post Pages](#9-blog-page)
10. [Events Page](#10-events-page)
11. [Contact Page](#11-contact-page)
12. [Press Kit / Media Page](#12-press-kit--media-page)
13. [Newsletter Integration](#13-newsletter-integration)
14. [Dark Mode](#14-dark-mode)
15. [SEO & Metadata](#15-seo--metadata)
16. [Animations & Polish](#16-animations--polish)
17. [Deployment](#17-deployment)

---

## 1. PROJECT INITIALIZATION

### Prompt for Cascade:

```
Create a new Next.js 14+ project called "gidel-fiavor" with the following configuration:

- TypeScript enabled
- Tailwind CSS for styling
- App Router (src/app directory)
- ESLint enabled
- src/ directory structure
- Import alias: @/*

After creating the project, install these dependencies:

Production:
- next-sanity (for Sanity CMS integration)
- @sanity/image-url (for image URL building)
- @sanity/vision (for GROQ query testing)
- sanity (Sanity Studio)
- @portabletext/react (for rendering rich text from Sanity)
- framer-motion (for animations)
- lucide-react (for icons)
- react-hook-form (for forms)
- @hookform/resolvers (form validation)
- zod (schema validation)
- next-themes (for dark mode)
- date-fns (date formatting)

Dev:
- @tailwindcss/typography (for prose styling)

Set up the following folder structure inside src/:

src/
├── app/
│   ├── (site)/                # Route group for the public site
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Homepage
│   │   ├── about/page.tsx
│   │   ├── books/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── events/page.tsx
│   │   ├── contact/page.tsx
│   │   └── press/page.tsx
│   ├── studio/[[...tool]]/    # Sanity Studio route
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── contact/route.ts
│   │   ├── newsletter/route.ts
│   │   └── draft/route.ts
│   ├── layout.tsx             # Root layout
│   └── globals.css
├── components/
│   ├── ui/                    # Reusable UI primitives
│   ├── layout/                # Navbar, Footer, MobileMenu
│   ├── home/                  # Homepage section components
│   ├── books/                 # Book-related components
│   ├── blog/                  # Blog-related components
│   └── shared/                # Shared components (Newsletter form, etc.)
├── lib/
│   ├── sanity/
│   │   ├── client.ts          # Sanity client configuration
│   │   ├── image.ts           # Image URL builder
│   │   ├── queries.ts         # All GROQ queries
│   │   └── types.ts           # TypeScript types for Sanity documents
│   └── utils.ts               # General utility functions
├── sanity/
│   ├── schemas/               # All Sanity document schemas
│   ├── sanity.config.ts       # Sanity configuration
│   └── env.ts                 # Sanity environment variables
└── styles/
    └── fonts/                 # Custom fonts if any

Create placeholder files in each directory. Add a .env.local file with these variables (with placeholder values):

NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 2. SANITY CMS SETUP

### Prompt for Cascade:

```
Set up Sanity CMS integration for the Gidel Fiavor Next.js project.

1. Create src/sanity/env.ts:
   - Export environment variables: projectId, dataset, apiVersion from process.env
   - Add validation to ensure variables are defined

2. Create src/lib/sanity/client.ts:
   - Create and export a Sanity client using next-sanity's createClient
   - Configure with projectId, dataset, apiVersion, and useCdn: true for production
   - Export a second client with useCdn: false and the write token for previews/mutations

3. Create src/lib/sanity/image.ts:
   - Set up the image URL builder using @sanity/image-url
   - Export a helper function `urlFor(source)` that returns the image builder

4. Create src/sanity/sanity.config.ts:
   - Configure Sanity with:
     - Project name: "Gidel Fiavor"
     - Base path: "/studio" (so it's embedded in the Next.js app)
     - Plugins: deskTool, visionTool
     - Import all schemas from the schemas directory

5. Create src/app/studio/[[...tool]]/page.tsx:
   - Use next-sanity's NextStudio component to embed Sanity Studio
   - Make it a client component
   - Import the config from sanity.config.ts

6. Create src/app/studio/[[...tool]]/layout.tsx:
   - A minimal layout that doesn't include the site's navbar/footer
   - Set metadata: title "Gidel Fiavor — Content Studio"

The Sanity Studio should be accessible at /studio and allow the author to manage all website content.
```

---

## 3. SANITY SCHEMAS

### Prompt for Cascade:

```
Create comprehensive Sanity CMS schemas for the Gidel Fiavor author website. These schemas should allow the author to manage EVERY aspect of the website from the Sanity Studio.

Create the following schema files in src/sanity/schemas/:

### A. siteSettings.ts (Singleton Document)
Fields:
- siteTitle (string, required) — Website title
- siteDescription (text) — Meta description
- siteLogo (image with alt text)
- ogImage (image) — Default Open Graph image
- socialLinks (array of objects):
  - platform (string: "twitter", "instagram", "facebook", "goodreads", "linkedin", "youtube", "tiktok")
  - url (url, required)
- footerText (string) — Copyright/footer message
- announcement (object):
  - enabled (boolean)
  - message (string)
  - link (url)
  - linkText (string)

### B. homepage.ts (Singleton Document)
Fields:
- heroSection:
  - heading (string) — e.g. "Gidel Fiavor"
  - subheading (string) — Tagline
  - description (text) — Short intro text
  - authorImage (image with hotspot/crop)
  - ctaButton (object: text + link)
  - secondaryButton (object: text + link)
  - backgroundImage (image, optional)
- featuredBook (reference to "book" document)
- featuredBooks (array of references to "book" documents, max 4)
- aboutPreview:
  - heading (string)
  - text (blockContent / portable text)
  - image (image)
  - ctaText (string)
- testimonials (array of objects):
  - quote (text, required)
  - author (string, required)
  - source (string) — e.g. "Goodreads", "Amazon", "NYT"
  - rating (number, 1-5)
- newsletterSection:
  - heading (string)
  - description (text)
  - incentive (string) — e.g. "Get a free chapter of..."

### C. aboutPage.ts (Singleton Document)
Fields:
- heroImage (image with alt)
- heading (string)
- bio (blockContent / portable text — full rich text with images)
- timeline (array of objects):
  - year (string, required)
  - title (string, required)
  - description (text)
- achievements (array of objects):
  - title (string)
  - description (text)
  - icon (string)
- galleryImages (array of images with captions)
- funFacts (array of objects):
  - label (string)
  - value (string)

### D. book.ts (Document)
Fields:
- title (string, required)
- slug (slug, sourced from title, required)
- coverImage (image with alt text, required)
- subtitle (string)
- series (reference to "series" document)
- seriesOrder (number)
- genre (array of strings: "Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance", "Sci-Fi", "Fantasy", "Literary Fiction", "Poetry", "Memoir", "Self-Help", "Other")
- publishDate (date)
- publisher (string)
- isbn (string)
- pageCount (number)
- synopsis (blockContent / portable text)
- shortDescription (text, max 200 chars) — For cards
- sampleChapter (file — PDF upload)
- bookTrailerUrl (url — YouTube/Vimeo)
- purchaseLinks (array of objects):
  - store (string: "Amazon", "Barnes & Noble", "Bookshop.org", "Apple Books", "Kobo", "Audible", "IndieBound", "Author's Store", "Other")
  - url (url, required)
  - format (string: "Hardcover", "Paperback", "eBook", "Audiobook")
  - price (string, optional)
- awards (array of objects):
  - name (string)
  - year (string)
  - image (image, optional)
- reviews (array of objects):
  - quote (text)
  - reviewer (string)
  - source (string)
  - rating (number, 1-5)
- relatedBooks (array of references to other books)
- isFeatured (boolean)
- status (string: "Published", "Coming Soon", "Pre-Order")

### E. series.ts (Document)
Fields:
- title (string, required)
- slug (slug, sourced from title)
- description (blockContent / portable text)
- coverImage (image)
- books (array of references to book documents, ordered)

### F. blogPost.ts (Document)
Fields:
- title (string, required)
- slug (slug, sourced from title, required)
- author (reference to "authorProfile" or just string — since it's a single-author site, a string default "Gidel Fiavor" is fine)
- publishedAt (datetime, required)
- updatedAt (datetime)
- featuredImage (image with alt text)
- excerpt (text, max 300 chars)
- body (blockContent / portable text with embedded images, code blocks, and callouts)
- categories (array of references to "category" documents)
- tags (array of strings)
- readingTime (number) — in minutes
- isFeatured (boolean)
- seo:
  - metaTitle (string)
  - metaDescription (text)
  - ogImage (image)

### G. category.ts (Document)
Fields:
- title (string, required)
- slug (slug, sourced from title)
- description (text)

### H. event.ts (Document)
Fields:
- title (string, required)
- slug (slug, sourced from title)
- eventType (string: "Book Signing", "Reading", "Workshop", "Conference", "Virtual Event", "Book Launch", "Panel", "Interview", "Other")
- date (datetime, required)
- endDate (datetime, optional)
- location (object):
  - venue (string)
  - address (string)
  - city (string)
  - state (string)
  - country (string)
  - isVirtual (boolean)
  - virtualLink (url)
- description (blockContent / portable text)
- image (image)
- registrationLink (url)
- isFree (boolean)
- price (string)
- relatedBook (reference to book)
- status (string: "Upcoming", "Sold Out", "Cancelled", "Completed")

### I. pressItem.ts (Document)
Fields:
- title (string, required)
- type (string: "Interview", "Podcast", "Article", "Review", "Feature", "Video", "Other")
- publication (string) — e.g. "New York Times", "NPR"
- date (date)
- url (url)
- embedUrl (url) — For embedded videos/podcasts
- excerpt (text)
- image (image)
- isFeatured (boolean)

### J. pressKit.ts (Singleton Document)
Fields:
- authorBio (object):
  - short (text, max 150 words)
  - medium (text, max 300 words)
  - full (blockContent)
- authorPhotos (array of images with alt text and "highRes" file attachment)
- bookCovers (array of objects):
  - book (reference to book)
  - highResImage (image)
- factSheet (file — PDF)
- brandGuidelines (file — PDF, optional)
- contactForPress:
  - name (string)
  - email (string)
  - phone (string)

### K. testimonial.ts (Document)
Fields:
- quote (text, required)
- author (string, required)
- role (string) — e.g. "Author of...", "Book Critic"
- source (string) — e.g. "Publishers Weekly"
- rating (number, 1-5)
- relatedBook (reference to book)
- isFeatured (boolean)

### L. faq.ts (Document)
Fields:
- question (string, required)
- answer (blockContent / portable text)
- category (string: "General", "Books", "Events", "Press", "Other")
- order (number)

### M. page.ts (Document — for custom/generic pages)
Fields:
- title (string, required)
- slug (slug, required)
- body (blockContent / portable text)
- seo:
  - metaTitle (string)
  - metaDescription (text)
  - ogImage (image)

### N. blockContent.ts (Custom Type)
Create a reusable blockContent type (Portable Text) that supports:
- Normal text (paragraphs)
- Headings (H2, H3, H4)
- Bold, italic, underline, strikethrough
- Links (internal and external)
- Ordered and unordered lists
- Block quotes
- Images with alt text and captions
- Code blocks
- Callout/highlight boxes
- Embedded YouTube/Vimeo videos

### O. navigation.ts (Singleton Document)
Fields:
- mainNav (array of objects):
  - label (string, required)
  - href (string, required)
  - isExternal (boolean)
  - children (array of objects: label + href) — for dropdowns
- footerNav (array of objects):
  - groupTitle (string)
  - links (array of objects: label + href + isExternal)

Create an index.ts file in the schemas directory that exports all schemas as an array.

For all singleton documents (siteSettings, homepage, aboutPage, pressKit, navigation), add a note that we'll configure the desk structure to show them as single-edit documents rather than lists.

Also create src/lib/sanity/types.ts with TypeScript interfaces for every document type.
```

---

## 4. SANITY STUDIO CUSTOMIZATION

### Prompt for Cascade:

```
Customize the Sanity Studio desk structure for the Gidel Fiavor website so it's organized and intuitive for the author.

Update sanity.config.ts to use a custom desk structure (using structureTool) with the following layout:

📁 Sidebar Structure:
├── 🏠 Site Settings (singleton — opens directly to the document)
├── 🧭 Navigation (singleton)
├── 📄 Pages
│   ├── Homepage (singleton)
│   ├── About Page (singleton)
│   └── Custom Pages (list of "page" documents)
├── 📚 Books
│   ├── All Books (list, ordered by publishDate desc)
│   └── Series (list of series documents)
├── ✍️ Blog
│   ├── All Posts (list, ordered by publishedAt desc)
│   └── Categories
├── 📅 Events (list, ordered by date desc)
├── 💬 Testimonials (list)
├── 📰 Press & Media
│   ├── Press Items (list)
│   └── Press Kit (singleton)
├── ❓ FAQ (list, ordered by "order" field)

For singleton documents, configure the desk so clicking on them opens the document editor directly (not a list with one item).

Add icons to each section using Sanity's built-in icon system or lucide icons.

Also configure document actions for singletons to remove the "delete" and "duplicate" actions since there should only be one of each.
```

---

## 5. GLOBAL LAYOUT

### Prompt for Cascade:

```
Build the global layout for the Gidel Fiavor author website. This layout should fetch navigation data and site settings from Sanity CMS.

### Root Layout (src/app/layout.tsx):
- Import and apply fonts: Use a serif font for headings (like Playfair Display or Cormorant Garamond) and a clean sans-serif for body text (like Inter or Source Sans Pro) from Google Fonts via next/font
- Include the ThemeProvider from next-themes for dark mode
- Minimal — just wraps children with providers

### Site Layout (src/app/(site)/layout.tsx):
- Fetch site settings and navigation from Sanity
- Render Navbar and Footer components
- Pass data to components as props

### Navbar Component (src/components/layout/Navbar.tsx):
- Sticky/fixed at top with a subtle backdrop blur and background on scroll
- Left: Site logo or styled text "Gidel Fiavor" in the serif font
- Center/Right: Navigation links fetched from Sanity (Home, About, Books, Blog, Events, Contact)
- Far right: Dark mode toggle button (sun/moon icon) + a CTA button (e.g. "Latest Book")
- Mobile: Hamburger menu icon that opens a full-screen or slide-in mobile menu
- Smooth transitions and hover effects
- If there's an announcement from site settings and it's enabled, show a dismissible announcement bar above the navbar
- Active link highlighting based on current route (use usePathname)

### Mobile Menu Component (src/components/layout/MobileMenu.tsx):
- Full-screen overlay with the navigation links stacked vertically
- Animated entrance (slide from right or fade in) using Framer Motion
- Social media links at the bottom
- Close button

### Footer Component (src/components/layout/Footer.tsx):
- Multi-column layout:
  - Column 1: "Gidel Fiavor" branding + short tagline + social media icon links (fetched from site settings)
  - Column 2-3: Footer navigation groups from Sanity (Quick Links, Resources, etc.)
  - Column 4: Mini newsletter signup form
- Bottom bar: Copyright text from site settings + "Back to top" button
- Subtle, elegant design that complements the author brand

### Design Direction:
- Color palette: Deep, literary tones — think dark navy (#0a1628), warm cream/ivory (#f5f0e8), gold accent (#c9a84c), and muted sage (#7c8c6e)
- The overall feel should be sophisticated, literary, and warm — like stepping into a well-curated bookshop
- Smooth hover states and micro-interactions
- All data should come from Sanity CMS so the author can update navigation, social links, etc.

### GROQ Queries needed (add to src/lib/sanity/queries.ts):
- fetchSiteSettings: *[_type == "siteSettings"][0]
- fetchNavigation: *[_type == "navigation"][0]
```

---

## 6. HOMEPAGE

### Prompt for Cascade:

```
Build the homepage for the Gidel Fiavor author website. All content should be fetched from the Sanity CMS "homepage" document.

### File: src/app/(site)/page.tsx
This is a server component that fetches all homepage data from Sanity and renders section components.

### Section Components (in src/components/home/):

#### A. HeroSection.tsx
- Full viewport height (min-h-screen) or near it
- Split layout on desktop:
  - Left side: Author name "Gidel Fiavor" in large serif font, tagline below, short description, and two CTA buttons (primary: filled gold, secondary: outlined)
  - Right side: Author image with an artistic frame or subtle parallax effect
- On mobile: Stacked with image on top, text below
- Subtle background texture or gradient (dark navy to slightly lighter)
- Optional: Floating book covers or particle effect in the background
- Animate elements in on load with Framer Motion (staggered fade-up)

#### B. FeaturedBookSection.tsx
- Showcase the single featured book from Sanity
- Large book cover with a 3D tilt/hover effect or shadow
- Book title, short description, genre badges
- Purchase links as buttons with store icons
- "Read More" link to the book's individual page
- Background could be a contrasting warm cream section

#### C. BooksGridSection.tsx
- Heading: "Latest Works" or similar (from Sanity)
- Grid of 3-4 featured book cards
- Each card: Cover image, title, genre, short description, and a "Learn More" link
- Hover effect: Subtle scale-up and shadow increase
- "View All Books" button at the bottom

#### D. AboutPreviewSection.tsx
- Two-column layout: Image on one side, text on the other
- Rich text rendered from Sanity Portable Text
- CTA link to the full About page
- Maybe a decorative quote pull-out

#### E. TestimonialsSection.tsx
- Carousel/slider of reader testimonials
- Each slide: Large quote text, reviewer name, source, and star rating
- Auto-play with manual navigation dots/arrows
- Elegant quotation mark decorations

#### F. LatestBlogPostsSection.tsx
- Heading: "From the Journal" or "Latest Posts"
- Fetch 3 most recent blog posts from Sanity
- Card layout: Featured image, date, category, title, excerpt
- "Read All Posts" link

#### G. EventsPreviewSection.tsx
- Show next 2-3 upcoming events
- Each: Date badge, event title, location, type badge
- "View All Events" link

#### H. NewsletterSection.tsx
- Full-width section with a warm background
- Compelling heading and description from Sanity
- Email input field + subscribe button
- Incentive text (e.g. "Join 5,000+ readers. Get a free chapter!")
- This should connect to the newsletter API route

### GROQ Query (add to queries.ts):
fetchHomepage: Fetch the homepage singleton with all referenced books expanded
fetchLatestPosts: Fetch 3 latest blog posts
fetchUpcomingEvents: Fetch next 3 events where date >= now()
```

---

## 7. ABOUT PAGE

### Prompt for Cascade:

```
Build the About page for the Gidel Fiavor author website. All content from Sanity CMS.

### File: src/app/(site)/about/page.tsx

### Sections:

#### A. Hero/Header
- Full-width hero image from Sanity (with overlay)
- Page title "About Gidel Fiavor" overlaid on the image
- Breadcrumb: Home > About

#### B. BioSection.tsx
- Two-column: Author photo on one side, rich bio text (Portable Text) on the other
- The bio text should support full formatting — headings, bold, italic, links, embedded images
- Use @tailwindcss/typography's prose classes for beautiful text rendering

#### C. TimelineSection.tsx
- Vertical timeline of the author's writing journey
- Data from the "timeline" array in Sanity
- Each entry: Year, title, description
- Alternating left/right on desktop, single column on mobile
- Animate items in on scroll using Framer Motion's whileInView

#### D. AchievementsSection.tsx
- Grid of achievement cards
- Each: Icon, title, description
- Subtle hover animation

#### E. GallerySection.tsx
- Masonry or grid layout of photos
- Lightbox on click (use a simple modal or a library)
- Captions from Sanity

#### F. FunFactsSection.tsx
- Row of fun facts in card format
- e.g. "Books Published: 12", "Countries Visited: 30", "Cups of Coffee: ∞"
- Animated number counter on scroll

#### G. Newsletter CTA at the bottom

### GROQ Query:
fetchAboutPage: *[_type == "aboutPage"][0]
```

---

## 8. BOOKS PAGE

### Prompt for Cascade:

```
Build the Books page and individual book pages for Gidel Fiavor.

### Books Listing — src/app/(site)/books/page.tsx

- Page header with title "Books" and a short intro
- Filter bar:
  - Filter by genre (pill/tag buttons)
  - Filter by series
  - Filter by status (Published, Coming Soon)
  - Sort by: Newest, Oldest, Title A-Z
- Implement filters as client-side state (URL search params for shareability)
- Book grid:
  - Responsive: 1 column mobile, 2 tablet, 3-4 desktop
  - Each BookCard component shows:
    - Cover image with hover zoom effect
    - Title and subtitle
    - Genre badges
    - Status badge if "Coming Soon" or "Pre-Order"
    - Short description (truncated)
    - "Learn More" button
- If books belong to a series, optionally show a "Series" section at the top with collapsible series groups

### Individual Book Page — src/app/(site)/books/[slug]/page.tsx

- Use generateStaticParams to pre-render all book pages at build time
- Generate dynamic metadata for SEO (title, description, OG image using the book cover)
- Layout:
  - Top section — two columns:
    - Left: Large book cover image with subtle shadow/3D effect
    - Right: Title, subtitle, genre tags, publish date, publisher, page count, ISBN
    - Status badge (if Coming Soon/Pre-Order with release date)
    - Star rating (average from reviews)
    - Purchase links as prominent buttons with store logos/icons
    - "Download Sample Chapter" button if sampleChapter exists
  - Synopsis section — Full rich text rendered with Portable Text
  - Book trailer — Embedded YouTube/Vimeo player if bookTrailerUrl exists
  - Awards section — Grid of award badges/images if any
  - Reviews section — Cards with quotes, reviewer names, sources, ratings
  - Series section — If book is part of a series, show other books in the series with order numbers and links
  - Related Books section — Grid of related book cards
  - Back to all books link

### Components needed:
- BookCard.tsx (reusable across homepage and books page)
- BookCover.tsx (with 3D hover effect)
- PurchaseLinks.tsx (styled store buttons)
- BookFilter.tsx (filter/sort controls)
- ReviewCard.tsx
- SeriesBanner.tsx

### GROQ Queries:
fetchAllBooks: *[_type == "book"] | order(publishDate desc) — with all fields
fetchBookBySlug: *[_type == "book" && slug.current == $slug][0] — with series expanded, relatedBooks expanded
fetchAllSeries: *[_type == "series"] — with books expanded
```

---

## 9. BLOG PAGE

### Prompt for Cascade:

```
Build the Blog (Journal) page and individual post pages for Gidel Fiavor.

### Blog Listing — src/app/(site)/blog/page.tsx

- Page header: "The Journal" or "Blog" with a short description
- Featured post at the top (if any post has isFeatured: true):
  - Large card with featured image, title, excerpt, date, reading time
  - Full-width or prominent placement
- Category filter: Horizontal scrollable pill buttons for categories (fetched from Sanity)
- Blog post grid below:
  - Cards with: Featured image, category badge, date, title, excerpt, reading time
  - Responsive: 1 col mobile, 2 col tablet, 3 col desktop
- Pagination or "Load More" button (fetch in batches of 9)
- Sidebar (optional, on desktop):
  - Search bar (client-side filter or Sanity-powered search)
  - Categories list
  - Recent posts (top 5)
  - Newsletter signup mini form

### Individual Post Page — src/app/(site)/blog/[slug]/page.tsx

- generateStaticParams for all posts
- Dynamic metadata + structured data (Article schema)
- Layout:
  - Hero: Featured image (full-width) with title overlaid, category, date, reading time
  - Article body:
    - Max-width prose container (max-w-3xl, centered)
    - Render Portable Text with custom components:
      - Images: Full-width with captions and alt text
      - Code blocks: Syntax highlighted
      - Callout boxes: Styled alert/info boxes
      - YouTube embeds: Responsive iframe
      - Block quotes: Styled with decorative quotation marks
    - Use @tailwindcss/typography for beautiful defaults
  - Tags section at the bottom
  - Author card: Photo, name, short bio
  - Share buttons: Twitter/X, Facebook, LinkedIn, copy link
  - Related posts: 3 posts from the same category
  - Previous/Next post navigation
  - Newsletter CTA

### Components:
- BlogCard.tsx (reusable)
- BlogHero.tsx
- PortableTextComponents.tsx (custom renderers for Sanity Portable Text)
- ShareButtons.tsx
- AuthorCard.tsx
- Pagination.tsx

### GROQ Queries:
fetchAllPosts: *[_type == "blogPost"] | order(publishedAt desc)
fetchPostBySlug: *[_type == "blogPost" && slug.current == $slug][0] — with categories expanded
fetchCategories: *[_type == "category"] | order(title asc)
fetchRelatedPosts: *[_type == "blogPost" && slug.current != $currentSlug && count(categories[@._ref in $categoryIds]) > 0][0...3]
```

---

## 10. EVENTS PAGE

### Prompt for Cascade:

```
Build the Events page for Gidel Fiavor.

### File: src/app/(site)/events/page.tsx

- Page header: "Events & Appearances"
- Two tabs or sections:
  1. "Upcoming" — Events where date >= today, sorted ascending (nearest first)
  2. "Past" — Events where date < today, sorted descending
- Each event card:
  - Date displayed prominently (day + month in a badge/box format)
  - Event title
  - Event type badge (Book Signing, Reading, Virtual, etc.)
  - Location (venue, city) or "Virtual Event" badge
  - Short description (truncated)
  - Status badge (Upcoming, Sold Out, Cancelled)
  - CTA: "Register" button if registrationLink exists, "Watch Recording" if past + has virtual link
  - Related book thumbnail if applicable
- Calendar view toggle (optional): Simple month grid showing event dots
- "No upcoming events" state with a friendly message and newsletter CTA

### Components:
- EventCard.tsx
- EventDateBadge.tsx
- EventFilters.tsx (filter by type, virtual/in-person)

### GROQ Queries:
fetchUpcomingEvents: *[_type == "event" && date >= now()] | order(date asc)
fetchPastEvents: *[_type == "event" && date < now()] | order(date desc)
```

---

## 11. CONTACT PAGE

### Prompt for Cascade:

```
Build the Contact page for Gidel Fiavor.

### File: src/app/(site)/contact/page.tsx

- Page header: "Get in Touch"
- Two-column layout on desktop:
  - Left: Contact info
    - Short paragraph: "I'd love to hear from you. Whether you're a reader, journalist, event organizer, or fellow author..."
    - Inquiry types with descriptions:
      - General inquiries
      - Press & media
      - Speaking engagements
      - Book clubs
      - Rights & permissions
    - Social media links
  - Right: Contact form with fields:
    - Name (required)
    - Email (required, validated)
    - Inquiry Type (dropdown: General, Press, Speaking, Book Club, Rights, Other)
    - Subject (required)
    - Message (textarea, required)
    - Honeypot field (hidden, for spam prevention)
    - Submit button with loading state

- Use react-hook-form with zod validation
- On submit, POST to /api/contact route
- Show success/error toast messages
- The API route should:
  - Validate the data with zod
  - Check honeypot field
  - Send an email using Resend to Gidel's email address
  - Send a confirmation email to the person who submitted
  - Return appropriate status codes

### File: src/app/api/contact/route.ts
- POST handler with validation, honeypot check, and email sending via Resend
- Rate limiting (basic: check for duplicate submissions within 60 seconds)

### Components:
- ContactForm.tsx (client component)
- Toast.tsx or use a toast library
```

---

## 12. PRESS KIT / MEDIA PAGE

### Prompt for Cascade:

```
Build the Press & Media page for Gidel Fiavor.

### File: src/app/(site)/press/page.tsx

- Page header: "Press & Media"
- Two main sections:

#### Section 1: Press Kit
- Download section:
  - Author bios: Short, Medium, Full — each with a "Copy" button and "Download .txt" option
  - Author photos: Grid of downloadable high-res photos with thumbnails
  - Book covers: Grid of downloadable high-res covers
  - Fact sheet: Download PDF button
  - Brand guidelines: Download if available
- Contact for Press: Name, email, phone

#### Section 2: Media Appearances
- Filter by type: Interview, Podcast, Article, Review, Video
- Grid of media cards:
  - Publication logo/name
  - Type badge
  - Title
  - Date
  - Excerpt
  - Link to external article/podcast
  - Embedded player for podcasts/videos where embedUrl is provided (use iframe)
- Featured appearances highlighted at the top

### Components:
- PressKitSection.tsx
- MediaCard.tsx
- MediaEmbed.tsx (handles YouTube, Spotify, etc. embeds responsively)
- DownloadButton.tsx

### GROQ Queries:
fetchPressKit: *[_type == "pressKit"][0] — with book covers' book references expanded
fetchPressItems: *[_type == "pressItem"] | order(date desc)
```

---

## 13. NEWSLETTER INTEGRATION

### Prompt for Cascade:

```
Set up newsletter functionality for the Gidel Fiavor website.

### Approach: Use Resend for email + a simple subscriber management approach
(Alternatively, if the author uses Mailchimp, ConvertKit, or Buttondown, we can integrate with their API.)

### Newsletter Form Component — src/components/shared/NewsletterForm.tsx
- Client component
- Fields: Email (required), First Name (optional)
- Submit button with loading spinner
- Success state: "Welcome! Check your inbox for your free chapter."
- Error state: Friendly error message
- Use react-hook-form + zod
- Posts to /api/newsletter

### API Route — src/app/api/newsletter/route.ts
- POST handler:
  - Validate email with zod
  - Add subscriber to your email service (Resend Audiences, ConvertKit, Mailchimp, etc.)
  - Send a welcome email with the promised incentive (free chapter PDF, etc.)
  - Handle duplicates gracefully ("You're already subscribed!")
  - Rate limiting

### The NewsletterForm component should be reusable and appear in:
- Homepage newsletter section
- Footer (mini version — just email field)
- Blog post pages (after content)
- About page (bottom)
- Dedicated newsletter popup/slide-in (optional, triggered after 30 seconds or scroll depth)

### Newsletter Popup (optional) — src/components/shared/NewsletterPopup.tsx
- Slide-in from bottom-right or modal overlay
- Only shows once per session (use sessionStorage)
- Dismissible
- Same form fields
- Triggered after 30s on page or 50% scroll depth
```

---

## 14. DARK MODE

### Prompt for Cascade:

```
Implement dark mode for the Gidel Fiavor website using next-themes.

### Setup:
1. Wrap the app in ThemeProvider from next-themes in the root layout
   - attribute="class"
   - defaultTheme="system"
   - enableSystem={true}

2. Update tailwind.config.ts:
   - Set darkMode: "class"

3. Define color scheme:
   Light mode:
   - Background: Warm cream (#f5f0e8) / white (#ffffff)
   - Text: Dark navy (#0a1628) / charcoal (#1a1a2e)
   - Primary accent: Gold (#c9a84c)
   - Secondary accent: Sage green (#7c8c6e)
   - Cards: White with subtle warm gray borders

   Dark mode:
   - Background: Deep navy (#0a1628) / dark charcoal (#111827)
   - Text: Cream (#f5f0e8) / light gray (#e5e7eb)
   - Primary accent: Brighter gold (#d4af37)
   - Secondary accent: Lighter sage (#9cac8e)
   - Cards: Dark gray (#1f2937) with subtle borders

4. Create a ThemeToggle component:
   - Sun icon for light mode, moon for dark mode
   - Smooth icon transition animation
   - Place in the Navbar

5. Go through ALL components and ensure they have appropriate dark: variants in Tailwind classes.
   - All backgrounds, text colors, borders, shadows, and hover states need dark mode variants.
   - Images should have slightly reduced brightness in dark mode (dark:brightness-90)
   - Ensure sufficient contrast ratios in both modes (WCAG AA)

6. Add a smooth transition when switching themes:
   - Add transition-colors and duration-300 to the <body> or main wrapper
```

---

## 15. SEO & METADATA

### Prompt for Cascade:

```
Implement comprehensive SEO for the Gidel Fiavor website.

### 1. Root Metadata (src/app/layout.tsx):
- Default metadata using Next.js Metadata API:
  - title: { default: "Gidel Fiavor — Author", template: "%s | Gidel Fiavor" }
  - description from site settings
  - Open Graph: type "website", images from site settings ogImage
  - Twitter card: summary_large_image
  - Canonical URL
  - robots: index, follow
  - Icons/favicons

### 2. Per-Page Metadata:
- Each page should export its own metadata or generateMetadata function
- Books: Use book cover as OG image, synopsis as description
- Blog posts: Use featured image as OG image, excerpt as description
- Events: Include date and location in description

### 3. Structured Data (JSON-LD):
Create a component or utility to inject JSON-LD structured data:
- Homepage: Organization + Person schema for the author
- Book pages: Book schema (https://schema.org/Book) with:
  - name, author, isbn, numberOfPages, publisher, datePublished, image, description, genre, offers (purchase links)
- Blog posts: Article schema with:
  - headline, datePublished, dateModified, author, image, description
- Events: Event schema with:
  - name, startDate, endDate, location, description, offers
- FAQ page: FAQPage schema

### 4. Technical SEO:
- src/app/sitemap.ts: Dynamic sitemap that includes all pages, books, blog posts, events
- src/app/robots.ts: Allow all, point to sitemap, disallow /studio
- RSS Feed: src/app/blog/feed.xml/route.ts — Generate RSS feed for blog posts
- Canonical URLs on every page
- Proper heading hierarchy (one H1 per page)
- Alt text on all images (enforced by Sanity schemas requiring alt text)
- Internal linking strategy in blog posts

### 5. Performance:
- Use Next.js Image component everywhere with proper sizes and priority props
- Lazy load below-the-fold images
- Preload critical fonts
- Keep Largest Contentful Paint under 2.5s
```

---

## 16. ANIMATIONS & POLISH

### Prompt for Cascade:

```
Add animations and micro-interactions throughout the Gidel Fiavor website using Framer Motion.

### Page Transitions:
- Wrap page content in a motion.div with fade + slight slide-up animation
- Create an AnimatePresence wrapper for route changes

### Scroll Animations:
Create a reusable ScrollReveal component that wraps content and animates it in when it enters the viewport:
- Default animation: fade up (opacity 0 → 1, y 20 → 0)
- Props: delay, duration, direction (up, down, left, right)
- Uses whileInView with once: true

Apply ScrollReveal to:
- All homepage sections
- Book cards on the books page
- Timeline items on the about page
- Blog post cards
- Event cards
- Testimonial cards

### Specific Animations:
1. Navbar: Smooth background transition from transparent to solid on scroll
2. Book covers: 3D tilt on hover (use CSS perspective transform or a library)
3. Buttons: Subtle scale-up on hover (scale: 1.02), smooth color transitions
4. Links: Animated underline effect on hover (width from 0 to 100%)
5. Page headings: Staggered letter or word reveal animation
6. Testimonials carousel: Smooth slide/fade transitions
7. Mobile menu: Slide-in from right with staggered nav link animations
8. Newsletter form: Success state with confetti or checkmark animation
9. Back to top button: Fade in when scrolled past first section, smooth scroll to top
10. Image hover: Subtle zoom effect on book covers and blog images
11. Loading states: Skeleton loaders for dynamic content

### Performance Notes:
- Use will-change and transform for GPU-accelerated animations
- Keep animations subtle and fast (200-400ms)
- Respect prefers-reduced-motion: disable or reduce animations for accessibility
- Don't animate layout properties (width, height, top, left) — stick to transform and opacity
```

---

## 17. DEPLOYMENT

### Prompt for Cascade:

```
Prepare the Gidel Fiavor website for deployment on Vercel.

### Steps:

1. Create a vercel.json (if needed) for any custom configuration

2. Environment Variables to set in Vercel:
   - NEXT_PUBLIC_SANITY_PROJECT_ID
   - NEXT_PUBLIC_SANITY_DATASET
   - NEXT_PUBLIC_SANITY_API_VERSION
   - SANITY_API_TOKEN
   - RESEND_API_KEY
   - NEXT_PUBLIC_SITE_URL (set to production URL)

3. Sanity CORS: Add the production URL to Sanity's CORS origins (in Sanity project settings)

4. Sanity Webhooks: Set up a webhook in Sanity that triggers a Vercel redeploy when content changes
   - Or better: Use Next.js revalidation with on-demand ISR
   - Create src/app/api/revalidate/route.ts:
     - Accepts POST from Sanity webhook
     - Validates a secret token
     - Calls revalidatePath() or revalidateTag() for the changed content
     - This ensures the site updates within seconds of content changes in Sanity

5. Caching Strategy:
   - Use Next.js fetch caching with tags
   - Tag each Sanity query (e.g., "books", "posts", "events")
   - On-demand revalidation by tag when content changes

6. Performance Checklist:
   - Run Lighthouse audit and fix any issues
   - Ensure all images use next/image with proper sizes
   - Check bundle size with @next/bundle-analyzer
   - Verify Core Web Vitals

7. Security:
   - Ensure Sanity write token is NEVER exposed client-side
   - Rate limit API routes
   - CSRF protection on forms
   - Content Security Policy headers

8. Analytics:
   - Add Vercel Analytics or Plausible
   - Set up Vercel Speed Insights

9. Create a README.md with:
   - Project overview
   - Tech stack
   - Getting started instructions
   - Environment variables guide
   - Deployment instructions
   - How to manage content in Sanity Studio
```

---

## ADDITIONAL NOTES FOR CASCADE

### Design Tokens (reference throughout):

```
Colors:
  Navy:     #0a1628 (primary dark)
  Charcoal: #1a1a2e
  Cream:    #f5f0e8 (primary light)
  Gold:     #c9a84c (accent)
  Sage:     #7c8c6e (secondary accent)
  White:    #ffffff
  Gray 100: #f3f4f6
  Gray 800: #1f2937

Fonts:
  Heading: Playfair Display (serif) — or Cormorant Garamond
  Body:    Inter (sans-serif) — or Source Sans Pro
  Accent:  Cormorant Garamond italic (for quotes, pull-outs)

Spacing:
  Section padding: py-16 md:py-24
  Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  Card padding: p-6

Border Radius:
  Cards: rounded-lg (0.5rem)
  Buttons: rounded-full or rounded-lg
  Images: rounded-lg

Shadows:
  Cards: shadow-sm hover:shadow-md transition-shadow
  Elevated: shadow-lg
```

### Order of Build (Recommended):
1. Project init + Sanity setup + schemas (Sections 1-4)
2. Global layout with Navbar + Footer (Section 5)
3. Homepage (Section 6)
4. Books pages (Section 8)
5. Blog pages (Section 9)
6. About page (Section 7)
7. Events page (Section 10)
8. Contact page (Section 11)
9. Press page (Section 12)
10. Newsletter integration (Section 13)
11. Dark mode (Section 14)
12. SEO (Section 15)
13. Animations (Section 16)
14. Deployment (Section 17)

### Key Reminders for Cascade:
- Always use TypeScript — strict types for all props and data
- Always use the Next.js Image component for images, never raw <img> tags
- Always make components responsive — mobile-first approach
- Always fetch data from Sanity — no hardcoded content
- Always handle loading and error states
- Always add aria-labels and semantic HTML for accessibility
- Keep components small and focused — extract reusable parts
- Use server components by default, client components only when needed (interactivity, hooks)
```

---

*This document was created as a comprehensive blueprint for building the Gidel Fiavor author website. Feed each section into Windsurf's Cascade one at a time for best results.*
