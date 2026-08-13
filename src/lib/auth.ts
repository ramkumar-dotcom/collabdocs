import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

const TOKEN_TTL = "7d";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function signToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (
      typeof payload.id !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
}
