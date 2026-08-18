import mongoose from "mongoose";

export function serializeNotification(doc: {
  _id: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  documentTitle: string;
  type: string;
  status: string;
  read: boolean;
  createdAt: Date;
  actor?: { name?: string; email?: string } | null;
  role?: string;
}) {
  return {
    id: doc._id.toString(),
    documentId: doc.documentId.toString(),
    documentTitle: doc.documentTitle,
    type: doc.type,
    status: doc.status,
    read: doc.read,
    role: doc.role === "viewer" ? "viewer" : "editor",
    createdAt: doc.createdAt.toISOString(),
    actorName: doc.actor?.name ?? "Someone",
    actorEmail: doc.actor?.email ?? "",
  };
}
