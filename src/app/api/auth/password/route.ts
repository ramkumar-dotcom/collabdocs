import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await User.findById(session.id);
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const ok = await verifyPassword(
    parsed.data.currentPassword,
    user.passwordHash
  );
  if (!ok) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 401 }
    );
  }

  user.passwordHash = await hashPassword(parsed.data.newPassword);
  await user.save();

  return NextResponse.json({ ok: true });
}
