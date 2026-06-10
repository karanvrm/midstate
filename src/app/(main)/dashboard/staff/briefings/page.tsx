import { authOptions } from "@/auth";
import BriefingsClient from "@/components/dashboard/briefings-client";
import { getBriefings } from "@/lib/briefings/queries";
import type { Briefing } from "@/types/briefing";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface StaffBriefingsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const StaffBriefingsPage = async ({ searchParams }: StaffBriefingsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const isOwner = session.user.role === "OWNER";
  const isAdmin = session.user.role === "ADMIN";
  const isStaff = session.user.role === "STAFF";
  const isExplicitlyAllowed = searchParams.allowOwner === "true";

  if (session.user.status !== "ACTIVE" || (!isStaff && !((isOwner || isAdmin) && isExplicitlyAllowed))) {
    redirect("/dashboard");
  }

  let briefings: Briefing[] = [];
  let loadError: string | undefined;

  try {
    briefings = await getBriefings();
  } catch (error) {
    console.error("Unable to load briefings.", error);
    loadError =
      "The page loaded, but briefings could not connect to the database. Check the database status, connection string, or network access, then refresh.";
  }

  return <BriefingsClient briefings={briefings} canManage={false} loadError={loadError} />;
};

export default StaffBriefingsPage;
