// server.ts
import "dotenv/config";
import { createServer } from "http";
import nextLib from "next";
import { Server } from "socket.io";
import * as math from "mathjs";
import {
  saveMessage,
  getMessagesByRoom,
} from "./lib/supabase.js";

const dev = process.env.NODE_ENV !== "production";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const next = nextLib as unknown as (options: { dev: boolean }) => any;
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

// Keep online users in memory (doesn't need persistence)
const onlineUsers: Map<string, OnlineUser> = new Map(); // socketId -> user info
const userSockets: Map<string, string> = new Map(); // username -> socketId
const socketRooms: Map<string, string> = new Map(); // socketId -> current roomId

app.prepare().then(async () => {

  const server = createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {

    socket.on("register_user", ({ username }) => {
      onlineUsers.set(socket.id, { socketId: socket.id, username });
      userSockets.set(username, socket.id);

      // Broadcast updated user list to all clients
      const userList = Array.from(onlineUsers.values()).map((u) => u.username);
      io.emit("online_users", userList);

    });

    socket.on("join_room", async ({ roomId, user }) => {
      
      // Leave previous room if any
      const previousRoom = socketRooms.get(socket.id);
      if (previousRoom) {
        socket.leave(previousRoom);
      }
      
      // Join new room
      socket.join(roomId);
      socketRooms.set(socket.id, roomId);

      // Fetch room history from database
      const dbMessages = await getMessagesByRoom(roomId);
      const messages = dbMessages.map((msg) => ({
        from: msg.from_user,
        text: msg.text,
        ts: msg.timestamp,
        roomId: msg.room_id,
      }));

      // Send room history to the joining user
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
      const message = { ...msg, roomId };
      

      // Broadcast to all users in the room including sender
      io.to(roomId).emit("message", message);

    });

    socket.on("send_dm", async ({ toUser, msg }) => {
      const dmRoomId = [msg.from, toUser].sort().join("_dm_");
      const message = { ...msg, roomId: dmRoomId };

      // Save to database
      await saveMessage(dmRoomId, msg.from, msg.text, true);

      const recipientSocketId = userSockets.get(toUser);

      // Send to recipient
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message", message);
      }

      // Send back to sender
      socket.emit("message", message);

    });

    socket.on("load_dm_history", async ({ dmRoomId }) => {
      // Fetch DM history from database
      const dbMessages = await getMessagesByRoom(dmRoomId);
      const messages = dbMessages.map((msg) => ({
        from: msg.from_user,
        text: msg.text,
        ts: msg.timestamp,
        roomId: msg.room_id,
      }));

      // Send DM history to the requesting user
      socket.emit("room_history", { roomId: dmRoomId, messages });

    });

    socket.on("calc", async ({ expr, roomId, user }) => {
      let result;
      try {
        result = math.evaluate(expr);
      } catch {
        result = "Error";
      }
      const msg: Message = {
        from: user,
        text: `equation ${expr} = ${result}`,
        ts: Date.now(),
        roomId,
      };

      // Save to database
      await saveMessage(roomId, user, msg.text, false);

      io.to(roomId).emit("message", msg);
    });

    socket.on("disconnect", () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        userSockets.delete(user.username);
        onlineUsers.delete(socket.id);
        socketRooms.delete(socket.id);

        // Broadcast updated user list
        const userList = Array.from(onlineUsers.values()).map(
          (u) => u.username
        );
        io.emit("online_users", userList);

      }
    });
  });

  const PORT = parseInt(process.env.PORT || "3000", 10);
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
