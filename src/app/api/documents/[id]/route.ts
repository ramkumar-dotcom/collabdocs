import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import { getSession } from "@/lib/session";
import { serializeDoc, userDocFilter } from "@/lib/documents";

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

  const doc = await DocumentModel.findOneAndUpdate(
    { _id: id, ...userDocFilter(user.id) },
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
