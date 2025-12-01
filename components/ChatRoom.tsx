"use client";
import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { Message } from "@/types";
import { useClerk } from "@clerk/nextjs";
import { Socket } from "socket.io-client";

interface ChatRoomProps {
  rooms: string[];
  user: string;
  sendMessage: (roomId: string, msg: Message) => void;
  messagesMap: Record<string, Message[]>;
  switchRoom: (roomId: string) => void;
  socketRef: React.RefObject<Socket | undefined>;
  onlineUsers: string[];
  sendDirectMessage: (toUser: string, msg: Message) => void;
}

export default function ChatRoom({ 
  rooms, 
  user, 
  sendMessage, 
  messagesMap, 
  switchRoom, 
  socketRef,
  onlineUsers,
  sendDirectMessage 
}: ChatRoomProps) {
  const [currentRoom, setCurrentRoom] = useState(rooms[0]);
  const [currentDMUser, setCurrentDMUser] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();

  const handleSelectRoom = (room: string) => {
    setCurrentRoom(room);
    setCurrentDMUser(null);
    switchRoom(room);
    setIsMobileMenuOpen(false);
  };

  const handleSelectUser = (username: string) => {
    const dmRoomId = [user, username].sort().join("_dm_");
    setCurrentRoom(dmRoomId);
    setCurrentDMUser(username);
    switchRoom(dmRoomId);
    setIsMobileMenuOpen(false);
  };

  const handleSend = (text: string) => {
    if (text.startsWith("/calc ")) {
      const expr = text.replace("/calc ", "");
      socketRef.current?.emit("calc", { expr, roomId: currentRoom, user });
    } else if (currentDMUser) {
      const msg: Message = { 
        from: user, 
        text, 
        ts: Date.now(),
        roomId: currentRoom 
      };
      sendDirectMessage(currentDMUser, msg);
    } else {
      const msg: Message = { 
        from: user, 
        text, 
        ts: Date.now(),
        roomId: currentRoom 
      };
      sendMessage(currentRoom, msg);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  const displayName = currentDMUser || currentRoom;

  return (
    <div className="flex h-full bg-gray-50">
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile, overlay when open, always visible on desktop */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <ChatSidebar 
          rooms={rooms} 
          currentRoom={currentRoom} 
          onSelectRoom={handleSelectRoom}
          user={user}
          onSignOut={handleSignOut}
          onlineUsers={onlineUsers}
          onSelectUser={handleSelectUser}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 shadow-sm shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Hamburger menu button - only visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {currentDMUser ? (
              <>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-sm text-sm md:text-base">
                  {currentDMUser[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{currentDMUser}</h2>
                  <p className="text-xs md:text-sm text-green-600">Online</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm md:text-base">
                  #
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{displayName}</h2>
                  <p className="text-xs md:text-sm text-gray-500">Chat room</p>
                </div>
              </>
            )}
          </div>
        </div>
        <ChatWindow messages={messagesMap[currentRoom] || []} currentUser={user} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
