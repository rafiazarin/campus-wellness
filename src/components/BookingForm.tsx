"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardTitle, Input, Label, Select, Textarea } from "@/components/ui";
import { bookAppointment } from "@/lib/actions/appointments";
import { APPOINTMENT_TYPES } from "@/lib/constants";

type Pro = { userId: number; name: string; specialization: string | null };

export function BookingForm({ professionals }: { professionals: Pro[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    professionalUserId: "",
    type: APPOINTMENT_TYPES[0] as string,
    date: "",
    time: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    setError("");
    startTransition(async () => {
      const res = await bookAppointment({
        professionalUserId: Number(form.professionalUserId),
        type: form.type,
        date: form.date,
        time: form.time,
        reason: form.reason,
      });
      if (!res.ok) {
        setError(res.error ?? "Could not book appointment.");
        return;
      }
      setForm({ professionalUserId: "", type: APPOINTMENT_TYPES[0], date: "", time: "", reason: "" });
      setOpen(false);
      router.refresh();
    });
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ New appointment</Button>;
  }

  return (
    <Card>
      <CardTitle>Book an appointment</CardTitle>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="pro">Professional</Label>
          <Select
            id="pro"
            value={form.professionalUserId}
            onChange={(e) => update("professionalUserId", e.target.value)}
          >
            <option value="">Select a professional…</option>
            {professionals.map((p) => (
              <option key={p.userId} value={p.userId}>
                {p.name}
                {p.specialization ? ` — ${p.specialization}` : ""}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" value={form.type} onChange={(e) => update("type", e.target.value)}>
            {APPOINTMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="reason">Reason (optional)</Label>
          <Textarea
            id="reason"
            rows={2}
            value={form.reason}
            onChange={(e) => update("reason", e.target.value)}
            placeholder="Briefly describe what you'd like to discuss…"
          />
        </div>
      </div>

      {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="mt-4 flex gap-2">
        <Button onClick={submit} disabled={pending}>
          {pending ? "Booking…" : "Confirm booking"}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}
