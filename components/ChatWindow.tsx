"use client";
import { Message } from "@/types";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  messages: Message[];
  currentUser: string;
}

export default function ChatWindow({ messages, currentUser }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 min-h-0">
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isCurrentUser = msg.from === currentUser;
              const isSystem = msg.from === "System" || msg.from === "Calculator";
              
              if (isSystem) {
                return (
                  <div key={i} className="flex justify-center">
                    <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                    {!isCurrentUser && (
                      <div className="text-xs font-semibold text-gray-600 mb-1 px-1">
                        {msg.from}
                      </div>
                    )}
                    <div className={`
                      rounded-2xl px-4 py-2 shadow-sm
                      ${isCurrentUser 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none'
                      }
                    `}>
                      <p className="wrap-break-word">{msg.text}</p>
                      <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(msg.ts)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
