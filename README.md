# 💬 Real-Time Chat App

A modern, real-time chat application with Telegram-inspired UI, built with Next.js, Socket.io, and Better Auth.

## ✨ Features

- 🔐 Secure email/password authentication with Better Auth
- 💬 Real-time messaging using Socket.io
- 📱 Multiple chat rooms (General, Tech Talk, Random)
- 🧮 Built-in calculator (`/calc` command)
- 🎨 Beautiful Telegram-inspired UI with Tailwind CSS
- 📝 Persistent message history per room
- 👥 User join notifications

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Sign up and start chatting!**

## 📖 Usage

### Messaging
- Type and press **Enter** to send
- **Shift + Enter** for new line

### Calculator
Use `/calc` to perform calculations:
```
/calc 2 + 2
/calc sqrt(16) * 5
```

### Switching Rooms
Click any room in the sidebar to switch channels.

## 🛠️ Tech Stack

- Next.js 16 + React 19
- TypeScript 5
- Socket.io 4
- Better Auth + SQLite
- Tailwind CSS 4
- Math.js

## 📁 Project Structure

```
app/          - Next.js pages and API routes
component/    - React components
lib/          - Auth configuration
server.ts     - Socket.io server
types.ts      - TypeScript types
```

## 🎨 UI Highlights

- Telegram-style message bubbles
- User avatars with initials
- Room sidebar with active state
- Modern input with keyboard shortcuts
- Auto-scrolling chat window

## 🔧 Configuration

### Add New Rooms
Edit `app/page.tsx`:
```typescript
const rooms = ["General", "Tech Talk", "Random", "New Room"];
```

### Change Port
Update `server.ts`, `.env`, and socket connection in `app/page.tsx`

## 🐛 Troubleshooting

**Messages not sending?**
- Check you're signed in
- Restart the server
- Check browser console

**Database issues?**
- Delete `db.sqlite` and restart

## 📝 License

MIT

---

Built with ❤️ - Enjoy chatting! 🎉
