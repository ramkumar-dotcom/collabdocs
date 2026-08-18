import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import { userDocFilter } from "@/lib/documents";
import { isObjectId } from "@/lib/mongo";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }
  await connectDB();
  const doc = await DocumentModel.findOne({
    _id: id,
    ...userDocFilter(session.id),
  });
  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  const owner = await User.findById(doc.ownerId).select("name email").lean();
  const ids = doc.collaborators.map((c) => c.userId);
  const users = await User.find({ _id: { $in: ids } })
    .select("name email")
    .lean();
  const map = new Map(users.map((u) => [u._id.toString(), u]));

  return NextResponse.json({
    people: [
      {
        id: doc.ownerId.toString(),
        name: owner?.name ?? "Owner",
        email: owner?.email ?? "",
        role: "owner" as const,
      },
      ...doc.collaborators
        .filter((c) => c.userId.toString() !== doc.ownerId.toString())
        .map((c) => {
          const u = map.get(c.userId.toString());
          return {
            id: c.userId.toString(),
            name: u?.name ?? "Collaborator",
            email: u?.email ?? "",
            role: c.role === "viewer" ? "viewer" : "editor",
          };
        }),
    ],
  });
}

const removeSchema = z.object({
  userId: z.string().min(1),
});

export async function DELETE(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const parsed = removeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const { id } = await context.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }
  await connectDB();
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }
  if (doc.ownerId.toString() !== session.id) {
    return NextResponse.json(
      { error: "Only the owner can remove people" },
      { status: 403 }
    );
  }
  if (parsed.data.userId === doc.ownerId.toString()) {
    return NextResponse.json({ error: "Cannot remove the owner" }, { status: 400 });
  }

  if (!isObjectId(parsed.data.userId)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }
  doc.collaborators.pull({ userId: parsed.data.userId });
  await doc.save();
  return NextResponse.json({ ok: true });
}
