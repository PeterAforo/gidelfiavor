# Deployment Guide (Vercel + Sanity)

## 1) Vercel Project Setup
- Import the repository into Vercel.
- Framework preset: Next.js.

## 2) Environment Variables
Configure these in Vercel project settings:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`
- `REVALIDATE_SECRET`
- `CONTACT_TO_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

## 3) Sanity CORS and Studio
- Add production domain to Sanity CORS settings.
- Verify Studio is reachable at `/studio` in production.

## 4) Revalidation webhook
- In Sanity webhooks, target: `https://<your-domain>/api/revalidate`
- Include header: `x-webhook-secret: <REVALIDATE_SECRET>`
- Optional payload fields:
  - `path`: route path to revalidate
  - `tag`: cache tag to revalidate

## 5) Resend
- Verify sending domain (or use approved sandbox sender for testing).
- Create a Resend Audience and set `RESEND_AUDIENCE_ID`.

## 6) Pre-launch checklist
- `npm run lint`
- `npm run build`
- Validate sitemap and robots output
- Test newsletter signup and contact form in production
