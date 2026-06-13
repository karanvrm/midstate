import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSheetSchema = z.object({
  name: z.string().trim().min(1, "Sheet name is required."),
  url: z.string().trim().url("Enter a valid Google Sheet URL.").optional().or(z.literal('')),
});

const canViewSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN" || role === "STAFF");

const canManageSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!canViewSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Active dashboard access required." }, { status: 403 });
  }

  try {
    const sheets = await prisma.attendanceSheet.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      sheets: sheets.map((sheet) => ({
        ...sheet,
        createdAt: sheet.createdAt.toISOString(),
        updatedAt: sheet.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Unable to load attendance sheets.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!canManageSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = createSheetSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid sheet details." },
      { status: 400 },
    );
  }

  try {
    const existingSheet = await prisma.attendanceSheet.findUnique({
      where: { name: parsed.data.name }
    });

    if (existingSheet) {
      return NextResponse.json({ error: "An attendance sheet for this month already exists." }, { status: 400 });
    }

    const [monthStr, yearStr] = parsed.data.name.split(" ");
    const monthIndex = MONTHS.indexOf(monthStr);
    const year = parseInt(yearStr, 10);

    if (monthIndex === -1 || isNaN(year)) {
      return NextResponse.json({ error: "Invalid sheet name format. Must be 'Month Year'." }, { status: 400 });
    }

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const staffMembers = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
        role: "STAFF",
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      const sheet = await tx.attendanceSheet.create({
        data: {
          name: parsed.data.name,
          url: parsed.data.url || null,
        },
      });

      const recordsData = [];
      for (const staff of staffMembers) {
        for (let day = 1; day <= daysInMonth; day++) {
          recordsData.push({
            sheetId: sheet.id,
            userId: staff.id,
            day,
            status: "-",
          });
        }
      }

      if (recordsData.length > 0) {
        await tx.attendanceRecord.createMany({
          data: recordsData,
        });
      }

      return sheet;
    });

    return NextResponse.json(
      {
        sheet: {
          ...result,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        },
        message: "Sheet saved successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to create attendance sheet.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}
