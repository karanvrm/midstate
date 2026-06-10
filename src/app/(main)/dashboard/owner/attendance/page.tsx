import { authOptions } from "@/auth";
import AttendancesClient from "@/components/dashboard/attendances-client";
import { prisma } from "@/lib/prisma";
import type { AttendanceSheet } from "@/types/attendance-sheet";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const OwnerAttendancePage = async () => {
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

  let sheets: AttendanceSheet[] = [];
  let loadError: string | undefined;

  try {
    const dbSheets = await prisma.attendanceSheet.findMany({
      orderBy: { createdAt: "desc" },
    });

    sheets = dbSheets.map((sheet) => ({
      ...sheet,
      createdAt: sheet.createdAt.toISOString(),
      updatedAt: sheet.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Unable to load attendance sheets.", error);
    loadError =
      "The page loaded, but the sheet directory could not connect to the database. Check the Supabase database status, connection string, or network access, then refresh.";
  }

  return (
    <AttendancesClient
      canManage
      loadError={loadError}
      sheets={sheets}
    />
  );
};

export default OwnerAttendancePage;
