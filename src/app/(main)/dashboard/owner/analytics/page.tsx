import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { computeDateRange, getOwnerAnalytics } from "@/lib/analytics";
import { AnalyticsOwnerWrapper } from "@/components/dashboard/analytics-owner-wrapper";

export default async function OwnerAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (
    (session.user.role !== "OWNER" && session.user.role !== "ADMIN") ||
    session.user.status !== "ACTIVE"
  ) {
    redirect("/dashboard");
  }

  const analyticsData = await getOwnerAnalytics(computeDateRange("today"));

  return <AnalyticsOwnerWrapper initialData={analyticsData} />;
}
