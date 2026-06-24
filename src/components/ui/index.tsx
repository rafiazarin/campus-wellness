import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ----------------------------- Button ----------------------------- */
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  full?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-300",
  secondary: "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus:ring-slate-200",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-300",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
};

export function Button({ variant = "primary", full, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
        "transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        full && "w-full",
        className,
      )}
      {...props}
    />
  );
}

/* --------------------------- Link button -------------------------- */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

/* ------------------------------ Card ------------------------------ */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("card", className)}>{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-1 text-base font-semibold text-slate-900">{children}</h3>;
}

export function CardSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm text-slate-500">{children}</p>;
}

/* ----------------------------- Inputs ----------------------------- */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn("input", className)} {...props} />;
  },
);

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("input", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("input", className)} {...props} />;
}

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("label", className)} {...props}>
      {children}
    </label>
  );
}

/* ----------------------------- Badge ------------------------------ */
const badgeTones: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-700",
  completed: "bg-slate-200 text-slate-700",
  cancelled: "bg-slate-200 text-slate-500",
  neutral: "bg-slate-100 text-slate-700",
  brand: "bg-brand-100 text-brand-700",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={cn("pill", badgeTones[tone] ?? badgeTones.neutral)}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={status.toLowerCase()}>{status}</Badge>;
}

/* --------------------------- Empty state -------------------------- */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}
