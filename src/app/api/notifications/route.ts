import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import { serializeNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  await connectDB();

  const items = await Notification.find({ recipientId: session.id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  const actorIds = [...new Set(items.map((n) => n.actorId.toString()))];
  const actors = await User.find({ _id: { $in: actorIds } })
    .select("name email")
    .lean();
  const actorMap = new Map(actors.map((a) => [a._id.toString(), a]));

  const notifications = items.map((n) =>
    serializeNotification({
      ...n,
      actor: actorMap.get(n.actorId.toString()) ?? null,
    })
  );

  const unreadCount = notifications.filter(
    (n) => !n.read || n.status === "pending"
  ).length;

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  await connectDB();
  await Notification.updateMany(
    { recipientId: session.id, read: false },
    { $set: { read: true } }
  );

  return NextResponse.json({ ok: true });
}
