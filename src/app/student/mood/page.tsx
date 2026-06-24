import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, formatDate } from "@/lib/dates";
import { SCALE_LABELS } from "@/lib/constants";
import { PageHeader } from "@/components/AppShell";
import { Card, CardTitle, EmptyState } from "@/components/ui";
import { ScoreDots } from "@/components/StatCard";
import { MoodForm } from "@/components/MoodForm";

export default async function MoodPage() {
  const user = await requireUser("student");
  const today = startOfDay();

  const [todayMood, recent] = await Promise.all([
    prisma.moodLog.findUnique({
      where: { studentUserId_logDate: { studentUserId: user.id, logDate: today } },
    }),
    prisma.moodLog.findMany({
      where: { studentUserId: user.id },
      orderBy: { logDate: "desc" },
      take: 10,
    }),
  ]);

  return (
    <>
      <PageHeader title="Mood log" subtitle="A quick daily check-in on how you're doing." />

      <div className="grid gap-4 lg:grid-cols-2">
        <MoodForm initial={todayMood} />

        <Card>
          <CardTitle>Recent check-ins</CardTitle>
          {recent.length === 0 ? (
            <EmptyState>No check-ins yet. Your history will appear here.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{formatDate(m.logDate)}</span>
                    <span className="text-xs text-slate-400">{SCALE_LABELS[m.mood]}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      Mood <ScoreDots value={m.mood} />
                    </span>
                    <span className="flex items-center gap-2">
                      Stress <ScoreDots value={m.stress} tone="rose" />
                    </span>
                    <span className="flex items-center gap-2">
                      Sleep <ScoreDots value={m.sleep} tone="emerald" />
                    </span>
                  </div>
                  {m.note && <p className="mt-2 text-sm text-slate-600">“{m.note}”</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
