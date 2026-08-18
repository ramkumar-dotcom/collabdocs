import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import { escapeRegex } from "@/lib/mongo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ users: [] });
  }

  await connectDB();

  const safe = escapeRegex(q);
  const users = await User.find({
    _id: { $ne: session.id },
    $or: [
      { email: { $regex: safe, $options: "i" } },
      { name: { $regex: safe, $options: "i" } },
    ],
  })
    .select("name email")
    .limit(8)
    .lean();

  return NextResponse.json({
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
    })),
  });
}
