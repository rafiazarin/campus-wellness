import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSession, dashboardPath, type Role } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "");
  const role: Role = body.role === "professional" ? "professional" : "student";

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }
  if (role === "student" && !email.endsWith("@std.edu")) {
    return NextResponse.json(
      { message: "Students must sign up with an @std.edu email." },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "An account with this email already exists." }, {
      status: 409,
    });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role,
      ...(role === "student"
        ? { student: { create: {} } }
        : { professional: { create: { specialization: body.specialization ?? null } } }),
    },
  });

  await createSession(user.id);
  return NextResponse.json({ ok: true, redirect: dashboardPath(role) });
}
