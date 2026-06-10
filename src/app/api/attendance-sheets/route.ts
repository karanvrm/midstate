import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSheetSchema = z.object({
  name: z.string().trim().min(1, "Sheet name is required."),
  url: z.string().trim().url("Enter a valid Google Sheet URL."),
});

const canViewSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN" || role === "STAFF");

const canManageSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

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
    const sheet = await prisma.attendanceSheet.create({
      data: parsed.data,
    });

    return NextResponse.json(
      {
        sheet: {
          ...sheet,
          createdAt: sheet.createdAt.toISOString(),
          updatedAt: sheet.updatedAt.toISOString(),
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
