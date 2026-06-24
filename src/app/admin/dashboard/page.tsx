import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/AppShell";
import { Card, CardTitle, Badge, EmptyState } from "@/components/ui";
import { StatCard } from "@/components/StatCard";

export default async function AdminDashboard() {
  await requireUser("admin");

  const [students, professionals, appointments, moodLogs, statusGroups, recentUsers] =
    await Promise.all([
      prisma.student.count(),
      prisma.professional.count(),
      prisma.appointment.count(),
      prisma.moodLog.count(),
      prisma.appointment.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

  const statusOrder = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];
  const statusCounts = statusOrder
    .map((s) => ({ status: s, count: statusGroups.find((g) => g.status === s)?._count._all ?? 0 }))
    .filter((s) => s.count > 0);

  return (
    <>
      <PageHeader title="Admin overview" subtitle="Platform-wide activity at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="Users" label="Students" value={students} />
        <StatCard icon="Stethoscope" label="Professionals" value={professionals} tone="emerald" />
        <StatCard icon="CalendarDays" label="Appointments" value={appointments} tone="amber" />
        <StatCard icon="SmilePlus" label="Mood logs" value={moodLogs} tone="slate" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Appointments by status</CardTitle>
          {statusCounts.length === 0 ? (
            <EmptyState>No appointments yet.</EmptyState>
          ) : (
            <ul className="mt-2 space-y-3">
              {statusCounts.map((s) => {
                const pct = appointments ? Math.round((s.count / appointments) * 100) : 0;
                return (
                  <li key={s.status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{s.status}</span>
                      <span className="font-medium text-slate-700">{s.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle>Newest accounts</CardTitle>
          <ul className="divide-y divide-slate-100">
            {recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <Badge tone={u.role === "student" ? "brand" : "neutral"}>{u.role}</Badge>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(u.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
