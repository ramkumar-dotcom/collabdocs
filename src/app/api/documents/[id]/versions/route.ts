import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import Version from "@/models/Version";
import { getSession } from "@/lib/session";
import { userDocFilter } from "@/lib/documents";
import { canEditRole, getAccessRole } from "@/lib/access";

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

  const versions = await Version.find({ documentId: id })
    .sort({ createdAt: -1 })
    .limit(40)
    .lean();

  return NextResponse.json({
    versions: versions.map((v) => ({
      id: v._id.toString(),
      title: v.title,
      content: v.content,
      authorName: v.authorName,
      createdAt: v.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const body = (await request.json()) as { versionId?: string };
  if (!body.versionId) {
    return NextResponse.json({ error: "versionId required" }, { status: 400 });
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
  if (!canEditRole(getAccessRole(doc, session.id))) {
    return NextResponse.json(
      { error: "You have view-only access" },
      { status: 403 }
    );
  }

  const version = await Version.findOne({
    _id: body.versionId,
    documentId: id,
  });
  if (!version) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  doc.title = version.title;
  doc.content = version.content;
  await doc.save();

  return NextResponse.json({
    ok: true,
    title: doc.title,
    content: doc.content,
  });
}
