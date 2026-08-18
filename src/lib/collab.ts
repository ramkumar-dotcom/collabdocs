import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

export const USER_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#16a34a",
  "#0891b2",
  "#ca8a04",
  "#dc2626",
];

export function colorForUser(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return USER_COLORS[hash % USER_COLORS.length];
}

export function getSocketUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/$/, "") ||
    "http://localhost:4000"
  );
}

export function createCollabSession(documentId: string) {
  const ydoc = new Y.Doc();
  const provider = new SocketIOProvider(
    getSocketUrl(),
    `doc-${documentId}`,
    ydoc,
    { autoConnect: true, disableBc: false },
    {
      transports: ["websocket", "polling"],
      withCredentials: true,
    }
  );

  return { ydoc, provider };
}

export function yFragmentIsEmpty(ydoc: Y.Doc, field = "default"): boolean {
  return ydoc.getXmlFragment(field).length === 0;
}
