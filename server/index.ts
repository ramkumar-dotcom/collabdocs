/**
 * Real-time collaboration server (Socket.IO + Yjs).
 * Run with: npm run dev:socket  (or npm run dev for Next + this together)
 */
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

const PORT = Number(process.env.SOCKET_PORT || 4000);
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

httpServer.listen(PORT, () => {
  console.log(`[collabdocs] collaboration server on http://localhost:${PORT}`);
  console.log(`[collabdocs] CORS origin: ${CORS_ORIGIN}`);
});
