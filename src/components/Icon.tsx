import {
  LayoutDashboard,
  SmilePlus,
  ListChecks,
  CalendarDays,
  BookOpen,
  LineChart,
  Bell,
  ClipboardList,
  LogOut,
  HeartPulse,
  Droplets,
  Dumbbell,
  Brain,
  Moon,
  NotebookPen,
  Users,
  Stethoscope,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  SmilePlus,
  ListChecks,
  CalendarDays,
  BookOpen,
  LineChart,
  Bell,
  ClipboardList,
  LogOut,
  HeartPulse,
  Droplets,
  Dumbbell,
  Brain,
  Moon,
  NotebookPen,
  Users,
  Stethoscope,
  CalendarCheck,
};

export function Icon({
  name,
  className,
  size = 18,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = MAP[name] ?? LayoutDashboard;
  return <Cmp className={className} size={size} />;
}
