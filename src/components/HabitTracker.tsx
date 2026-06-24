"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardTitle, Input } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { toggleHabit, addHabit } from "@/lib/actions/habits";
import { cn } from "@/lib/utils";

type Habit = { id: number; name: string; icon: string | null };

export function HabitTracker({
  habits,
  completedIds,
}: {
  habits: Habit[];
  completedIds: number[];
}) {
  const router = useRouter();
  const [done, setDone] = useState<Set<number>>(new Set(completedIds));
  const [newHabit, setNewHabit] = useState("");
  const [pending, startTransition] = useTransition();

  function toggle(id: number) {
    const next = new Set(done);
    const willComplete = !next.has(id);
    if (willComplete) next.add(id);
    else next.delete(id);
    setDone(next); // optimistic
    startTransition(async () => {
      await toggleHabit(id, willComplete);
      router.refresh();
    });
  }

  function add() {
    const name = newHabit.trim();
    if (!name) return;
    setNewHabit("");
    startTransition(async () => {
      await addHabit(name);
      router.refresh();
    });
  }

  const completedCount = done.size;
  const pct = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Today&apos;s habits</CardTitle>
          <span className="text-sm font-medium text-slate-500">
            {completedCount}/{habits.length} done
          </span>
        </div>

        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ul className="space-y-2">
          {habits.map((h) => {
            const isDone = done.has(h.id);
            return (
              <li key={h.id}>
                <button
                  onClick={() => toggle(h.id)}
                  disabled={pending}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition disabled:opacity-70",
                    isDone
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-lg",
                      isDone ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <Icon name={h.icon ?? "ListChecks"} size={18} />
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-sm font-medium",
                      isDone ? "text-emerald-800" : "text-slate-700",
                    )}
                  >
                    {h.name}
                  </span>
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full border text-xs",
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 text-transparent",
                    )}
                  >
                    ✓
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <CardTitle>Add a habit</CardTitle>
        <p className="mb-3 text-sm text-slate-500">Track something new that matters to you.</p>
        <div className="space-y-3">
          <Input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="e.g. Read 20 minutes"
          />
          <Button onClick={add} disabled={pending || !newHabit.trim()} full>
            Add habit
          </Button>
        </div>
      </Card>
    </div>
  );
}
