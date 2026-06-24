"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/dates";
import { APPOINTMENT_STATUSES, APPOINTMENT_TYPES } from "@/lib/constants";

export async function bookAppointment(input: {
  professionalUserId: number;
  type: string;
  date: string; // YYYY-MM-DD
  time: string;
  reason?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser("student");

  const type = (APPOINTMENT_TYPES as readonly string[]).includes(input.type)
    ? input.type
    : "Counseling";
  if (!input.professionalUserId || !input.date || !input.time) {
    return { ok: false, error: "Please complete all required fields." };
  }

  const professional = await prisma.professional.findUnique({
    where: { userId: Number(input.professionalUserId) },
  });
  if (!professional) return { ok: false, error: "Selected professional was not found." };

  await prisma.appointment.create({
    data: {
      studentUserId: user.id,
      professionalUserId: Number(input.professionalUserId),
      type,
      date: startOfDay(new Date(input.date)),
      time: input.time,
      reason: input.reason?.trim() || null,
      status: "Pending",
    },
  });

  revalidatePath("/student/appointments");
  revalidatePath("/student/dashboard");
  return { ok: true };
}

export async function setAppointmentStatus(id: number, status: string) {
  const user = await requireUser("professional");
  if (!(APPOINTMENT_STATUSES as readonly string[]).includes(status)) return;

  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt || appt.professionalUserId !== user.id) return; // ownership check

  await prisma.appointment.update({ where: { id }, data: { status } });

  await prisma.notification.create({
    data: {
      studentUserId: appt.studentUserId,
      message: `Your ${appt.type.toLowerCase()} appointment was ${status.toLowerCase()}.`,
    },
  });

  revalidatePath("/professional/appointments");
  revalidatePath("/professional/dashboard");
}
