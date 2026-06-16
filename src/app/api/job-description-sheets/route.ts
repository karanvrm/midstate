import { authOptions } from "@/auth";
import {
  createEmptyJobDescriptionTable,
  normalizeJobDescriptionTable,
} from "@/lib/job-description-sheet-table";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSheetSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
  typeOfRoles: z.string().trim().min(1, "Type of roles is required."),
});

const canViewSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN" || role === "STAFF");

const canManageSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

const serializeSheetSummary = (sheet: {
  id: string;
  companyName: string;
  typeOfRoles: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: sheet.id,
  companyName: sheet.companyName,
  typeOfRoles: sheet.typeOfRoles,
  createdAt: sheet.createdAt.toISOString(),
  updatedAt: sheet.updatedAt.toISOString(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!canViewSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Active dashboard access required." }, { status: 403 });
  }

  try {
    const sheets = await prisma.jobDescriptionSheet.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        companyName: true,
        typeOfRoles: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      sheets: sheets.map(serializeSheetSummary),
    });
  } catch (error) {
    console.error("Unable to load job description sheets.", error);
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
    const sheet = await prisma.jobDescriptionSheet.create({
      data: {
        companyName: parsed.data.companyName,
        typeOfRoles: parsed.data.typeOfRoles,
        tableData: createEmptyJobDescriptionTable(),
        rowColors: null,
        columnWidths: null,
      } as any,
    });

    return NextResponse.json(
      {
        sheet: {
          ...serializeSheetSummary(sheet),
          tableData: normalizeJobDescriptionTable(sheet.tableData),
          rowColors: (sheet as any).rowColors,
          columnWidths: (sheet as any).columnWidths,
        },
        message: "Sheet created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A sheet with this company name already exists." },
        { status: 409 },
      );
    }

    console.error("Unable to create job description sheet.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}
