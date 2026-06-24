import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { NAV } from "@/lib/constants";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("admin");
  return (
    <AppShell nav={NAV.admin} userName={user.name} roleLabel="Administrator">
      {children}
    </AppShell>
  );
}
