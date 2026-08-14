import mongoose from "mongoose";
import DocumentModel from "@/models/Document";

export function userDocFilter(userId: string) {
  return {
    $or: [
      { ownerId: userId },
      { "collaborators.userId": userId },
    ],
  };
}

export function serializeDoc(doc: {
  _id: mongoose.Types.ObjectId;
  title: string;
  content?: string | null;
  ownerId: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}) {
  const plain = (doc.content ?? "").replace(/<[^>]+>/g, " ").trim();
  const preview = plain.slice(0, 140);

  return {
    id: doc._id.toString(),
    title: doc.title || "Untitled notepad",
    preview,
    ownerId: doc.ownerId.toString(),
    updatedAt: doc.updatedAt.toISOString(),
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function listUserDocuments(userId: string) {
  const docs = await DocumentModel.find(userDocFilter(userId))
    .sort({ updatedAt: -1 })
    .limit(48)
    .lean();

  return docs.map((doc) =>
    serializeDoc({
      _id: doc._id,
      title: doc.title,
      content: doc.content,
      ownerId: doc.ownerId,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
    })
  );
}
