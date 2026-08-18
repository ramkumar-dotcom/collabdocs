import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import Comment from "@/models/Comment";
import DocumentModel from "@/models/Document";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string; commentId: string }> };

const patchSchema = z.object({
  resolved: z.boolean(),
});

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const { id, commentId } = await context.params;
  await connectDB();
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  const comment = await Comment.findOne({ _id: commentId, documentId: id });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  comment.resolved = parsed.data.resolved;
  await comment.save();
  return NextResponse.json({ ok: true, resolved: comment.resolved });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id, commentId } = await context.params;
  await connectDB();
  const comment = await Comment.findOne({ _id: commentId, documentId: id });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  if (comment.authorId.toString() !== session.id) {
    return NextResponse.json({ error: "You can only delete your comments" }, { status: 403 });
  }
  await comment.deleteOne();
  return NextResponse.json({ ok: true });
}
