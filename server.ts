// server.ts
import "dotenv/config";
import { createServer } from "http";
import nextLib from "next";
import { Server } from "socket.io";
import * as math from "mathjs";
import {
  saveMessage,
  getMessagesByRoom,
  testSupabaseConnection,
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

      // Broadcast to all users in the room including sender
      console.log(`📡 [SERVER] Broadcasting message to room: ${roomId}`);
      io.to(roomId).emit("message", message);

      console.log(`✅ [SERVER] Message sent to ${roomId}:`, message);
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

      console.log(`DM sent from ${msg.from} to ${toUser}`);
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

      console.log(
        `Loaded DM history for ${dmRoomId}: ${messages.length} messages`
      );
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

        console.log(`User disconnected: ${user.username}`);
      }
      console.log("Socket disconnected:", socket.id);
    });
  });

  const PORT = parseInt(process.env.PORT || "3000", 10);
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
