import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "cw_session";
const SESSION_DAYS = 7;

export type Role = "student" | "professional" | "admin";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export function dashboardPath(role: Role): string {
  switch (role) {
    case "professional":
      return "/professional/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/student/dashboard";
  }
}

// Create a session row and set the cookie. Call from route handlers / actions.
export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({ data: { token, userId, expiresAt } });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroyCurrentSession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().delete(SESSION_COOKIE);
}

// Read the current user from the session cookie. Returns null if not signed in.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role as Role,
  };
}

// Guard a page: redirect to login if unauthenticated, or to the correct
// dashboard if the role doesn't match. Returns the user when allowed.
export async function requireUser(role?: Role): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (role && user.role !== role) redirect(dashboardPath(user.role));
  return user;
}
