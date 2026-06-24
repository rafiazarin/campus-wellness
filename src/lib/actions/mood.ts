"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/dates";

const clamp = (n: number) => Math.min(5, Math.max(1, Math.round(Number(n) || 3)));

export async function logMood(input: {
  mood: number;
  stress: number;
  sleep: number;
  note?: string;
}) {
  const user = await requireUser("student");
  const logDate = startOfDay();

  const data = {
    mood: clamp(input.mood),
    stress: clamp(input.stress),
    sleep: clamp(input.sleep),
    note: input.note?.trim() || null,
  };

  await prisma.moodLog.upsert({
    where: { studentUserId_logDate: { studentUserId: user.id, logDate } },
    create: { studentUserId: user.id, logDate, ...data },
    update: data,
  });

  revalidatePath("/student/mood");
  revalidatePath("/student/dashboard");
  revalidatePath("/student/analytics");
}
