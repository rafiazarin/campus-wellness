"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");
      router.replace(data.redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  function fillDemo(kind: "student" | "professional" | "admin") {
    const map = {
      student: "sarah@std.edu",
      professional: "dr.rahman@wellness.edu",
      admin: "admin@campus.edu",
    };
    setEmail(map[kind]);
    setPassword("demo123");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to your Campus Wellness account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@std.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        <Button type="submit" full disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-medium text-slate-500">Quick demo logins (password: demo123)</p>
        <div className="flex flex-wrap gap-2">
          {(["student", "professional", "admin"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => fillDemo(k)}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 hover:bg-slate-50"
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
