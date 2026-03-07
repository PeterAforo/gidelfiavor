# cPanel Deployment Guide for Gidel Fiavor Website

This guide walks you through deploying the full-stack application to cPanel hosting.

## Prerequisites

- cPanel hosting with Node.js support (Node.js 18+)
- SSH access (recommended) or File Manager
- Your Neon PostgreSQL database connection string

---

## Step 1: Build the Frontend

On your local machine, run:

```bash
cd d:\xampp\htdocs\GidelFiavor
npm run build
```

This creates a `dist/` folder with the production-ready frontend.

---

## Step 2: Prepare Files for Upload

### File Structure on cPanel:

```
/home/username/
├── public_html/              # Frontend files (from dist/)
│   ├── index.html
│   ├── assets/
│   ├── uploads/              # User uploads folder
│   └── .htaccess
├── gidelfiavor-api/          # Backend (outside public_html)
│   ├── index.js
│   ├── package.json
│   ├── validation.js
│   ├── socialMediaApi.js
│   ├── .env                  # Environment variables
│   └── ecosystem.config.cjs
```

---

## Step 3: Upload Frontend

1. Open **cPanel → File Manager**
2. Navigate to `public_html/`
3. Delete existing files (backup if needed)
4. Upload all contents from your local `dist/` folder
5. Upload the `.htaccess` file from `public_html/.htaccess`
6. Create an `uploads/` folder inside `public_html/`
7. Set permissions on `uploads/` to `755`

---

## Step 4: Upload Backend

1. In File Manager, go to `/home/username/` (outside public_html)
2. Create a folder called `gidelfiavor-api`
3. Upload these files from your `server/` folder:
   - `index.js`
   - `package.json`
   - `validation.js`
   - `socialMediaApi.js`
   - `ecosystem.config.cjs`

---

## Step 5: Configure Environment Variables

1. In `gidelfiavor-api/`, create a file called `.env`
2. Add the following (replace with your actual values):

```env
NODE_ENV=production
API_PORT=3001

# Your Neon PostgreSQL connection string
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Email settings (optional, for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@yourdomain.com
```

---

## Step 6: Setup Node.js Application

1. Go to **cPanel → Setup Node.js App**
2. Click **Create Application**
3. Fill in:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `gidelfiavor-api`
   - **Application URL**: Leave as your domain
   - **Application startup file**: `index.js`
4. Click **Create**
5. Click **Run NPM Install** to install dependencies
6. Click **Start App**

---

## Step 7: Configure Reverse Proxy (Important!)

Your frontend needs to communicate with the backend. There are two options:

### Option A: Using .htaccess Proxy (if mod_proxy enabled)

Edit `public_html/.htaccess` and uncomment the proxy line:

```apache
RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]
```

### Option B: Using cPanel's Application URL

If mod_proxy isn't available:

1. In cPanel Node.js App settings, note the assigned port
2. Update your frontend's API URL to use the full backend URL
3. Configure CORS in the backend if needed

---

## Step 8: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check the admin panel: `https://yourdomain.com/admin`
3. Test API: `https://yourdomain.com/api/books`

---

## Troubleshooting

### Frontend shows blank page
- Check browser console for errors
- Verify `.htaccess` is uploaded and working
- Check if `index.html` exists in `public_html/`

### API returns 502/503 errors
- Check if Node.js app is running in cPanel
- View application logs in cPanel → Setup Node.js App
- Verify `.env` file has correct DATABASE_URL

### Images not uploading
- Check `uploads/` folder permissions (should be 755)
- Verify the upload path in server configuration

### Database connection errors
- Verify DATABASE_URL in `.env`
- Check if Neon database is accessible from your hosting IP
- Test connection string locally first

---

## Updating the Site

### Frontend updates:
1. Run `npm run build` locally
2. Upload new `dist/` contents to `public_html/`

### Backend updates:
1. Upload changed files to `gidelfiavor-api/`
2. In cPanel → Setup Node.js App, click **Restart**

---

## SSL Certificate

1. Go to **cPanel → SSL/TLS Status**
2. Click **Run AutoSSL** to get free Let's Encrypt certificate
3. Or install your own certificate in **SSL/TLS → Manage SSL Sites**

---

## Support

If you encounter issues:
1. Check cPanel error logs: **cPanel → Errors**
2. Check Node.js app logs in Setup Node.js App
3. Verify all environment variables are set correctly
