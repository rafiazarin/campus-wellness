import type { Role } from "./auth";

export type NavItem = { href: string; label: string; icon: string };

export const NAV: Record<Role, NavItem[]> = {
  student: [
    { href: "/student/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/student/mood", label: "Mood Log", icon: "SmilePlus" },
    { href: "/student/habits", label: "Habits", icon: "ListChecks" },
    { href: "/student/appointments", label: "Appointments", icon: "CalendarDays" },
    { href: "/student/resources", label: "Resources", icon: "BookOpen" },
    { href: "/student/analytics", label: "Analytics", icon: "LineChart" },
    { href: "/student/notifications", label: "Notifications", icon: "Bell" },
  ],
  professional: [
    { href: "/professional/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/professional/appointments", label: "Requests", icon: "ClipboardList" },
  ],
  admin: [{ href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" }],
};

export const SCALE_LABELS: Record<number, string> = {
  1: "Very low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export const STRESS_LABELS: Record<number, string> = {
  1: "Very calm",
  2: "Calm",
  3: "Moderate",
  4: "Stressed",
  5: "Overwhelmed",
};

export const APPOINTMENT_TYPES = ["Counseling", "Medical", "Nutrition"] as const;

export const APPOINTMENT_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
  "Cancelled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

// Tiny rule-based suggestion engine driven by the latest mood entry.
export function wellnessTip(mood?: number, stress?: number, sleep?: number): string {
  if (mood == null) return "Log today's mood to get a personalised suggestion.";
  if (sleep != null && sleep <= 2)
    return "Your sleep has been low. Try winding down 30 minutes earlier tonight — no screens.";
  if (stress != null && stress >= 4)
    return "Stress is running high. A 5-minute breathing break or a short walk can help reset.";
  if (mood <= 2)
    return "Rough day? Reaching out to a friend or booking a counseling session can make a difference.";
  if (mood >= 4) return "You're doing great — keep up whatever's working for you this week!";
  return "Steady week. Consider one small habit, like a 10-minute walk, to lift your baseline.";
}
