"use client";

import { useState } from "react";

interface ChatSidebarProps {
  rooms: string[];
  currentRoom: string;
  onSelectRoom: (room: string) => void;
  user: string;
  onSignOut: () => void;
  onlineUsers: string[];
  onSelectUser: (username: string) => void;
}

export default function ChatSidebar({ 
  rooms, 
  currentRoom, 
  onSelectRoom, 
  user, 
  onSignOut, 
  onlineUsers,
  onSelectUser 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"channels" | "users">("channels");

  const filteredUsers = onlineUsers
    .filter(u => u !== user && u.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredRooms = rooms
    .filter(room => room.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-72 sm:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-500 to-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-lg shadow-md">
              {user[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white truncate max-w-[140px]">{user}</h3>
              <p className="text-xs text-blue-100">Online</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            title="Sign Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("channels")}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === "channels"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-3 text-sm font-medium transition relative ${
            activeTab === "users"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Users
          {filteredUsers.length > 0 && (
            <span className="absolute top-2 right-1/4 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {filteredUsers.length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === "channels" ? "Search channels..." : "Search users..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "channels" ? (
          <div className="px-3 py-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Channels</h4>
            {filteredRooms.length === 0 && searchQuery && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No channels found
              </div>
            )}
            {filteredRooms.map((room) => (
              <div
                key={room}
                onClick={() => onSelectRoom(room)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition mb-1
                  ${room === currentRoom 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${room === currentRoom ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  #
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{room}</h3>
                  <p className="text-xs text-gray-500 truncate">Click to open</p>
                </div>
                {room === currentRoom && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-3 py-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Online Users ({filteredUsers.length})
            </h4>
            {filteredUsers.length === 0 && searchQuery && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No users found
              </div>
            )}
            {filteredUsers.length === 0 && !searchQuery && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No other users online
              </div>
            )}
            {filteredUsers.map((username) => (
              <div
                key={username}
                onClick={() => onSelectUser(username)}
                className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition mb-1 hover:bg-gray-100 text-gray-700"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold shadow-sm">
                    {username[0]?.toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{username}</h3>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
