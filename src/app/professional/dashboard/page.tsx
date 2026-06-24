import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, addDays, formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/AppShell";
import { Card, CardTitle, StatusBadge, EmptyState, ButtonLink } from "@/components/ui";
import { StatCard } from "@/components/StatCard";

export default async function ProfessionalDashboard() {
  const user = await requireUser("professional");
  const today = startOfDay();
  const tomorrow = addDays(today, 1);

  const [todaySchedule, pendingCount, upcomingCount] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        professionalUserId: user.id,
        date: { gte: today, lt: tomorrow },
        status: { in: ["Approved", "Pending"] },
      },
      include: { student: { include: { user: true } } },
      orderBy: { time: "asc" },
    }),
    prisma.appointment.count({ where: { professionalUserId: user.id, status: "Pending" } }),
    prisma.appointment.count({
      where: { professionalUserId: user.id, date: { gte: today }, status: "Approved" },
    }),
  ]);

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name}`}
        subtitle="Your schedule and pending requests at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon="CalendarCheck" label="Today's sessions" value={todaySchedule.length} />
        <StatCard
          icon="ClipboardList"
          label="Pending requests"
          value={pendingCount}
          tone="amber"
          hint={pendingCount > 0 ? "Awaiting your response" : "Nothing to review"}
        />
        <StatCard icon="CalendarDays" label="Upcoming (approved)" value={upcomingCount} tone="emerald" />
      </div>

      <Card className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Today&apos;s schedule</CardTitle>
          <ButtonLink href="/professional/appointments" variant="secondary">
            Review requests
          </ButtonLink>
        </div>
        {todaySchedule.length === 0 ? (
          <EmptyState>No sessions scheduled for today.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-100">
            {todaySchedule.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {a.time} · {a.student.user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {a.type}
                    {a.reason ? ` — ${a.reason}` : ""} · {formatDate(a.date)}
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
