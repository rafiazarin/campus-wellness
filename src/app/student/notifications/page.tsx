import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/AppShell";
import { Card, EmptyState } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { MarkAllReadButton } from "@/components/MarkAllReadButton";
import { cn } from "@/lib/utils";

export default async function NotificationsPage() {
  const user = await requireUser("student");

  const notifications = await prisma.notification.findMany({
    where: { studentUserId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Reminders and updates based on your activity."
        action={<MarkAllReadButton disabled={!hasUnread} />}
      />

      {notifications.length === 0 ? (
        <EmptyState>No notifications yet.</EmptyState>
      ) : (
        <Card>
          <ul className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-3">
                <span
                  className={cn(
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    n.read ? "bg-slate-100 text-slate-400" : "bg-brand-50 text-brand-600",
                  )}
                >
                  <Icon name="Bell" size={16} />
                </span>
                <div className="flex-1">
                  <p className={cn("text-sm", n.read ? "text-slate-500" : "font-medium text-slate-800")}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(n.createdAt)}</p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
