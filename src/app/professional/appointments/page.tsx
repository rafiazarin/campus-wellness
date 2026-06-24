import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/AppShell";
import { Card, StatusBadge, EmptyState } from "@/components/ui";
import { AppointmentActions } from "@/components/AppointmentActions";

export default async function ProfessionalAppointments() {
  const user = await requireUser("professional");

  const appointments = await prisma.appointment.findMany({
    where: { professionalUserId: user.id },
    include: { student: { include: { user: true } } },
    orderBy: [{ status: "asc" }, { date: "asc" }, { time: "asc" }],
  });

  // Average mood per requesting student (last few weeks) — useful triage context.
  const studentIds = Array.from(new Set(appointments.map((a) => a.studentUserId)));
  const moodAverages = await prisma.moodLog.groupBy({
    by: ["studentUserId"],
    where: { studentUserId: { in: studentIds } },
    _avg: { mood: true },
  });
  const avgByStudent = new Map(moodAverages.map((m) => [m.studentUserId, m._avg.mood]));

  const pending = appointments.filter((a) => a.status === "Pending");
  const others = appointments.filter((a) => a.status !== "Pending");

  function MoodHint({ studentId }: { studentId: number }) {
    const avg = avgByStudent.get(studentId);
    return (
      <span className="text-xs text-slate-500">
        Avg mood: {avg != null ? `${avg.toFixed(1)} / 5` : "no data"}
      </span>
    );
  }

  return (
    <>
      <PageHeader
        title="Appointment requests"
        subtitle="Review incoming requests with quick context on each student."
      />

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <EmptyState>No pending requests right now.</EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((a) => (
              <Card key={a.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{a.student.user.name}</h3>
                    <p className="text-sm text-slate-500">{a.student.user.email}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-700">Type:</span> {a.type}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">When:</span> {formatDate(a.date)} at{" "}
                    {a.time}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Reason:</span> {a.reason || "—"}
                  </p>
                  <MoodHint studentId={a.studentUserId} />
                </div>
                <div className="mt-4">
                  <AppointmentActions id={a.id} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          History
        </h2>
        {others.length === 0 ? (
          <EmptyState>No past or resolved appointments yet.</EmptyState>
        ) : (
          <Card>
            <ul className="divide-y divide-slate-100">
              {others.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {a.student.user.name} · {a.type}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(a.date)} at {a.time}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </>
  );
}
