// server.ts
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import * as math from "mathjs";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

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

const messages: Record<string, Message[]> = {};
const onlineUsers: Map<string, OnlineUser> = new Map(); // socketId -> user info
const userSockets: Map<string, string> = new Map(); // username -> socketId

app.prepare().then(() => {
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
      const userList = Array.from(onlineUsers.values()).map(u => u.username);
      io.emit("online_users", userList);
      
      console.log(`User registered: ${username}`);
    });

    socket.on("join_room", ({ roomId, user }) => {
      socket.join(roomId);
      if (!messages[roomId]) messages[roomId] = [];
      
      // Send room history to the joining user
      socket.emit("room_history", { roomId, messages: messages[roomId] });
      
      // Notify others in the room
      socket.to(roomId).emit("message", {
        from: "System",
        text: `${user} joined the room`,
        ts: Date.now(),
        roomId
      });
    });

    socket.on("send_message", ({ roomId, msg }) => {
      const message = { ...msg, roomId };
      
      if (!messages[roomId]) messages[roomId] = [];
      messages[roomId].push(message);
      
      // Broadcast to all users in the room including sender
      io.to(roomId).emit("message", message);
      
      console.log(`Message sent to ${roomId}:`, message);
    });

    socket.on("send_dm", ({ toUser, msg }) => {
      const dmRoomId = [msg.from, toUser].sort().join("_dm_");
      const message = { ...msg, roomId: dmRoomId };
      
      if (!messages[dmRoomId]) messages[dmRoomId] = [];
      messages[dmRoomId].push(message);
      
      const recipientSocketId = userSockets.get(toUser);
      
      // Send to recipient
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message", message);
      }
      
      // Send back to sender
      socket.emit("message", message);
      
      console.log(`DM sent from ${msg.from} to ${toUser}`);
    });

    socket.on("calc", ({ expr, roomId }) => {
      let result;
      try {
        result = math.evaluate(expr);
      } catch {
        result = "Error";
      }
      const msg: Message = {
        from: "Calculator",
        text: `${expr} = ${result}`,
        ts: Date.now(),
        roomId
      };
      
      if (!messages[roomId]) messages[roomId] = [];
      messages[roomId].push(msg);
      
      io.to(roomId).emit("message", msg);
    });

    socket.on("disconnect", () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        userSockets.delete(user.username);
        onlineUsers.delete(socket.id);
        
        // Broadcast updated user list
        const userList = Array.from(onlineUsers.values()).map(u => u.username);
        io.emit("online_users", userList);
        
        console.log(`User disconnected: ${user.username}`);
      }
      console.log("Socket disconnected:", socket.id);
    });
  });

  const PORT = 3000;
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
