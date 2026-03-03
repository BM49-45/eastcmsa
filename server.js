// server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let io;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
});