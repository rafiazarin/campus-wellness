import { redirect } from "next/navigation";
import { getCurrentUser, dashboardPath } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  redirect(user ? dashboardPath(user.role) : "/login");
}
