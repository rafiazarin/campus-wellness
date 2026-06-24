"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { setAppointmentStatus } from "@/lib/actions/appointments";

export function AppointmentActions({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function act(status: "Approved" | "Rejected") {
    startTransition(async () => {
      await setAppointmentStatus(id, status);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => act("Approved")} disabled={pending}>
        Approve
      </Button>
      <Button variant="danger" onClick={() => act("Rejected")} disabled={pending}>
        Reject
      </Button>
    </div>
  );
}
