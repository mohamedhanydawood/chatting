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
  const { signOut } = useClerk();

  const handleSelectRoom = (room: string) => {
    setCurrentRoom(room);
    setCurrentDMUser(null);
    switchRoom(room);
  };

  const handleSelectUser = (username: string) => {
    const dmRoomId = [user, username].sort().join("_dm_");
    setCurrentRoom(dmRoomId);
    setCurrentDMUser(username);
    switchRoom(dmRoomId);
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
      <ChatSidebar 
        rooms={rooms} 
        currentRoom={currentRoom} 
        onSelectRoom={handleSelectRoom}
        user={user}
        onSignOut={handleSignOut}
        onlineUsers={onlineUsers}
        onSelectUser={handleSelectUser}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            {currentDMUser ? (
              <>
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-sm">
                  {currentDMUser[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{currentDMUser}</h2>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  #
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{displayName}</h2>
                  <p className="text-sm text-gray-500">Chat room</p>
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
