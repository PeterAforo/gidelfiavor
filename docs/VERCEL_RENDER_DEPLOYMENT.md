# Vercel + Render Deployment Guide

Deploy your frontend to Vercel (free) and backend to Render (free).

---

## Part 1: Deploy Backend to Render

### Step 1: Push code to GitHub

First, make sure your code is on GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/gidelfiavor.git
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com) and sign up (free)
2. Connect your GitHub account

### Step 3: Deploy Backend

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `gidelfiavor-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free

4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `API_PORT` = `3001`
   - `DATABASE_URL` = `your-neon-postgresql-connection-string`

5. Click **Create Web Service**

6. Wait for deployment (2-5 minutes)

7. **Copy your Render URL** (e.g., `https://gidelfiavor-api.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Connect your GitHub account

### Step 2: Import Project

1. Click **Add New...** → **Project**
2. Select your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://gidelfiavor-api.onrender.com/api`
   
   (Use your actual Render URL from Step 1)

5. Click **Deploy**

6. Wait for deployment (1-2 minutes)

---

## Part 3: Configure CORS on Backend

After deployment, you need to allow your Vercel domain to access the API.

Edit `server/index.js` and update the CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'https://your-app.vercel.app',  // Add your Vercel URL
    'https://gidelfiavor.com'        // Add your custom domain
  ],
  credentials: true
}));
```

Then redeploy the backend on Render.

---

## Part 4: Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `gidelfiavor.com`)
3. Update DNS records as instructed

### For Render (Backend):
1. Go to your service → **Settings** → **Custom Domains**
2. Add subdomain (e.g., `api.gidelfiavor.com`)
3. Update DNS records as instructed

---

## Environment Variables Summary

### Vercel (Frontend):
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://gidelfiavor-api.onrender.com/api` |

### Render (Backend):
| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `API_PORT` | `3001` |
| `DATABASE_URL` | Your Neon PostgreSQL connection string |

---

## Updating Your Site

### Frontend updates:
1. Push changes to GitHub
2. Vercel automatically redeploys

### Backend updates:
1. Push changes to GitHub
2. Render automatically redeploys

---

## Free Tier Limitations

### Vercel Free:
- Unlimited deployments
- 100GB bandwidth/month
- Custom domains included

### Render Free:
- Spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month

**Tip**: For production, consider upgrading Render to $7/month to prevent sleep.

---

## Troubleshooting

### API returns CORS error
- Add your Vercel domain to the CORS whitelist in `server/index.js`
- Redeploy backend

### Backend is slow on first request
- Free Render instances sleep after inactivity
- First request "wakes up" the server (~30 seconds)

### Images not uploading
- Render's free tier has ephemeral storage
- Use a cloud storage service (Cloudinary, AWS S3) for persistent uploads

### Database connection errors
- Verify `DATABASE_URL` is set correctly in Render
- Check Neon database is accessible

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Neon Console**: https://console.neon.tech
