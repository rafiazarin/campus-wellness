import { Sidebar, MobileBar } from "./Sidebar";
import type { NavItem } from "@/lib/constants";

export function AppShell({
  nav,
  userName,
  roleLabel,
  children,
}: {
  nav: NavItem[];
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar nav={nav} userName={userName} roleLabel={roleLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileBar nav={nav} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
