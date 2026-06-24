import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/AppShell";
import { Card, CardTitle, StatusBadge, EmptyState } from "@/components/ui";
import { BookingForm } from "@/components/BookingForm";

export default async function AppointmentsPage() {
  const user = await requireUser("student");

  const [professionals, appointments] = await Promise.all([
    prisma.professional.findMany({ include: { user: true }, orderBy: { userId: "asc" } }),
    prisma.appointment.findMany({
      where: { studentUserId: user.id },
      include: { professional: { include: { user: true } } },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    }),
  ]);

  const pros = professionals.map((p) => ({
    userId: p.userId,
    name: p.user.name,
    specialization: p.specialization,
  }));

  return (
    <>
      <PageHeader
        title="Appointments"
        subtitle="Book time with a wellness professional and track each request."
        action={<BookingForm professionals={pros} />}
      />

      <Card>
        <CardTitle>Your appointments</CardTitle>
        {appointments.length === 0 ? (
          <EmptyState>No appointments yet. Use “New appointment” to book your first one.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-100">
            {appointments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {a.type} with {a.professional.user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(a.date)} · {a.time}
                    {a.reason ? ` · ${a.reason}` : ""}
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
