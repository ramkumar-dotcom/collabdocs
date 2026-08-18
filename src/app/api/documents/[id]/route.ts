import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import Version from "@/models/Version";
import { getSession } from "@/lib/session";
import { serializeDoc, userDocFilter } from "@/lib/documents";
import { canEditRole, getAccessRole } from "@/lib/access";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().max(200_000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await context.params;
  await connectDB();

  const doc = await DocumentModel.findOne({
    _id: id,
    ...userDocFilter(user.id),
  });

  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  return NextResponse.json({
    document: {
      ...serializeDoc(doc),
      content: doc.content ?? "",
    },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await context.params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  await connectDB();

  const existing = await DocumentModel.findOne({
    _id: id,
    ...userDocFilter(user.id),
  });
  if (!existing) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  const role = getAccessRole(existing, user.id);
  if (!canEditRole(role)) {
    return NextResponse.json(
      { error: "You have view-only access" },
      { status: 403 }
    );
  }

  if (parsed.data.content !== undefined) {
    const last = await Version.findOne({ documentId: existing._id }).sort({
      createdAt: -1,
    });
    const changed = last?.content !== parsed.data.content;
    const aged =
      !last || Date.now() - last.createdAt.getTime() > 30_000;
    if (changed && aged) {
      await Version.create({
        documentId: existing._id,
        title: parsed.data.title ?? existing.title,
        content: parsed.data.content,
        authorId: user.id,
        authorName: user.name,
      });
      const extras = await Version.find({ documentId: existing._id })
        .sort({ createdAt: -1 })
        .skip(40)
        .select("_id");
      if (extras.length) {
        await Version.deleteMany({
          _id: { $in: extras.map((v) => v._id) },
        });
      }
    }
  }

  const doc = await DocumentModel.findByIdAndUpdate(
    existing._id,
    { $set: parsed.data },
    { new: true }
  );

  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  return NextResponse.json({
    document: {
      ...serializeDoc(doc),
      content: doc.content ?? "",
    },
  });
}
