import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { SessionUser } from "@/types";
import { signToken, verifyToken } from "@/lib/auth";

export const SESSION_COOKIE = "collabdocs_session";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

function cookieOptions(maxAgeSeconds?: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(maxAgeSeconds ? { maxAge: maxAgeSeconds } : {}),
  };
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return signToken(user);
}

export function attachSessionCookie(
  response: NextResponse,
  token: string,
  remember = true
) {
  response.cookies.set(
    SESSION_COOKIE,
    token,
    cookieOptions(remember ? SEVEN_DAYS : undefined)
  );
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
