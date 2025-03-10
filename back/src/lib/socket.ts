import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

type UserSocketMap = {
  [key: string]: string;
};
const userSocketMap: UserSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;
  if (userId) {
    userSocketMap[userId] = socket.id;
    // console.log(`User ${userId} connected with socket ID ${socket.id}`);
  }

  // Emit the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});

io.on("disconnect", (socket) => {
  console.log("A user disconnected", socket.id);
  const userId = socket.handshake.query.userId as string | undefined;
  if (userId) {
    delete userSocketMap[userId];
    console.log(`User ${userId} disconnected`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});


export { io, app, server };
