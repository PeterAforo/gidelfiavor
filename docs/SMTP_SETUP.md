# SMTP Configuration Guide

Configure email sending for contact form and newsletter features.

---

## Option 1: Gmail SMTP (Free, up to 500 emails/day)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

### Step 2: Create App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter: `GidelFiavor Website`
4. Click **Generate**
5. Copy the 16-character password

### Step 3: Add to Render Environment Variables

Go to [Render Dashboard](https://dashboard.render.com) → Your Service → Environment

Add these variables:

| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your-email@gmail.com` |
| `SMTP_PASS` | `your-16-char-app-password` |
| `SMTP_SECURE` | `false` |
| `CONTACT_EMAIL` | `contact@gidelfiavor.com` |

---

## Option 2: SendGrid (Free tier: 100 emails/day)

### Step 1: Create SendGrid Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account
3. Verify your email

### Step 2: Create API Key
1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Select **Full Access**
4. Copy the API key

### Step 3: Add to Render Environment Variables

| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp.sendgrid.net` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `apikey` |
| `SMTP_PASS` | `your-sendgrid-api-key` |
| `SMTP_SECURE` | `false` |
| `CONTACT_EMAIL` | `contact@gidelfiavor.com` |

---

## Option 3: Resend (Free tier: 3,000 emails/month)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up and verify domain

### Step 2: Get API Key
1. Go to **API Keys**
2. Create new key
3. Copy the key

### Step 3: Add to Render Environment Variables

| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp.resend.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `resend` |
| `SMTP_PASS` | `re_your-api-key` |
| `SMTP_SECURE` | `false` |
| `CONTACT_EMAIL` | `contact@gidelfiavor.com` |

---

## Testing Email Configuration

After adding environment variables:

1. Redeploy the backend on Render
2. Go to https://www.gidelfiavor.com/contact
3. Submit a test message
4. Check your inbox for the notification

### Troubleshooting

**Emails not sending:**
- Verify all environment variables are set correctly
- Check Render logs for error messages
- Ensure SMTP credentials are correct

**Gmail blocking:**
- Make sure 2FA is enabled
- Use App Password, not your regular password
- Check for security alerts in Gmail

**Rate limits:**
- Gmail: 500/day
- SendGrid Free: 100/day
- Resend Free: 100/day (3,000/month)

---

## Environment Variables Summary

```env
# Required for email sending
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
CONTACT_EMAIL=contact@gidelfiavor.com

# Optional
SITE_NAME=Gidel Kwasi Fiavor
```
