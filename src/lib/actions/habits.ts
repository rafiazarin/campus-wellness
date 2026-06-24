"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/dates";

export async function toggleHabit(habitId: number, completed: boolean) {
  const user = await requireUser("student");
  const logDate = startOfDay();

  if (completed) {
    await prisma.habitLog.upsert({
      where: {
        studentUserId_habitId_logDate: { studentUserId: user.id, habitId, logDate },
      },
      create: { studentUserId: user.id, habitId, logDate, completed: true },
      update: { completed: true },
    });
  } else {
    await prisma.habitLog.deleteMany({ where: { studentUserId: user.id, habitId, logDate } });
  }

  revalidatePath("/student/habits");
  revalidatePath("/student/dashboard");
  revalidatePath("/student/analytics");
}

export async function addHabit(name: string) {
  await requireUser("student");
  const clean = name.trim();
  if (!clean) return;
  await prisma.habit.upsert({ where: { name: clean }, create: { name: clean }, update: {} });
  revalidatePath("/student/habits");
}
