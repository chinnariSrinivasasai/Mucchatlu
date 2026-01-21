import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// CSP Header Middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:5000 ws://localhost:5000; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ================= SOCKET STATE =================
const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // User comes online
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User online:", userId);

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // Join chat room
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
  });

  // Send message
  socket.on("send-message", (data) => {
    // data: { chatId, message }
    socket.to(data.chatId).emit("receive-message", data.message);
  });

  // Typing
  socket.on("typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("typing", { userId });
  });

  // Seen
  socket.on("seen", ({ chatId, messageId }) => {
    socket.to(chatId).emit("seen", { messageId });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("Mucchatlu Backend Running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// ================= DB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
  
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running"));
