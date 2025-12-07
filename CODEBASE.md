# Codebase Documentation

## 🖥️ Backend Architecture (server.ts)

The `server.ts` file implements a custom HTTP server that combines Next.js frontend rendering with Socket.io real-time communication and Supabase database persistence.

### Server Setup
```typescript
// Creates HTTP server with Next.js integration
const server = http.createServer((req, res) => {
  return app.getRequestHandler()(req, res);
});

// Attaches Socket.io to the HTTP server
const io = new Server(server, {
  cors: { origin: "*" }
});
```

### User Presence Tracking
Uses ES6 Maps to track online users and their socket connections:
```typescript
const users = new Map<string, string>();        // userId -> socketId
const onlineUsers = new Map<string, string>();  // socketId -> userId
```

### Socket Event Handlers

#### `register_user`
- Registers user presence when they connect
- Broadcasts updated online user list to all clients
- Enables real-time user status indicators

#### `join_room`
- Handles room switching and channel joins
- Fetches message history from Supabase database
- Sends historical messages to the client for persistence

#### `send_message`
- Processes room messages (public channels)
- Saves messages to Supabase with room context
- Broadcasts to all users in the same room

#### `send_dm`
- Handles direct messages between users
- Routes messages to specific user sockets
- Persists DMs in database with recipient information

#### `load_dm_history`
- Fetches direct message history between two users
- Queries Supabase for DM conversations
- Enables persistent chat history in private conversations

#### `calc`
- Evaluates mathematical expressions using math.js
- Provides safe calculation functionality
- Returns results for calculator feature

#### `disconnect`
- Cleans up user presence on disconnection
- Updates online user lists
- Maintains accurate user status tracking

### Database Integration
- Connects to Supabase on server startup
- Tests connection with `testSupabaseConnection()`
- Persists all messages (rooms and DMs) to PostgreSQL
- Enables cross-session message history

### Server Lifecycle
```typescript
// Tests database connection
await testSupabaseConnection();

// Starts server on configured port
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

This architecture enables real-time messaging with persistent storage, user presence tracking, and seamless integration between the Next.js frontend and Socket.io backend.

## 📁 Project Structure

```
app/                    - Next.js App Router pages
  ├── globals.css       - Global styles
  ├── layout.tsx        - Root layout
  └── page.tsx          - Main chat page
component/              - React components
  ├── Chat.tsx          - Main chat container
  ├── ChatInput.tsx     - Message input with calculator
  ├── ChatRoom.tsx      - Chat room layout
  ├── ChatSidebar.tsx   - Sidebar with rooms/users
  ├── ChatWindow.tsx    - Message display area
  └── Calculator.tsx    - Apple-style calculator popup
lib/                    - Utility libraries
  └── supabase.ts       - Database client and functions
public/                 - Static assets
server.ts               - Custom Socket.io server
supabase-schema.sql     - Database schema
tsconfig.json           - TypeScript configuration
tsconfig.server.json    - Server TypeScript config
package.json            - Dependencies and scripts
.env                    - Environment variables
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

### Database Setup
1. Create a Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Update RLS policies for your authentication method
4. Test connection with the built-in server startup check

## 🛠️ Tech Stack

- Next.js 15.5.6 + React 19.2.0
- TypeScript 5
- Clerk Authentication v6.35.5
- Socket.io 4.8.1
- Supabase (PostgreSQL)
- Tailwind CSS 4
- Math.js 15.1.0

## 🎨 UI Highlights

- Telegram-style message bubbles
- User avatars with initials
- Room sidebar with active state
- Modern input with keyboard shortcuts
- Auto-scrolling chat window

## 🐛 Troubleshooting

**Messages not sending?**
- Check you're signed in with Clerk
- Verify Supabase connection in server logs
- Check browser console for Socket.io errors

**Database connection issues?**
- Verify Supabase URL and API key in `.env`
- Check Supabase project status and RLS policies
- Review server startup logs for connection errors

**Authentication problems?**
- Confirm Clerk keys are correct in `.env`
- Check Clerk dashboard for application settings
- Ensure sign-in/sign-up URLs match configuration

**Real-time features not working?**
- Check Socket.io connection in browser dev tools
- Verify server is running on correct port
- Test with multiple browser tabs/windows