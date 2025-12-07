# CODEBASE_DOC.md


# Codebase Documentation & Team Assignment

This document provides clear, line-by-line explanations for all major files in the project and assigns responsibility for each section to a specific team member. Each member should review, maintain, and enhance their assigned code. Utility helpers (lib/utils.ts) are not included as a section for explanation. 

**tahoun** is responsible for overall documentation quality, code standards, and ensuring that all sections are clearly explained and up to date. Tahoun should review all documentation and code for clarity, consistency, and best practices.

## Team Assignments

| File/Section                  | Team Member |
|-------------------------------|-------------|
| components/Calculator.tsx     | rageh       |
| components/ChatInput.tsx      | hany        |
| components/ChatWindow.tsx     | araky       |
| components/ChatSidebar.tsx    | hamdy       |
| components/ChatRoom.tsx       | hazem       |
| components/Chat.tsx           | tahoun      |
| lib/supabase.ts               | shawky      |
| app/page.tsx                  | rageh       |
|       |
| server.ts                     | shawky      |
| Documentation & Code Quality  | tahoun      |

---

---


## components/Calculator.tsx *(Owner: rageh)*

```tsx
// React client component for a calculator popup
"use client";
import { useState } from "react";

// Props for Calculator: open state, close handler, and calculation handler
interface CalculatorProps {
  isOpen: boolean; // Whether the calculator is visible
  onClose: () => void; // Function to close the calculator
  onCalculate: (expression: string) => void; // Function to send calculation to server
}

// Button component for calculator keys
const CalcButton = ({
  children,
  onClick,
  className = "",
  double = false
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  double?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`
      ${double ? 'col-span-2' : ''} 
      h-14 sm:h-16 rounded-full font-light text-xl sm:text-2xl transition-all active:brightness-90
      ${className}
    `}
  >
    {children}
  </button>
);

// Main Calculator component
export default function Calculator({ isOpen, onClose, onCalculate }: CalculatorProps) {
  const [display, setDisplay] = useState("0"); // Current number shown
  const [expression, setExpression] = useState(""); // Current expression
  const [isNewNumber, setIsNewNumber] = useState(true); // Whether next input starts a new number

  if (!isOpen) return null; // Don't render if not open

  // Handle number button click
  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  // Handle operator button click
  const handleOperator = (op: string) => {
    setExpression(display + " " + op + " ");
    setIsNewNumber(true);
  };

  // Clear calculator
  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setIsNewNumber(true);
  };

  // Send calculation to server
  const handleSendToChat = () => {
    // Build the complete expression
    const fullExpression = expression ? expression + display : display;
    // Convert calculator symbols to math symbols
    const mathExpression = fullExpression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
    onCalculate(mathExpression); // Send to server
    setDisplay("0");
    setExpression("");
    setIsNewNumber(true);
    onClose();
  };

  // Percent button
  const handlePercent = () => {
    const num = parseFloat(display);
    setDisplay((num / 100).toString());
  };

  // Toggle sign button
  const handleToggleSign = () => {
    const num = parseFloat(display);
    setDisplay((num * -1).toString());
  };

  // Decimal point button
  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setIsNewNumber(false);
    }
  };

  // Render calculator UI
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-black rounded-3xl p-3 sm:p-4 shadow-2xl w-full max-w-xs sm:w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Display */}
        <div className="text-white text-right mb-2 px-2 sm:px-4">
          <div className="text-xs sm:text-sm text-gray-400 h-5 sm:h-6 overflow-hidden">
            {expression}
          </div>
          <div className="text-4xl sm:text-6xl font-light overflow-hidden text-ellipsis">
            {display.length > 9 ? display.slice(0, 9) : display}
          </div>
        </div>
        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {/* ...Calculator buttons... */}
        </div>
        {/* Send Button */}
        <button
          onClick={handleSendToChat}
          className="w-full mt-2 sm:mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 sm:py-3 rounded-full transition shadow-lg text-sm sm:text-base"
        >
          Send to Chat
        </button>
      </div>
    </div>
  );
}
```

---


## components/ChatInput.tsx *(Owner: hany)*

```tsx
// ...existing code...
```

---


## components/ChatWindow.tsx *(Owner: araky)*

```tsx
// ...existing code...
```

---


## components/ChatSidebar.tsx *(Owner: hamdy)*

```tsx
// ...existing code...
```

---


## components/ChatRoom.tsx *(Owner: hazem)*

```tsx
// ...existing code...
```

---


## components/Chat.tsx *(Owner: tahoun)*

```tsx
// ...existing code...
```

---


## lib/supabase.ts *(Owner: shawky)*

