# 🔧 Setup & Troubleshooting Guide

## Database Location

The database file `db.sqlite` is located in the **root directory** of your project:
```
d:\chatting\db.sqlite
```

This SQLite database stores:
- User accounts (email, password hash, name)
- User sessions
- Account information
- Verification tokens

## How Authentication Works

### Database Tables
The database has been initialized with the following tables:

1. **user** - Stores user information (id, email, name, etc.)
2. **session** - Manages user sessions
3. **account** - Stores account credentials (including hashed passwords)
4. **verification** - Handles email verification tokens

### Authentication Flow

1. **Sign Up**:
   - User enters name, email, and password
   - Password is hashed by Better Auth
   - User record created in database
   - Account record created with hashed password
   - User is automatically logged in

2. **Sign In**:
   - User enters email and password
   - Better Auth verifies credentials against database
   - Session created and stored in database
   - Session token returned to browser

3. **Session Management**:
   - Session checked on every protected route
   - If no valid session → redirect to /login
   - If valid session → user can access chat

## 🐛 Troubleshooting

### Issue: "Failed to initialize database adapter"

**Solution**: The database tables need to be created first.

Run this command:
```bash
npm run init-db
```

Or manually:
```bash
npx ts-node scripts/init-db.ts
```

### Issue: "no such table: user"

**Solution**: Database tables weren't created.

1. Delete the old database:
   ```bash
   rm db.sqlite
   ```

2. Re-initialize:
   ```bash
   npm run init-db
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

### Issue: Sign up/Sign in returns 405 or 500 error

**Possible causes**:

1. **Database not initialized**
   - Run `npm run init-db`

2. **Better Auth routes not set up correctly**
   - Check that `app/api/auth/[...all]/route.ts` exists
   - Verify it exports `GET` and `POST`

3. **Kysely not installed**
   - Run `npm install kysely --legacy-peer-deps`

### Issue: "Cannot find module '@/components/ChatRoom'"

**Solution**: The ChatRoom component was missing.

It has been recreated at `components/ChatRoom.tsx`. If you still see this error:

1. Restart your dev server
2. Clear Next.js cache: `rm -rf .next`
3. Run `npm run dev` again

## 📊 Database Management

### View Database Contents

You can use any SQLite browser to view the database:

**Option 1: SQLite Browser**
1. Download [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open `db.sqlite`
3. Browse tables and data

**Option 2: Command Line**
```bash
sqlite3 db.sqlite
.tables
SELECT * FROM user;
SELECT * FROM session;
.quit
```

**Option 3: VS Code Extension**
Install "SQLite Viewer" extension in VS Code, then right-click `db.sqlite`

### Reset Database

If you want to start fresh:

```bash
# Delete database
rm db.sqlite db.sqlite-shm db.sqlite-wal

# Recreate tables
npm run init-db

# Restart server
npm run dev
```

All users and sessions will be deleted. You'll need to sign up again.

## 🚀 Quick Start Checklist

Before running the app, ensure:

- [ ] Dependencies installed: `npm install --legacy-peer-deps`
- [ ] Database initialized: `npm run init-db`
- [ ] Environment variables set in `.env`:
  ```
  BETTER_AUTH_SECRET=97NuGZWPMS71i6ISu2QIP3UAJ0JgYLY5
  BETTER_AUTH_URL=http://localhost:3000
  NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
  ```
- [ ] Server running: `npm run dev`

## 📝 Testing Authentication

1. Go to http://localhost:3000
2. You'll be redirected to `/login`
3. Click "Sign up"
4. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
5. Click "Create Account"
6. You should be redirected to the chat
7. Try signing out and signing back in

## 🔍 Debugging Tips

### Check if database exists and has tables
```bash
ls -la db.sqlite
sqlite3 db.sqlite ".schema user"
```

### Check server logs
Look for these messages:
- ✅ "Database tables created successfully!" - Good!
- ❌ "Failed to initialize database adapter" - Run init-db
- ❌ "no such table: user" - Run init-db

### Check browser console
- Network tab: Look for 200 responses on `/api/auth/*`
- Console: Look for authentication errors

### Verify auth routes
```bash
curl http://localhost:3000/api/auth/get-session
```
Should return session data (or null if not logged in)

## 📁 File Structure

```
d:\chatting\
├── db.sqlite              ← Your database (created after init-db)
├── .env                   ← Environment variables
├── server.ts              ← Socket.io server
├── app/
│   ├── api/auth/[...all]/
│   │   └── route.ts      ← Better Auth API endpoints
│   ├── login/
│   │   └── page.tsx      ← Login/signup page with shadcn UI
│   └── page.tsx          ← Main chat page (protected)
├── components/
│   ├── ChatRoom.tsx      ← Main chat container
│   ├── ChatWindow.tsx    ← Message display
│   ├── ChatInput.tsx     ← Input field
│   ├── ChatSidebar.tsx   ← Room list
│   └── ui/               ← shadcn UI components
├── lib/
│   ├── auth.ts           ← Better Auth server config
│   └── auth-client.ts    ← Better Auth client utilities
└── scripts/
    └── init-db.ts        ← Database initialization script
```

## 🎯 Common Commands

```bash
# Start development server
npm run dev

# Initialize/reset database
npm run init-db

# Clear cache and restart
rm -rf .next && npm run dev

# Check database
sqlite3 db.sqlite "SELECT * FROM user;"

# Full reset
rm db.sqlite .next && npm run init-db && npm run dev
```

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Server starts without errors
2. ✅ Can access http://localhost:3000/login
3. ✅ Can create a new account
4. ✅ Redirected to chat after signup
5. ✅ Can send and receive messages
6. ✅ Can sign out and sign back in

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check all error messages in terminal
2. Check browser console for errors
3. Verify `db.sqlite` exists and has data
4. Try deleting `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   npm run init-db
   npm run dev
   ```

---

**Database is working when you can**:
- Sign up successfully ✅
- See your user in `db.sqlite` ✅
- Sign in with your credentials ✅
- Access the chat app ✅
