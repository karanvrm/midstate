import { authOptions } from "@/auth";
import JobDescriptionsClient from "@/components/dashboard/job-descriptions-client";
import { prisma } from "@/lib/prisma";
import type { JobDescriptionSheetSummary } from "@/types/job-description-sheet";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface StaffJobDescriptionsPageProps {
  searchParams: { allowOwner?: string };
}

const StaffJobDescriptionsPage = async ({ searchParams }: StaffJobDescriptionsPageProps) => {
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

  const sheetBasePath = "/dashboard/staff/job-descriptions";
  const sheetOpenQuery = isStaff ? "" : "?allowOwner=true";

  let sheets: JobDescriptionSheetSummary[] = [];
  let loadError: string | undefined;

  try {
    const dbSheets = await prisma.jobDescriptionSheet.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        companyName: true,
        typeOfRoles: true,
        createdAt: true,
        updatedAt: true,
      },
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
      canManage={false}
      loadError={loadError}
      sheetBasePath={sheetBasePath}
      sheetOpenQuery={sheetOpenQuery}
      sheets={sheets}
    />
  );
};

export default StaffJobDescriptionsPage;
