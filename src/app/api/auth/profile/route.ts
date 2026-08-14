import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import {
  attachSessionCookie,
  createSessionToken,
  getSession,
} from "@/lib/session";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid name" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findByIdAndUpdate(
    session.id,
    { $set: { name: parsed.data.name } },
    { new: true }
  );

  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const nextUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  const token = await createSessionToken(nextUser);
  const response = NextResponse.json({ user: nextUser });
  attachSessionCookie(response, token, true);
  return response;
}
