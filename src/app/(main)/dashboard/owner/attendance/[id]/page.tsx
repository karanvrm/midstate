import { authOptions } from "@/auth";
import AttendanceSheetClient from "@/components/dashboard/attendance-sheet-client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: { id: string };
}

const OwnerAttendanceSheetPage = async ({ params }: PageProps) => {
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

  const sheetId = params.id;
  
  let sheet = null;
  let records = [];
  let loadError: string | undefined;

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  try {
    sheet = await prisma.attendanceSheet.findUnique({
      where: { id: sheetId },
    });

    if (!sheet) {
      redirect("/dashboard/owner/attendance");
    }

    // Sync active staff members
    const activeStaff = await prisma.user.findMany({
      where: { status: "ACTIVE", role: "STAFF" },
      select: { id: true },
    });

    const existingUserIds = await prisma.attendanceRecord.groupBy({
      by: ["userId"],
      where: { sheetId },
    });

    const existingUserIdsSet = new Set(existingUserIds.map((r) => r.userId));
    const missingStaffIds = activeStaff.map((s) => s.id).filter((id) => !existingUserIdsSet.has(id));

    if (missingStaffIds.length > 0) {
      const [monthStr, yearStr] = sheet.name.split(" ");
      const monthIndex = MONTHS.indexOf(monthStr);
      const year = parseInt(yearStr, 10);
      
      if (monthIndex !== -1 && !isNaN(year)) {
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const newRecordsData = [];

        for (const userId of missingStaffIds) {
          for (let day = 1; day <= daysInMonth; day++) {
            newRecordsData.push({
              sheetId: sheet.id,
              userId,
              day,
              status: "-",
            });
          }
        }

        if (newRecordsData.length > 0) {
          await prisma.attendanceRecord.createMany({
            data: newRecordsData,
          });
        }
      }
    }

    const dbRecords = await prisma.attendanceRecord.findMany({
      where: { sheetId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { user: { name: "asc" } },
        { day: "asc" },
      ],
    });

    records = dbRecords.map(record => ({
      ...record,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }));

  } catch (error) {
    console.error("Unable to load attendance sheet details.", error);
    loadError =
      "Unable to connect to the database to load sheet data. Check the Supabase database status or network access, then refresh.";
  }

  return (
    <AttendanceSheetClient
      sheet={sheet}
      records={records}
      loadError={loadError}
    />
  );
};

export default OwnerAttendanceSheetPage;
