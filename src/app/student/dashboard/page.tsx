import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, addDays, formatDate } from "@/lib/dates";
import { wellnessTip, SCALE_LABELS } from "@/lib/constants";
import { PageHeader } from "@/components/AppShell";
import { Card, CardTitle, ButtonLink, StatusBadge, EmptyState } from "@/components/ui";
import { StatCard, ScoreDots } from "@/components/StatCard";

export default async function StudentDashboard() {
  const user = await requireUser("student");
  const today = startOfDay();
  const weekAgo = addDays(today, -6);

  const [todayMood, latestMood, totalHabits, habitsToday, weekHabitLogs, appointments, unread] =
    await Promise.all([
      prisma.moodLog.findUnique({
        where: { studentUserId_logDate: { studentUserId: user.id, logDate: today } },
      }),
      prisma.moodLog.findFirst({ where: { studentUserId: user.id }, orderBy: { logDate: "desc" } }),
      prisma.habit.count(),
      prisma.habitLog.count({ where: { studentUserId: user.id, logDate: today, completed: true } }),
      prisma.habitLog.count({
        where: { studentUserId: user.id, completed: true, logDate: { gte: weekAgo, lte: today } },
      }),
      prisma.appointment.findMany({
        where: {
          studentUserId: user.id,
          date: { gte: today },
          status: { in: ["Pending", "Approved"] },
        },
        include: { professional: { include: { user: true } } },
        orderBy: [{ date: "asc" }, { time: "asc" }],
        take: 3,
      }),
      prisma.notification.count({ where: { studentUserId: user.id, read: false } }),
    ]);

  const tip = wellnessTip(latestMood?.mood, latestMood?.stress, latestMood?.sleep);
  const habitPct = totalHabits ? Math.round((habitsToday / totalHabits) * 100) : 0;

  return (
    <>
      <PageHeader
        title={`Hi, ${user.name.split(" ")[0]} 👋`}
        subtitle="Here's a snapshot of your wellness today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon="SmilePlus"
          label="Today's mood"
          value={todayMood ? SCALE_LABELS[todayMood.mood] : "Not logged"}
          hint={todayMood ? "Logged for today" : "Tap Mood Log to add it"}
        />
        <StatCard
          icon="ListChecks"
          label="Habits today"
          value={`${habitsToday}/${totalHabits}`}
          hint={`${habitPct}% complete`}
          tone="emerald"
        />
        <StatCard
          icon="CalendarCheck"
          label="This week's habit wins"
          value={weekHabitLogs}
          hint="completed in the last 7 days"
          tone="amber"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Suggestion for you</CardTitle>
          <p className="text-sm text-slate-600">{tip}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/student/mood">Log today&apos;s mood</ButtonLink>
            <ButtonLink href="/student/habits" variant="secondary">
              Open habit tracker
            </ButtonLink>
          </div>

          {todayMood && (
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
              <div>
                <p className="text-slate-500">Mood</p>
                <ScoreDots value={todayMood.mood} />
              </div>
              <div>
                <p className="text-slate-500">Stress</p>
                <ScoreDots value={todayMood.stress} tone="rose" />
              </div>
              <div>
                <p className="text-slate-500">Sleep</p>
                <ScoreDots value={todayMood.sleep} tone="emerald" />
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            {unread > 0 && (
              <span className="pill bg-brand-100 text-brand-700">{unread} new</span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {unread > 0
              ? "You have updates waiting."
              : "You're all caught up — nothing new right now."}
          </p>
          <div className="mt-4">
            <ButtonLink href="/student/notifications" variant="secondary">
              View notifications
            </ButtonLink>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Upcoming appointments</CardTitle>
          <Link href="/student/appointments" className="text-sm font-medium text-brand-600 hover:underline">
            Book new
          </Link>
        </div>
        {appointments.length === 0 ? (
          <EmptyState>No upcoming appointments. Book one when you need support.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-100">
            {appointments.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {a.type} with {a.professional.user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(a.date)} · {a.time}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
