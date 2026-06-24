import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { NAV } from "@/lib/constants";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("student");
  return (
    <AppShell nav={NAV.student} userName={user.name} roleLabel="Student">
      {children}
    </AppShell>
  );
}
