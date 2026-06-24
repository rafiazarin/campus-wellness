import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/dates";
import { PageHeader } from "@/components/AppShell";
import { HabitTracker } from "@/components/HabitTracker";

export default async function HabitsPage() {
  const user = await requireUser("student");
  const today = startOfDay();

  const [habits, todayLogs] = await Promise.all([
    prisma.habit.findMany({ orderBy: { id: "asc" } }),
    prisma.habitLog.findMany({
      where: { studentUserId: user.id, logDate: today, completed: true },
      select: { habitId: true },
    }),
  ]);

  return (
    <>
      <PageHeader title="Habit tracker" subtitle="Check off what you've done today." />
      <HabitTracker habits={habits} completedIds={todayLogs.map((l) => l.habitId)} />
    </>
  );
}
