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

export type CollabSession = {
  ydoc: Y.Doc;
  provider: SocketIOProvider;
  seeded: boolean;
};

export function createCollabSession(documentId: string): CollabSession {
  const ydoc = new Y.Doc();
  const provider = new SocketIOProvider(
    getSocketUrl(),
    `doc-${documentId}`,
    ydoc,
    {
      autoConnect: true,
      // Broadcast channel + socket both apply updates and can duplicate text
      disableBc: true,
    },
    {
      transports: ["websocket", "polling"],
      withCredentials: true,
    }
  );

  return { ydoc, provider, seeded: false };
}

export function yFragmentIsEmpty(ydoc: Y.Doc, field = "default"): boolean {
  return ydoc.getXmlFragment(field).length === 0;
}

/** Seed saved HTML only after Yjs has synced, and only once per room. */
export function seedIfEmpty(session: CollabSession, html: string): boolean {
  if (session.seeded) return false;

  const meta = session.ydoc.getMap("meta");
  if (meta.get("seeded") === true) {
    session.seeded = true;
    return false;
  }

  if (!yFragmentIsEmpty(session.ydoc)) {
    meta.set("seeded", true);
    session.seeded = true;
    return false;
  }

  session.seeded = true;
  meta.set("seeded", true);
  return Boolean(html);
}
