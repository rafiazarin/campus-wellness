"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function markAllNotificationsRead() {
  const user = await requireUser("student");
  await prisma.notification.updateMany({
    where: { studentUserId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/student/notifications");
  revalidatePath("/student/dashboard");
}
