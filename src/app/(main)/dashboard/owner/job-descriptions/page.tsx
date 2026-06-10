import { authOptions } from "@/auth";
import JobDescriptionsClient from "@/components/dashboard/job-descriptions-client";
import { prisma } from "@/lib/prisma";
import type { JobDescriptionSheet } from "@/types/job-description-sheet";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const OwnerJobDescriptionsPage = async () => {
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

  let sheets: JobDescriptionSheet[] = [];
  let loadError: string | undefined;

  try {
    const dbSheets = await prisma.jobDescriptionSheet.findMany({
      orderBy: { createdAt: "desc" },
    });

    sheets = dbSheets.map((sheet) => ({
      ...sheet,
      createdAt: sheet.createdAt.toISOString(),
      updatedAt: sheet.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Unable to load job description sheets.", error);
    loadError =
      "The page loaded, but the sheet directory could not connect to the database. Check the Supabase database status, connection string, or network access, then refresh.";
  }

  return (
    <JobDescriptionsClient
      canManage
      loadError={loadError}
      sheets={sheets}
    />
  );
};

export default OwnerJobDescriptionsPage;
