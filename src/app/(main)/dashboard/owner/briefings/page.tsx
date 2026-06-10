import { authOptions } from "@/auth";
import BriefingsClient from "@/components/dashboard/briefings-client";
import { getBriefings } from "@/lib/briefings/queries";
import type { Briefing } from "@/types/briefing";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const OwnerBriefingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const canManage =
    session.user.status === "ACTIVE" &&
    (session.user.role === "OWNER" || session.user.role === "ADMIN");

  if (!canManage) {
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

  return <BriefingsClient briefings={briefings} canManage={canManage} loadError={loadError} />;
};

export default OwnerBriefingsPage;
