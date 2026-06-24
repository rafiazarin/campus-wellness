"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { LogoutButton } from "./LogoutButton";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/constants";

export function Sidebar({
  nav,
  userName,
  roleLabel,
}: {
  nav: NavItem[];
  userName: string;
  roleLabel: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
          <Icon name="HeartPulse" size={20} />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-900">Campus Wellness</p>
          <p className="text-xs text-slate-400">{roleLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <p className="px-3 pb-1 text-xs text-slate-400">Signed in as</p>
        <p className="truncate px-3 pb-2 text-sm font-medium text-slate-700">{userName}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}

// Compact top bar shown on mobile (links wrap, logout on the right).
export function MobileBar({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 md:hidden">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
              active ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-100",
            )}
          >
            <Icon name={item.icon} size={15} />
            {item.label}
          </Link>
        );
      })}
      <div className="ml-auto shrink-0">
        <LogoutButton compact />
      </div>
    </div>
  );
}
