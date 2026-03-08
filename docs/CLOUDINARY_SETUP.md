# Cloudinary Setup Guide

Configure Cloudinary for persistent image storage. Without this, uploaded files are lost when Render redeploys.

---

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a **free account** (25GB storage, 25GB bandwidth/month)
3. Verify your email

---

## Step 2: Get API Credentials

1. Go to your [Cloudinary Dashboard](https://console.cloudinary.com/console)
2. Find your credentials in the **Account Details** section:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## Step 3: Add to Render Environment Variables

Go to [Render Dashboard](https://dashboard.render.com) → Your Service → Environment

Add these variables:

| Variable | Value |
|----------|-------|
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | `your-api-key` |
| `CLOUDINARY_API_SECRET` | `your-api-secret` |

---

## Step 4: Redeploy

After adding the environment variables, redeploy your backend service on Render.

---

## How It Works

When Cloudinary is configured:
- All uploaded images are stored in Cloudinary's CDN
- Images are automatically optimized (WebP, compression)
- Responsive image URLs are generated
- Files persist across Render redeploys

When Cloudinary is NOT configured:
- Files are stored locally on Render
- Files are **lost** when Render redeploys or restarts
- This is fine for development but not production

---

## Free Tier Limits

| Resource | Limit |
|----------|-------|
| Storage | 25 GB |
| Bandwidth | 25 GB/month |
| Transformations | 25,000/month |
| Video | 500 MB |

This is more than enough for a personal portfolio site.

---

## Testing

After configuration, upload an image through the admin panel. Check that:
1. The image URL starts with `https://res.cloudinary.com/`
2. The image loads correctly on the frontend
3. The image persists after a Render redeploy

---

## Environment Variables Summary

```env
# Cloudinary (for persistent image storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret-here
```
