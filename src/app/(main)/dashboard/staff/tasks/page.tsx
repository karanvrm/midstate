import { authOptions } from "@/auth";
import { TasksStaffClient } from "@/components/dashboard/tasks-staff-client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function StaffTasksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.status !== "ACTIVE") {
    redirect("/auth/sign-in");
  }

  if (session.user.role !== "STAFF") {
    redirect("/dashboard/owner");
  }

  return (
    <div className="space-y-6">
      <TasksStaffClient />
    </div>
  );
}
