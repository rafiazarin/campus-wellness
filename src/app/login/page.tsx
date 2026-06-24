import { redirect } from "next/navigation";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(dashboardPath(user.role));

  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
