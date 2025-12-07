"use client";
import { useState } from "react";
import Calculator from "./Calculator";

interface ChatInputProps {
  onSend: (msg: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <div className="bg-white border-t border-gray-200 px-3 md:px-4 py-2 md:py-3 shrink-0">
        <div className="flex items-end space-x-1.5 md:space-x-2">
          <button 
            onClick={() => setShowCalculator(true)}
            className="p-1.5 md:p-2 text-gray-500 hover:text-blue-500 transition rounded-lg hover:bg-gray-100"
            title="Calculator"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm md:text-base"
              style={{ maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition shadow-lg"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="text-xs text-gray-400 mt-1.5 md:mt-2 px-1 hidden sm:block">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>

      <Calculator 
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onSend={onSend}
      />
    </>
  );
}
