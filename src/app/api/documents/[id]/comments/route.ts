import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import Comment from "@/models/Comment";
import DocumentModel from "@/models/Document";
import { getSession } from "@/lib/session";
import { userDocFilter } from "@/lib/documents";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await context.params;
  await connectDB();
  const doc = await DocumentModel.findOne({
    _id: id,
    ...userDocFilter(session.id),
  });
  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  const comments = await Comment.find({ documentId: id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c._id.toString(),
      authorName: c.authorName,
      quote: c.quote,
      body: c.body,
      resolved: c.resolved,
      createdAt: c.createdAt.toISOString(),
      mine: c.authorId.toString() === session.id,
    })),
  });
}

const createSchema = z.object({
  quote: z.string().trim().max(500).optional().default(""),
  body: z.string().trim().min(1, "Comment cannot be empty").max(2000),
});

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid comment" },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  await connectDB();
  const doc = await DocumentModel.findOne({
    _id: id,
    ...userDocFilter(session.id),
  });
  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  const comment = await Comment.create({
    documentId: id,
    authorId: session.id,
    authorName: session.name,
    quote: parsed.data.quote,
    body: parsed.data.body,
  });

  return NextResponse.json(
    {
      comment: {
        id: comment._id.toString(),
        authorName: comment.authorName,
        quote: comment.quote,
        body: comment.body,
        resolved: comment.resolved,
        createdAt: comment.createdAt.toISOString(),
        mine: true,
      },
    },
    { status: 201 }
  );
}
