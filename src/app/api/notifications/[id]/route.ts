import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const schema = z.object({
  action: z.enum(["accept", "decline", "read"]),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { id } = await context.params;
  await connectDB();

  const note = await Notification.findOne({
    _id: id,
    recipientId: session.id,
  });

  if (!note) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  if (parsed.data.action === "read") {
    note.read = true;
    await note.save();
    return NextResponse.json({ ok: true, status: note.status });
  }

  if (note.status !== "pending") {
    return NextResponse.json(
      { error: "This invite was already handled" },
      { status: 409 }
    );
  }

  if (parsed.data.action === "decline") {
    note.status = "declined";
    note.read = true;
    await note.save();
    return NextResponse.json({ ok: true, status: "declined" });
  }

  const doc = await DocumentModel.findById(note.documentId);
  if (!doc) {
    note.status = "declined";
    note.read = true;
    await note.save();
    return NextResponse.json(
      { error: "That notepad no longer exists" },
      { status: 404 }
    );
  }

  const already = doc.collaborators.some(
    (c) => c.userId.toString() === session.id
  );
  if (!already && doc.ownerId.toString() !== session.id) {
    const role = note.role === "viewer" ? "viewer" : "editor";
    doc.collaborators.push({ userId: session.id, role });
    await doc.save();
  }

  note.status = "accepted";
  note.read = true;
  note.documentTitle = doc.title || note.documentTitle;
  await note.save();

  return NextResponse.json({
    ok: true,
    status: "accepted",
    documentId: doc._id.toString(),
  });
}
