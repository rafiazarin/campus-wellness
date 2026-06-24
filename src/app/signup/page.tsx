import { redirect } from "next/navigation";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/SignupForm";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect(dashboardPath(user.role));

  return (
    <AuthShell>
      <SignupForm />
    </AuthShell>
  );
}
