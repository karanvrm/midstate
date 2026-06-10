import { authOptions } from "@/auth";
import { TasksAdminClient } from "@/components/dashboard/tasks-admin-client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function OwnerTasksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.status !== "ACTIVE") {
    redirect("/auth/sign-in");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    redirect("/dashboard/staff");
  }

  return (
    <div className="space-y-6">
      <TasksAdminClient />
    </div>
  );
}
