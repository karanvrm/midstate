import { authOptions } from "@/auth";
import JobDescriptionSheetClient from "@/components/dashboard/job-description-sheet-client";
import { normalizeJobDescriptionTable } from "@/lib/job-description-sheet-table";
import { prisma } from "@/lib/prisma";
import type { JobDescriptionSheet } from "@/types/job-description-sheet";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: { sheetId: string };
}

const OwnerJobDescriptionSheetPage = async ({ params }: PageProps) => {
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

  let sheet: JobDescriptionSheet | null = null;
  let loadError: string | undefined;

  try {
    const dbSheet = await prisma.jobDescriptionSheet.findUnique({
      where: { id: params.sheetId },
    });

    if (!dbSheet) {
      redirect("/dashboard/owner/job-descriptions");
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
      backHref="/dashboard/owner/job-descriptions"
      canManage
      loadError={loadError}
      sheet={sheet}
    />
  );
};

export default OwnerJobDescriptionSheetPage;
