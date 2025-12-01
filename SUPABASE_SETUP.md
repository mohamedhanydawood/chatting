# Supabase Setup Guide for Chat App

## 📝 Step-by-Step Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/sign up
2. Click **"New Project"**
3. Fill in the details:
   - **Organization**: Select or create one
   - **Project Name**: `chatting-app` (or any name you prefer)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait ~2 minutes for project creation

### 2. Get Your API Credentials

1. Once the project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **API Keys**:
     - `anon` `public` key (starts with `eyJ...`)

**Copy these two values** - you'll need them in step 4!

### 3. Create Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click **"New query"**
3. Copy the entire content from `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned" message

This creates:
- ✅ `messages` table with all necessary columns
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies for authentication

### 4. Add Environment Variables

1. Open the `.env` file in your project
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Use the actual values from step 2!

### 5. Test Locally

```bash
npm run dev
```

Send a few messages and verify they persist after restarting the server.

### 6. Verify in Supabase

1. Go to **Table Editor** in Supabase dashboard
2. Click on the `messages` table
3. You should see your test messages!

## 🚀 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **"Deploy"**

### 3. Vercel Build Settings

Make sure your `package.json` has:

```json
{
  "scripts": {
    "dev": "ts-node server.ts",
    "build": "next build",
    "start": "NODE_ENV=production ts-node server.ts"
  }
}
```

Vercel will automatically:
- Run `npm run build` during deployment
- Use `npm run start` for production server

## 📊 Database Schema

### Messages Table

| Column      | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| id          | UUID      | Primary key (auto-generated)          |
| room_id     | TEXT      | Room identifier or DM room ID         |
| from_user   | TEXT      | Username of sender                    |
| text        | TEXT      | Message content                       |
| timestamp   | BIGINT    | Unix timestamp (milliseconds)         |
| is_dm       | BOOLEAN   | True if direct message                |
| created_at  | TIMESTAMP | Database creation time (UTC)          |

### Indexes

- `idx_messages_room_id` - Fast queries by room
- `idx_messages_timestamp` - Time-based sorting
- `idx_messages_room_timestamp` - Combined for optimal performance

## 🔒 Security

- **Row Level Security (RLS)** is enabled
- Only authenticated users can read/write messages
- Users can delete their own messages
- All API calls use the `anon` key (safe for client-side)

## 🎯 What Changed

### Before (In-Memory)
```typescript
const messages: Record<string, Message[]> = {};
// ❌ Lost on server restart
```

### After (Persistent)
```typescript
import { saveMessage, getMessagesByRoom } from './lib/supabase';
// ✅ Saved to database
// ✅ Survives restarts
// ✅ Scalable across multiple servers
```

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env` file has the correct values
- Restart your dev server after adding env vars

### Messages not saving
- Verify SQL schema ran successfully
- Check browser console for errors
- Verify RLS policies are set up

### Can't query messages
- Make sure you're authenticated with Clerk
- Check Supabase logs in dashboard

## 📚 Next Steps

- Add message editing/deletion UI
- Implement real-time subscriptions with Supabase Realtime
- Add file attachments with Supabase Storage
- Implement message reactions

---

Need help? Check the Supabase docs: https://supabase.com/docs
