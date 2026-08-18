import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid email" },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  await connectDB();

  const doc = await DocumentModel.findById(id);
  if (!doc) {
    return NextResponse.json({ error: "Notepad not found" }, { status: 404 });
  }

  if (doc.ownerId.toString() !== session.id) {
    return NextResponse.json(
      { error: "Only the owner can invite people" },
      { status: 403 }
    );
  }

  if (parsed.data.email === session.email.toLowerCase()) {
    return NextResponse.json(
      { error: "You already own this notepad" },
      { status: 400 }
    );
  }

  const invitee = await User.findOne({ email: parsed.data.email });
  if (!invitee) {
    return NextResponse.json(
      {
        error:
          "No CollabDocs account with that email. They need to register first.",
      },
      { status: 404 }
    );
  }

  const alreadyOnDoc =
    doc.ownerId.toString() === invitee._id.toString() ||
    doc.collaborators.some((c) => c.userId.toString() === invitee._id.toString());

  if (alreadyOnDoc) {
    return NextResponse.json(
      { error: "That person already has access" },
      { status: 409 }
    );
  }

  const existing = await Notification.findOne({
    recipientId: invitee._id,
    documentId: doc._id,
    type: "collab_invite",
    status: "pending",
  });

  if (existing) {
    return NextResponse.json(
      { error: "Invite already sent. They’ll see it in their bell." },
      { status: 409 }
    );
  }

  await Notification.create({
    recipientId: invitee._id,
    actorId: session.id,
    documentId: doc._id,
    documentTitle: doc.title || "Untitled notepad",
    type: "collab_invite",
    status: "pending",
    read: false,
  });

  return NextResponse.json({
    ok: true,
    invited: { name: invitee.name, email: invitee.email },
  });
}
