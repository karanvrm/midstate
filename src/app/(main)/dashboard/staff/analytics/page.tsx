import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { computeDateRange, getStaffAnalytics } from "@/lib/analytics";
import { AnalyticsStaffWrapper } from "@/components/dashboard/analytics-staff-wrapper";

export default async function StaffAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (session.user.status !== "ACTIVE") {
    redirect("/dashboard");
  }

  const analyticsData = await getStaffAnalytics(session.user.id, computeDateRange("today"));

  return <AnalyticsStaffWrapper initialData={analyticsData} />;
}
