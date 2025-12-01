"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  from: string;
  text: string;
  ts: number;
}

interface ChatProps {
  roomId: string;
  user: string;
}

export default function Chat({ roomId, user }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.emit("join_room", { roomId, user });

    socket.on("room_history", (history: Message[]) => setMessages(history));
    socket.on("message", (msg: Message) => setMessages((prev) => [...prev, msg]));
    socket.on("system", (text: string) =>
      setMessages((prev) => [...prev, { from: "System", text, ts: Date.now() }])
    );

    return () => {
      socket.disconnect();
    };
  }, [roomId, user]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (input.startsWith("/calc ")) {
      socketRef.current?.emit("calc", { expr: input.replace("/calc ", ""), roomId, user });
    } else {
      socketRef.current?.emit("send_message", {
        roomId,
        msg: { from: user, text: input, ts: Date.now() },
      });
    }
    setInput("");
  };

  return (
    <div style={{ width: 400, padding: 10 }}>
      <h2>Room: {roomId}</h2>
      <div style={{ height: 300, overflow: "auto", border: "1px solid #ddd", padding: 5 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.from}</b>: {m.text}
          </div>
        ))}
      </div>
      <input
        style={{ width: "70%" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message or /calc 2+2"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