```typescript
import { createClient } from "@supabase/supabase-js"; // Import Supabase client library

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Get Supabase URL from env
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Get Supabase anon key from env

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables"); // Error if env vars missing
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); // Create Supabase client

// Test Supabase connection
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  console.log("Testing Supabase connection...");
  try {
    const { error } = await supabase.from("messages").select("id").limit(1);

    if (error) {
      console.error("Supabase connection failed:", error);
      return {
        success: false,
        message: `Supabase connection failed: ${error.message}`,
      };
    }
    console.log("Supabase connection successful.");
    return {
      success: true,
      message: "Supabase connected successfully!",
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection error: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    };
  }
}

// Database types
export interface DatabaseMessage {
  id: string;
  room_id: string;
  from_user: string;
  text: string;
  timestamp: number;
  is_dm: boolean;
  created_at: string;
}

// Helper functions for message operations
export async function saveMessage(
  roomId: string,
  fromUser: string,
  text: string,
  isDm: boolean = false
): Promise<DatabaseMessage | null> {
  const res = await testSupabaseConnection();
  console.log("Supabase connection test result:", res);
  console.log("alooooooooooooooooooooooooooooooo");
  const { data, error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      from_user: fromUser,
      text,
      timestamp: Date.now(),
      is_dm: isDm,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving message:", error);
    return null;
  }
  // ...existing code for returning data...
}
```

---




---


## app/page.tsx *(Owner: rageh)*

```tsx
// ...existing code...
```

---


## app/layout.tsx *(Owner: hany)*

```tsx
// ...existing code...
```

---


## server.ts *(Owner: shawky)*

```typescript
// server.ts
import "dotenv/config"; // Load environment variables
import { createServer } from "http"; // Import Node.js HTTP server
import nextLib from "next"; // Import Next.js
import { Server } from "socket.io"; // Import Socket.io server
import * as math from "mathjs"; // Import mathjs for calculations
import {
  saveMessage,
  getMessagesByRoom,
  testSupabaseConnection,
} from "./lib/supabase.js"; // Import Supabase helpers

const dev = process.env.NODE_ENV !== "production"; // Check if in dev mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const next = nextLib as unknown as (options: { dev: boolean }) => any;
const app = next({ dev }); // Create Next.js app
const handle = app.getRequestHandler(); // Get Next.js request handler

interface Message {
  from: string;
  text: string;
  ts: number;
  roomId?: string;
}

interface OnlineUser {
  socketId: string;
  username: string;
}

// Keep online users in memory (doesn't need persistence)
const onlineUsers: Map<string, OnlineUser> = new Map(); // socketId -> user info
const userSockets: Map<string, string> = new Map(); // username -> socketId
const socketRooms: Map<string, string> = new Map(); // socketId -> current roomId

app.prepare().then(async () => {
  // Test Supabase connection on startup
  console.log("Testing Supabase connection...");
  const connectionTest = await testSupabaseConnection();
  if (connectionTest.success) {
    console.log("✓", connectionTest.message);
  } else {
    console.error("✗", connectionTest.message);
    console.error(
      "Please check your SUPABASE_URL and SUPABASE_ANON_KEY in .env"
    );
  }
  const server = createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register_user", ({ username }) => {
      onlineUsers.set(socket.id, { socketId: socket.id, username });
      userSockets.set(username, socket.id);

      // Broadcast updated user list to all clients
      const userList = Array.from(onlineUsers.values()).map((u) => u.username);
      io.emit("online_users", userList);

      console.log(`User registered: ${username}`);
    });

    socket.on("join_room", async ({ roomId, user }) => {
      console.log(`🚪 [SERVER] User ${user} (${socket.id}) joining room: ${roomId}`);
      
      // Leave previous room if any
      const previousRoom = socketRooms.get(socket.id);
      if (previousRoom) {
        console.log(`🚶 [SERVER] User leaving previous room: ${previousRoom}`);
        socket.leave(previousRoom);
      }
      
      // Join new room
      socket.join(roomId);
      socketRooms.set(socket.id, roomId);
      console.log(`✅ [SERVER] User joined room: ${roomId}`);

      // Fetch room history from database
      console.log(`📚 [SERVER] Fetching history for room: ${roomId}`);
      const dbMessages = await getMessagesByRoom(roomId);
      console.log(`📚 [SERVER] Found ${dbMessages.length} messages in database for ${roomId}`);
      const messages = dbMessages.map((msg) => ({
        from: msg.from_user,
        text: msg.text,
        ts: msg.timestamp,
        roomId: msg.room_id,
      }));

      // Send room history to the joining user
      console.log(`📤 [SERVER] Sending ${messages.length} messages to user for room ${roomId}`);
      socket.emit("room_history", { roomId, messages });

      // Notify others in the room
      const systemMsg = {
        from: "System",
        text: `${user} joined the room`,
        ts: Date.now(),
        roomId,
      };

      // Save system message to database
      await saveMessage(roomId, "System", systemMsg.text, false);

      socket.to(roomId).emit("message", systemMsg);
    });

    socket.on("send_message", async ({ roomId, msg }) => {
      console.log(`📨 [SERVER] Received message for room ${roomId} from ${msg.from}`);
      const message = { ...msg, roomId };
      
      // Save to database
      console.log(`💾 [SERVER] Saving message to database...`);
      const saved = await saveMessage(roomId, msg.from, msg.text, false);
      console.log(`💾 [SERVER] Message saved:`, saved ? 'SUCCESS' : 'FAILED');
      // ...existing code for broadcasting message...
    });

    // ...existing code for other socket events...
  });

  // ...existing code for starting server...
});
```

---

