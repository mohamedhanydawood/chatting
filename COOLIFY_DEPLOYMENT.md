# 🚀 Coolify Deployment Guide - Chat App with Socket.IO

## Overview

This guide shows how to deploy your Next.js + Socket.IO chat app to Coolify on your VPS.

---

## 📋 Prerequisites

- ✅ Coolify installed on your VPS
- ✅ GitHub repository connected to Coolify
- ✅ Supabase database configured
- ✅ Clerk authentication set up

---

## 🐳 Docker Configuration

The app is now Docker-ready with:
- **Dockerfile** - Multi-stage build for optimized image
- **.dockerignore** - Excludes unnecessary files
- **.env.example** - Template for environment variables

---

## 🔧 Coolify Setup

### 1. Create New Service

1. Go to your Coolify dashboard
2. Click **"+ New Resource"** → **"Docker Compose / Dockerfile"**
3. Select **"Dockerfile"**
4. Connect your GitHub repository

### 2. Configure Build Settings

| Setting | Value |
|---------|-------|
| **Branch** | `master` (or `main`) |
| **Build Pack** | Dockerfile |
| **Dockerfile Location** | `./Dockerfile` |
| **Port** | `3000` |

### 3. Add Environment Variables

In Coolify's environment section, add these variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Port (Coolify auto-assigns, but you can set default)
PORT=3000
```

### 4. Enable WebSocket Support

**Important:** Coolify should auto-detect WebSocket connections, but verify:

- Check that **WebSocket** toggle is **enabled** in service settings
- If using Traefik proxy, WebSocket upgrade should be automatic

### 5. Domain Configuration

1. Set your custom domain (e.g., `chat.yourdomain.com`)
2. Enable **SSL/TLS** (Let's Encrypt automatic)
3. Coolify will configure Traefik proxy automatically

---

## 🚀 Deploy

### Push to GitHub

```bash
git add .
git commit -m "Add Docker configuration for Coolify"
git push origin master
```

### Trigger Deployment in Coolify

1. Go to your service in Coolify
2. Click **"Deploy"** or enable **Auto Deploy** for automatic deployments
3. Watch the build logs

### Build Process

You'll see:
```
Building Docker image...
Installing dependencies...
Building Next.js...
Compiling TypeScript server...
Creating production image...
Starting container...
✅ Deployed successfully
```

Build time: ~5-10 minutes (first time)

---

## ✅ Verify Deployment

### 1. Check Application

Visit your domain: `https://chat.yourdomain.com`

### 2. Test Features

- [ ] App loads correctly
- [ ] Can sign in with Clerk
- [ ] Can send messages
- [ ] Messages persist in Supabase
- [ ] Real-time chat works (open two browsers)
- [ ] Room switching works
- [ ] Direct messages work
- [ ] Calculator command works (`/calc 2+2`)

### 3. Monitor Logs

In Coolify:
- Click your service → **"Logs"**
- Look for: `Server running on port 3000`
- Check for any errors

---

## 🔧 Architecture

```
Internet
   ↓
Traefik (Coolify Proxy)
   ↓
Docker Container:
   ┌─────────────────────────┐
   │  Node.js Server         │
   │  ├─ Next.js (Frontend)  │
   │  ├─ Socket.IO (WS)      │
   │  └─ HTTP Server         │
   └─────────────────────────┘
         ↓           ↓
    Clerk Auth   Supabase DB
```

---

## 🔄 Updates & Redeployments

### Automatic Deployments

If enabled, Coolify watches your GitHub repo:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Coolify auto-rebuilds and redeploys
```

### Manual Deployment

Go to Coolify dashboard → Your service → Click **"Redeploy"**

---

## 🐛 Troubleshooting

### Build Fails

**Check build logs in Coolify:**
- Look for TypeScript errors
- Verify all dependencies install correctly
- Check Dockerfile syntax

**Common fixes:**
```bash
# Clear build cache
# In Coolify: Enable "Rebuild without cache"
```

### Container Won't Start

**Check runtime logs:**
- Verify environment variables are set
- Check PORT is correct
- Look for Node.js errors

### Socket.IO Not Connecting

**Verify WebSocket support:**
- Check WebSocket is enabled in Coolify
- Ensure Traefik proxy allows WS upgrades
- Check browser console for connection errors

**Client URL check:**
- The app uses `window.location.origin` automatically
- Should work with your custom domain

### CORS Issues

**Check server.ts CORS settings:**
```typescript
const io = new Server(server, {
  cors: { origin: "*" }, // Currently allows all origins
});
```

**For production, restrict to your domain:**
```typescript
const io = new Server(server, {
  cors: { 
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://chat.yourdomain.com' 
      : '*'
  },
});
```

### Database Connection Issues

**Verify Supabase variables:**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Test Supabase connection from VPS:
  ```bash
  curl https://your-project.supabase.co
  ```

---

## 📊 Performance Tips

### Resource Allocation

In Coolify, you can set:
- **Memory Limit:** 512MB-1GB (recommended)
- **CPU Limit:** 1-2 cores
- **Restart Policy:** Always (for automatic recovery)

### Database Optimization

- Consider connection pooling for Supabase
- Monitor Supabase dashboard for slow queries
- Add indexes on `room_id` and `timestamp` columns

### Monitoring

Coolify provides:
- Real-time logs
- Resource usage graphs
- Uptime monitoring
- Automatic health checks

---

## 🔒 Security Checklist

- [ ] SSL/TLS enabled (HTTPS)
- [ ] Environment variables secured (not in code)
- [ ] Clerk authentication configured
- [ ] Supabase RLS policies enabled
- [ ] CORS restricted to your domain (production)
- [ ] Non-root user in Docker container
- [ ] `.env` in `.gitignore`

---

## 📝 Configuration Files

### Created Files:
- **Dockerfile** - Multi-stage Docker build
- **.dockerignore** - Excludes unnecessary files
- **.env.example** - Environment variable template

### Modified Files:
- **next.config.ts** - Added `output: 'standalone'` for Docker

---

## 🎯 Quick Reference

### Coolify Service Settings:
```yaml
Type: Dockerfile
Port: 3000
WebSocket: Enabled
Auto Deploy: Yes (optional)
Build Command: Docker uses Dockerfile
Start Command: node dist/server.js (in Dockerfile)
```

### Required Environment Variables (5):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
PORT
```

### Build Steps:
1. Install dependencies with npm ci
2. Build Next.js with `npm run build`
3. Compile TypeScript server
4. Create optimized production image
5. Start custom server

---

## 📚 Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Socket.IO with Proxies](https://socket.io/docs/v4/reverse-proxy/)

---

## ✨ Success!

Your chat app is now running on your VPS with:
- ✅ Custom domain with SSL
- ✅ Real-time Socket.IO messaging
- ✅ Automatic deployments from GitHub
- ✅ Persistent message storage in Supabase
- ✅ Secure authentication with Clerk

**Share your app:** `https://chat.yourdomain.com`

---

Need help? Check Coolify logs or consult their documentation!
