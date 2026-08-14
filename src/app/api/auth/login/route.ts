import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/auth-schema";
import {
  attachSessionCookie,
  createSessionToken,
} from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password, remember } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json({ user: sessionUser });
    attachSessionCookie(response, token, remember !== false);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
