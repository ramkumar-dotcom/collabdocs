import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import { getSession } from "@/lib/session";
import { listUserDocuments, serializeDoc } from "@/lib/documents";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  await connectDB();
  const documents = await listUserDocuments(user.id);
  return NextResponse.json({ documents });
}

export async function POST() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  await connectDB();

  const doc = await DocumentModel.create({
    title: "Untitled notepad",
    content: "",
    ownerId: user.id,
    collaborators: [{ userId: user.id, role: "owner" }],
  });

  return NextResponse.json({ document: serializeDoc(doc) }, { status: 201 });
}
