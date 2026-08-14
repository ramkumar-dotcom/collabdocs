import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/auth-schema";
import {
  attachSessionCookie,
  createSessionToken,
} from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash });

    const sessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json({ user: sessionUser }, { status: 201 });
    attachSessionCookie(response, token, true);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
