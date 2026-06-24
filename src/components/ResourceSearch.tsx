"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui";

export function ResourceSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    const id = setTimeout(() => {
      const next = q.trim() ? `/student/resources?q=${encodeURIComponent(q.trim())}` : "/student/resources";
      router.replace(next);
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <Input
      type="search"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Search resources (e.g. sleep, stress, nutrition)…"
    />
  );
}
