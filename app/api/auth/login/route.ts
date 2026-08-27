import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas";
import { signSession, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.adminUser.findUnique({ where: { email } });

  const invalidResponse = () =>
    NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  if (!user) {
    return invalidResponse();
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return invalidResponse();
  }

  const token = await signSession({ sub: user.id, email: user.email });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
