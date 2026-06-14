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

  type AttendanceRecordWithUser = {
    id: string;
    sheetId: string;
    userId: string;
    day: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };

  let sheet = null;
  let records: AttendanceRecordWithUser[] = [];
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

    // Sync active staff members — only add to sheets for their activation month or later
    const [monthStr, yearStr] = sheet.name.split(" ");
    const monthIndex = MONTHS.indexOf(monthStr);
    const year = parseInt(yearStr, 10);

    if (monthIndex !== -1 && !isNaN(year)) {
      const activeStaff = await prisma.user.findMany({
        where: { status: "ACTIVE", role: "STAFF" },
        select: { id: true, activatedAt: true },
      });

      const existingUserIds = await prisma.attendanceRecord.groupBy({
        by: ["userId"],
        where: { sheetId },
      });

      const existingUserIdsSet = new Set(existingUserIds.map((r) => r.userId));

      // Filter to staff who are missing from this sheet AND were activated
      // in the sheet's month or earlier (not after the sheet's month)
      const missingStaffIds = activeStaff
        .filter((s) => {
          if (existingUserIdsSet.has(s.id)) return false;

          // If no activatedAt (legacy users), include them in all sheets
          if (!s.activatedAt) return true;

          const activatedYear = s.activatedAt.getFullYear();
          const activatedMonth = s.activatedAt.getMonth(); // 0-indexed

          // Include if the sheet's month/year is >= the activation month/year
          if (year > activatedYear) return true;
          if (year === activatedYear && monthIndex >= activatedMonth) return true;

          return false;
        })
        .map((s) => s.id);

      if (missingStaffIds.length > 0) {
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
