import { authOptions } from "@/auth";
import JobDescriptionSheetClient from "@/components/dashboard/job-description-sheet-client";
import { normalizeJobDescriptionTable } from "@/lib/job-description-sheet-table";
import { prisma } from "@/lib/prisma";
import type { JobDescriptionSheet } from "@/types/job-description-sheet";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface StaffJobDescriptionSheetPageProps {
  params: { sheetId: string };
  searchParams: { allowOwner?: string };
}

const StaffJobDescriptionSheetPage = async ({
  params,
  searchParams,
}: StaffJobDescriptionSheetPageProps) => {
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

  const backHref = isStaff
    ? "/dashboard/staff/job-descriptions"
    : "/dashboard/staff/job-descriptions?allowOwner=true";

  const canManage = isOwner || isAdmin;

  let sheet: JobDescriptionSheet | null = null;
  let loadError: string | undefined;

  try {
    const dbSheet = await prisma.jobDescriptionSheet.findUnique({
      where: { id: params.sheetId },
    });

    if (!dbSheet) {
      redirect(backHref);
    }

    sheet = {
      id: dbSheet.id,
      companyName: dbSheet.companyName,
      typeOfRoles: dbSheet.typeOfRoles,
      tableData: normalizeJobDescriptionTable(dbSheet.tableData),
      rowColors: (dbSheet as any).rowColors,
      columnWidths: (dbSheet as any).columnWidths,
      createdAt: dbSheet.createdAt.toISOString(),
      updatedAt: dbSheet.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Unable to load job description sheet.", error);
    loadError =
      "Unable to connect to the database to load sheet data. Check the Supabase database status or network access, then refresh.";
  }

  return (
    <JobDescriptionSheetClient
      backHref={backHref}
      canManage={canManage}
      loadError={loadError}
      sheet={sheet}
    />
  );
};

export default StaffJobDescriptionSheetPage;
