import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = "brand",
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "brand" | "emerald" | "amber" | "slate";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="card flex items-center gap-4">
      <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon name={icon} size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

// Small inline 1–5 dots used to render a recorded mood/stress/sleep score.
export function ScoreDots({ value, tone = "brand" }: { value: number; tone?: string }) {
  const tones: Record<string, string> = {
    brand: "bg-brand-500",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
  };
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i <= value ? tones[tone] ?? tones.brand : "bg-slate-200",
          )}
        />
      ))}
    </span>
  );
}
