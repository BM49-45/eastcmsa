import { Server, Socket } from "socket.io";
import { getRecentActivities } from "@/lib/activity";

let io: Server;

export const initSocket = (server: any) => {
  if (io) return io;

  io = new Server(server, {
    path: "/api/socket",
    cors: { origin: "*" },
  });

  io.on("connection", async (socket: Socket) => {
    console.log("WS client connected:", socket.id);

    // Send initial recent activities
    const activities = await getRecentActivities(10);
    socket.emit("activities", activities);

    socket.on("markAllRead", () => {
      socket.emit("activities", []);
    });

    socket.on("newActivity", (activity) => {
      socket.broadcast.emit("activities", [activity]);
    });
  });

  return io;
};
