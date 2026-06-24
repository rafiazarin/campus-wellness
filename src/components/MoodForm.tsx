"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardTitle, Label, Textarea } from "@/components/ui";
import { logMood } from "@/lib/actions/mood";
import { SCALE_LABELS, STRESS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function ScalePicker({
  value,
  onChange,
  labels,
  activeClass,
}: {
  value: number;
  onChange: (n: number) => void;
  labels: Record<number, string>;
  activeClass: string;
}) {
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "h-10 flex-1 rounded-lg border text-sm font-semibold transition",
              value === n
                ? activeClass
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{labels[value]}</p>
    </div>
  );
}

export function MoodForm({
  initial,
}: {
  initial?: { mood: number; stress: number; sleep: number; note: string | null } | null;
}) {
  const router = useRouter();
  const [mood, setMood] = useState(initial?.mood ?? 3);
  const [stress, setStress] = useState(initial?.stress ?? 3);
  const [sleep, setSleep] = useState(initial?.sleep ?? 3);
  const [note, setNote] = useState(initial?.note ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    setSaved(false);
    startTransition(async () => {
      await logMood({ mood, stress, sleep, note });
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardTitle>{initial ? "Update today's check-in" : "How are you today?"}</CardTitle>
      <div className="mt-4 space-y-5">
        <div>
          <Label>Mood</Label>
          <ScalePicker
            value={mood}
            onChange={setMood}
            labels={SCALE_LABELS}
            activeClass="border-brand-500 bg-brand-50 text-brand-700"
          />
        </div>
        <div>
          <Label>Stress</Label>
          <ScalePicker
            value={stress}
            onChange={setStress}
            labels={STRESS_LABELS}
            activeClass="border-rose-400 bg-rose-50 text-rose-700"
          />
        </div>
        <div>
          <Label>Sleep quality</Label>
          <ScalePicker
            value={sleep}
            onChange={setSleep}
            labels={SCALE_LABELS}
            activeClass="border-emerald-500 bg-emerald-50 text-emerald-700"
          />
        </div>
        <div>
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything you want to remember about today?"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : initial ? "Update check-in" : "Save check-in"}
          </Button>
          {saved && !pending && <span className="text-sm text-emerald-600">Saved ✓</span>}
        </div>
      </div>
    </Card>
  );
}
