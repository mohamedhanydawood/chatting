"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ChatRoom from "@/components/ChatRoom";
import { Message } from "@/types";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

const rooms = ["General", "Tech Talk", "Random"];

export default function Home() {
  const socketRef = useRef<Socket | undefined>(undefined);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) return;

    // Use dynamic URL: localhost in dev, production URL in prod
    const socketUrl = typeof window !== 'undefined' 
      ? (process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3000')
      : 'http://localhost:3000';
    
    const s = io(socketUrl);
    socketRef.current = s;

    const userName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "User";

    // Register user
    s.emit("register_user", { username: userName });

    // Join default room
    s.emit("join_room", { roomId: rooms[0], user: userName });

    // Listen for messages
    s.on("message", (msg: Message) => {
      setMessagesMap((prev) => {
        const room = msg.roomId || rooms[0];
        const newMsgs = prev[room] ? [...prev[room], msg] : [msg];
        return { ...prev, [room]: newMsgs };
      });
    });

    // Listen for room history
    s.on("room_history", ({ roomId, messages }: { roomId: string; messages: Message[] }) => {
      setMessagesMap((prev) => ({ ...prev, [roomId]: messages }));
    });

    // Listen for online users
    s.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      s.disconnect();
    };
  }, [user, isLoaded]);

  const sendMessage = (roomId: string, msg: Message) => {
    socketRef.current?.emit("send_message", { roomId, msg });
  };

  const sendDirectMessage = (toUser: string, msg: Message) => {
    socketRef.current?.emit("send_dm", { toUser, msg });
  };

  const switchRoom = (roomId: string) => {
    if (socketRef.current && user) {
      const userName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "User";
      
      // Only emit join_room for actual rooms (not DMs)
      if (rooms.includes(roomId)) {
        socketRef.current.emit("join_room", { roomId, user: userName });
      } else {
        // For DMs, just load history if available
        const dmMessages = messagesMap[roomId] || [];
        setMessagesMap((prev) => ({ ...prev, [roomId]: dmMessages }));
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

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

  const userName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "User";

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
