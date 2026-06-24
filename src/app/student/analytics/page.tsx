import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, startOfDay, shortDay } from "@/lib/dates";
import { PageHeader } from "@/components/AppShell";
import { Card, CardTitle, EmptyState } from "@/components/ui";
import { MoodTrendChart, HabitBarChart, StressPieChart } from "@/components/charts/Charts";

export default async function AnalyticsPage() {
  const user = await requireUser("student");
  const today = startOfDay();
  const monthAgo = addDays(today, -29);

  const [moodLogs, habits, stressGroups] = await Promise.all([
    prisma.moodLog.findMany({
      where: { studentUserId: user.id },
      orderBy: { logDate: "asc" },
      take: 14,
    }),
    prisma.habit.findMany({
      include: {
        logs: {
          where: { studentUserId: user.id, completed: true, logDate: { gte: monthAgo } },
          select: { id: true },
        },
      },
      orderBy: { id: "asc" },
    }),
    prisma.moodLog.groupBy({
      by: ["stress"],
      where: { studentUserId: user.id },
      _count: { _all: true },
    }),
  ]);

  const moodData = moodLogs.map((m) => ({ label: shortDay(m.logDate), mood: m.mood }));
  const habitData = habits.map((h) => ({ name: h.name, count: h.logs.length }));
  const stressData = stressGroups
    .sort((a, b) => a.stress - b.stress)
    .map((g) => ({ name: `Level ${g.stress}`, value: g._count._all }));

  const hasData = moodLogs.length > 0;

  return (
    <>
      <PageHeader title="Analytics" subtitle="Trends drawn from your own logged data." />

      {!hasData ? (
        <EmptyState>Log a few days of moods and habits to unlock your analytics.</EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardTitle>Mood trend</CardTitle>
            <MoodTrendChart data={moodData} />
          </Card>
          <Card>
            <CardTitle>Habit completion (30 days)</CardTitle>
            {habitData.some((h) => h.count > 0) ? (
              <HabitBarChart data={habitData} />
            ) : (
              <EmptyState>No habit check-ins yet this month.</EmptyState>
            )}
          </Card>
          <Card>
            <CardTitle>Stress breakdown</CardTitle>
            {stressData.length > 0 ? (
              <StressPieChart data={stressData} />
            ) : (
              <EmptyState>No stress data yet.</EmptyState>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
