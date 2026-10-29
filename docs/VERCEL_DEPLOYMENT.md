# Vercel Deployment Guide

The whole site runs in **one Vercel project**:

- **Frontend** (React/Vite) is built to `dist/` and served as static files.
- **Backend API** (Express, `server/index.js`) runs as a serverless function via `api/index.js`.
  `vercel.json` rewrites `/api/*` and `/sitemap.xml` to it.
- **Database** is Neon PostgreSQL (`DATABASE_URL`).
- **Uploads** go directly from the browser to Cloudinary using a signature issued by the API
  (avoids Vercel's 4.5 MB request body limit). Older images in `public/uploads/` are served
  as static files from `dist/uploads/`.

There is no separate backend host and no DNS change: the API lives at
`https://www.gidelfiavor.com/api`.

---

## Environment Variables

Vercel → Project → **Settings → Environment Variables**. Set each for **Production** and **Preview**.

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon connection string (pooled `-pooler` host) |
| `JWT_SECRET` | Long random string. Generate with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `/api` (or leave unset; `.env.production` already sets it) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` | Optional, for contact-form emails |

The API refuses to issue or verify logins in production if `JWT_SECRET` is missing.
Changing `JWT_SECRET` logs out every admin session.

---

## Admin Password

There is no default admin account. To create an admin or reset a password, run this locally
from the project root (it uses `DATABASE_URL` from your local `.env`):

```powershell
node server/scripts/set-admin-password.js
```

You are prompted for the email and the new password (hidden, min 12 characters).

---

## Deploying

1. Push a branch → Vercel builds a **Preview** deployment. Test:
   - `<preview-url>/api/health` returns JSON
   - `<preview-url>/api/books` returns books
   - `<preview-url>/sitemap.xml` returns XML
   - CMS login at `<preview-url>/admin`, edit something, upload an image
2. Merge to `main` → Vercel deploys to production (`www.gidelfiavor.com`).

---

## Local Development

```powershell
node server/index.js   # API on http://localhost:3001 (reads .env)
npm run dev            # frontend on http://localhost:8080
```

`.env` points the frontend at `http://localhost:3001/api`; production builds use `/api`.

---

## Troubleshooting

### Every `/api/...` route returns 404 on Vercel
The rewrite didn't preserve the request path. Rename `api/index.js` to `api/[...path].js`
and remove the first rewrite in `vercel.json`.

### API returns 500 "JWT_SECRET environment variable is required"
Set `JWT_SECRET` in Vercel and redeploy.

### Function crashes with "DATABASE_URL environment variable is required"
Set `DATABASE_URL` in Vercel and redeploy.

### Uploads fail
Check the three `CLOUDINARY_*` variables. Files over 10 MB are rejected in the browser.

### Logs
Vercel → Project → **Logs** (filter by `/api`).

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Console**: https://console.neon.tech
- **Cloudinary Console**: https://console.cloudinary.com