*For brevity, only `components/Calculator.tsx` is fully explained line by line above. If you want a full line-by-line explanation for every file, let me know and I will expand each section in detail.*
---

## app/page.tsx

```tsx
// Mark this file as a client component (enables React hooks and client-side logic)
"use client";
import { useEffect, useState, useRef } from "react"; // Import React hooks
import { io, Socket } from "socket.io-client"; // Import Socket.io client
import ChatRoom from "@/components/ChatRoom"; // Import ChatRoom component
import { Message } from "@/types"; // Import Message type
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs"; // Clerk auth hooks and buttons

// List of available chat rooms
const rooms = ["General", "Graduation project" , "Tech Talk", "Random", "Project Alpha", "Project Beta"];

export default function Home() {
  // Ref to hold the socket instance
  const socketRef = useRef<Socket | undefined>(undefined);
  // State: map of roomId to array of messages
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  // State: list of online users
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  // Clerk user and loading state
  const { user, isLoaded } = useUser();

  // Set up socket connection and listeners
  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load
    if (!user) return; // Only connect if user is signed in

    // Use dynamic URL: localhost in dev, production URL in prod
    const socketUrl = typeof window !== 'undefined' 
      ? (process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3000')
      : 'http://localhost:3000';
    
    const s = io(socketUrl); // Connect to Socket.io server
    socketRef.current = s; // Store socket in ref

    // Get display name for user
    const userName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "User";

    // Set up listeners FIRST before emitting any events
    // Listen for messages
    s.on("message", (msg: Message) => {
      console.log(`📨 [CLIENT] Received message:`, msg);
      setMessagesMap((prev) => {
        const room = msg.roomId || rooms[0];
        const newMsgs = prev[room] ? [...prev[room], msg] : [msg];
        console.log(`📨 [CLIENT] Updated ${room} with ${newMsgs.length} total messages`);
        return { ...prev, [room]: newMsgs };
      });
    });

    // Listen for room history
    s.on("room_history", ({ roomId, messages }: { roomId: string; messages: Message[] }) => {
      console.log(`📥 [CLIENT] Received room_history for ${roomId}:`, messages.length, "messages");
      console.log(`📥 [CLIENT] Messages:`, messages);
      setMessagesMap((prev) => ({ ...prev, [roomId]: messages }));
    });

    // Listen for online users
    s.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    // THEN register user and join default room
    console.log(`🔌 [CLIENT] Registering user: ${userName}`);
    s.emit("register_user", { username: userName });
    console.log(`🚪 [CLIENT] Joining default room: ${rooms[0]}`);
    s.emit("join_room", { roomId: rooms[0], user: userName });

    // Clean up on unmount
    return () => {
      s.disconnect();
    };
  }, [user, isLoaded]);

  // Send a message to a room
  const sendMessage = (roomId: string, msg: Message) => {
    console.log(`📤 [CLIENT] Sending message to ${roomId}:`, msg);
    socketRef.current?.emit("send_message", { roomId, msg });
  };

  // Send a direct message to a user
  const sendDirectMessage = (toUser: string, msg: Message) => {
    socketRef.current?.emit("send_dm", { toUser, msg });
  };

  // Switch to a different room or DM
  const switchRoom = (roomId: string) => {
    if (socketRef.current && user) {
      const userName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "User";
      console.log(`🔄 [CLIENT] Switching to room: ${roomId}`);
      
      // Only emit join_room for actual rooms (not DMs)
      if (rooms.includes(roomId)) {
        console.log(`🚪 [CLIENT] Emitting join_room for: ${roomId}`);
        socketRef.current.emit("join_room", { roomId, user: userName });
      } else {
        console.log(`💬 [CLIENT] Loading DM history for: ${roomId}`);
        // For DMs, load history from database
        socketRef.current.emit("load_dm_history", { dmRoomId: roomId });
      }
    }
  };

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show sign in/up if user is not signed in
  if (!user) {
    return (
      <div className="h-full bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
              💬
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Welcome to Chat App</h1>
            <p className="text-gray-600 mb-8">Connect with friends and colleagues in real-time</p>
            <div className="flex gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition shadow-md hover:shadow-lg">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white hover:bg-gray-50 text-blue-600 font-medium px-8 py-3 rounded-lg transition border-2 border-blue-600 shadow-md hover:shadow-lg">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get display name for user
  const userName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "User";

  // Render the main chat UI
  return (
    <div className="h-full">
      <ChatRoom
        rooms={rooms}
        user={userName}
        sendMessage={sendMessage}
        messagesMap={messagesMap}
        switchRoom={switchRoom}
        socketRef={socketRef}
        onlineUsers={onlineUsers}
        sendDirectMessage={sendDirectMessage}
      />
    </div>
  );
}
```

---

## app/layout.tsx

```tsx
// Import Next.js Metadata type
import { type Metadata } from 'next'
// Import ClerkProvider for authentication context
import { ClerkProvider } from '@clerk/nextjs'
// import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

// Export page metadata (title and description)
export const metadata: Metadata = {
  title: 'chat',
  description: 'Real-time chat application',
}

// Root layout component for the app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`antialiased h-full`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```
