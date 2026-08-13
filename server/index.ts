/**
 * Real-time collaboration server (Socket.IO + Yjs).
 * Local:  npm run dev:socket
 * Hosted: npm run start:socket  (Railway / Render / Fly set PORT)
 */
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

// Cloud hosts inject PORT; local uses SOCKET_PORT or 4000
const PORT = Number(process.env.PORT || process.env.SOCKET_PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const httpServer = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      ok: true,
      service: "collabdocs-socket",
      port: PORT,
    })
  );
});

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Helpful behind proxies (Railway, Render, etc.)
  transports: ["websocket", "polling"],
});

// Yjs over Socket.IO — rooms map to document IDs
const ysocketio = new YSocketIO(io, {
  // In-memory docs for now; persistence to MongoDB comes later
  gcEnabled: true,
});

ysocketio.initialize();

io.on("connection", (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
  });
});

// 0.0.0.0 required on most cloud platforms
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[collabdocs] collaboration server listening on 0.0.0.0:${PORT}`);
  console.log(`[collabdocs] CORS origin: ${CORS_ORIGIN}`);
});
