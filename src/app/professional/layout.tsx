import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { NAV } from "@/lib/constants";

export default async function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("professional");
  return (
    <AppShell nav={NAV.professional} userName={user.name} roleLabel="Professional">
      {children}
    </AppShell>
  );
}
