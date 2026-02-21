# Gidel Fiavor Website

CMS-driven author website for Gidel Fiavor built with Next.js App Router, Sanity Studio, and Resend.

## Stack
- Next.js 16 (TypeScript, App Router)
- Tailwind CSS 4
- Sanity CMS + embedded Studio (`/studio`)
- Framer Motion for interaction
- next-themes for dark mode
- Resend for contact and newsletter workflows

## Features
- Public pages: Home, About, Books, Book detail, Blog, Post detail, Events, Contact, Press
- API routes: contact, newsletter (Resend Audiences), draft mode, revalidate webhook
- SEO: metadata API, sitemap, robots, RSS feed
- Structured Sanity schema set and custom desk structure for singleton documents

## Local setup
1. Install dependencies: `npm install`
2. Fill `.env.local`
3. Run: `npm run dev`
4. Open:
   - Site: `http://localhost:3000`
   - Studio: `http://localhost:3000/studio`

## Required environment variables
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`
- `REVALIDATE_SECRET`
- `CONTACT_TO_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

## Notes
- Keep `SANITY_API_TOKEN` and `RESEND_API_KEY` server-only.
- Add production domain to Sanity CORS settings.
- Configure Sanity webhook to call `/api/revalidate` with `x-webhook-secret`.
