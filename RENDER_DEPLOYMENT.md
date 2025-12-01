# Render Deployment Guide for Chat App

## 🚀 Deploy Next.js + Socket.IO Chat App to Render

This guide will help you deploy your chat application (with custom server.ts) to Render's free tier.

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Render account (free) - [render.com](https://render.com)
- ✅ Supabase database set up
- ✅ Clerk authentication configured

---

## 1️⃣ Prepare Your Project

### ✅ Your project is already configured!

The following files have been updated for deployment:

**`package.json`** - Build and start scripts configured:
```json
{
  "scripts": {
    "dev": "ts-node server.ts",
    "build": "next build && tsc --project tsconfig.server.json",
    "start": "node dist/server.js"
  }
}
```

**`server.ts`** - Uses dynamic PORT from environment:
```typescript
const PORT = parseInt(process.env.PORT || "3000", 10);
```

**`tsconfig.server.json`** - Separate config for compiling server code

---

## 2️⃣ Push to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/chatting.git
git branch -M main
git push -u origin main
```

---

## 3️⃣ Create Render Web Service

### Step 1: Go to Render Dashboard
- Visit [https://dashboard.render.com](https://dashboard.render.com)
- Click **"New +"** → **"Web Service"**

### Step 2: Connect Repository
- Click **"Connect a repository"**
- Authorize GitHub if needed
- Select your `chatting` repository

### Step 3: Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `chatting-app` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` (from your .env) |
| `CLERK_SECRET_KEY` | `sk_test_...` (from your .env) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` |

⚠️ **Important:** Render automatically sets `PORT` - don't add it manually!

### Step 5: Deploy!

Click **"Create Web Service"**

Render will:
1. Clone your repo
2. Run `npm install`
3. Run `npm run build` (builds Next.js + compiles server.ts)
4. Run `npm start` (starts your server)

---

## 4️⃣ Monitor Deployment

### Watch the Logs

You'll see output like:
```
==> Installing dependencies
==> Building application
==> Starting service
Server running on port 10000
```

### First deployment takes ~3-5 minutes

---

## 5️⃣ Update Socket.IO Client URL

Once deployed, you'll get a URL like:
```
https://chatting-app.onrender.com
```

Update `app/page.tsx`:

```typescript
// Change this line:
const s = io("http://localhost:3000");

// To this:
const s = io(window.location.origin);
```

This makes it work both locally and in production!

Then commit and push:
```bash
git add app/page.tsx
git commit -m "Use dynamic Socket.IO URL"
git push
```

Render will auto-deploy the update.

---

## 6️⃣ Test Your Deployed App

1. Visit your Render URL: `https://your-app.onrender.com`
2. Sign in with Clerk
3. Send messages - they should persist in Supabase!
4. Open in multiple tabs/browsers to test real-time chat

---

## 🎯 Architecture on Render

```
Your App on Render:
┌─────────────────────────────────────┐
│  server.js (Node.js)                │
│  ├── Next.js (Frontend)             │
│  ├── Socket.IO (WebSocket)          │
│  └── HTTP Server                    │
└─────────────────────────────────────┘
           │
           ├──> Clerk (Authentication)
           └──> Supabase (Database)
```

All running on a **single server** - no serverless needed!

---

## ⚠️ Important Notes

### Free Tier Limitations
- Service spins down after 15 min of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free (enough for one service 24/7)

### Keeping It Awake (Optional)
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your app every 5 minutes.

### Environment Variables
- Never commit `.env` file to GitHub
- Always add env vars in Render dashboard
- Render doesn't use `.env` files

---

## 🐛 Troubleshooting

### Build Fails
**Check the build logs:**
- Look for TypeScript errors
- Verify all dependencies are in `dependencies` (not `devDependencies`)

**Common fix:**
```bash
# Move TypeScript to dependencies
npm install --save typescript ts-node
```

### "Application failed to respond"
- Check Start Command is `npm start`
- Verify `PORT` is used from `process.env.PORT`
- Check logs for errors

### Socket.IO not connecting
- Make sure you updated the Socket.IO URL to use `window.location.origin`
- Check CORS settings allow your domain
- Verify WebSocket protocol is `wss://` (Render handles this automatically)

### Messages not persisting
- Verify Supabase environment variables are correct
- Check Supabase RLS policies allow public access
- Look at Render logs for database errors

---

## 📊 Check Deployment Status

### In Render Dashboard:
- **Logs** → See real-time server output
- **Metrics** → View CPU/Memory usage
- **Events** → Deployment history

### Test Endpoints:
```
https://your-app.onrender.com/          # Your app
https://your-app.onrender.com/api/test  # Health check
```

---

## 🔄 Automatic Deployments

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Render auto-deploys in ~2 minutes
```

---

## 💰 Cost

**Free Tier:** $0/month
- Perfect for personal projects and demos
- Sleeps after inactivity (acceptable for most use cases)

**Upgrade to Starter ($7/month):**
- No sleep
- Better performance
- 24/7 uptime

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render Web Service created
- [ ] Environment variables added (4 total)
- [ ] Build completed successfully
- [ ] App accessible at Render URL
- [ ] Socket.IO client updated to use dynamic URL
- [ ] Tested sign-in with Clerk
- [ ] Tested sending messages
- [ ] Verified messages persist in Supabase
- [ ] Tested real-time chat with multiple users

---

## 🎉 You're Live!

Your chat app is now deployed and accessible worldwide!

**Share your app:**
```
https://your-app.onrender.com
```

---

## 📚 Next Steps

- Set up custom domain (optional)
- Add UptimeRobot to prevent sleep
- Monitor with Render's built-in metrics
- Set up GitHub Actions for CI/CD
- Add error tracking (Sentry)

---

Need help? Check:
- [Render Docs](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- Your app logs in Render dashboard
