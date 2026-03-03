import { Server, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: Server | null = null;

export const initSocket = (server: HTTPServer) => {
  if (io) return io;

  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.emit("message", {
      text: "Socket connected successfully",
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};