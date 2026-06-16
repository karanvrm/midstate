import { authOptions } from "@/auth";
import { normalizeJobDescriptionTable } from "@/lib/job-description-sheet-table";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    sheetId: string;
  };
}

const canViewSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN" || role === "STAFF");

const canManageSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!canViewSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Active dashboard access required." }, { status: 403 });
  }

  try {
    const sheet = await prisma.jobDescriptionSheet.findUnique({
      where: { id: params.sheetId },
    });

    if (!sheet) {
      return NextResponse.json({ error: "Sheet not found." }, { status: 404 });
    }

    return NextResponse.json({
      sheet: {
        id: sheet.id,
        companyName: sheet.companyName,
        typeOfRoles: sheet.typeOfRoles,
        tableData: normalizeJobDescriptionTable(sheet.tableData),
        rowColors: (sheet as any).rowColors,
        columnWidths: (sheet as any).columnWidths,
        createdAt: sheet.createdAt.toISOString(),
        updatedAt: sheet.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Unable to load job description sheet.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!canManageSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload !== "object" ||
    !("tableData" in payload)
  ) {
    return NextResponse.json({ error: "Table data is required." }, { status: 400 });
  }

  const tableData = normalizeJobDescriptionTable(payload.tableData);
  const rowColors = payload.rowColors;
  const columnWidths = payload.columnWidths;

  try {
    const sheet = await prisma.jobDescriptionSheet.findUnique({
      where: { id: params.sheetId },
      select: { id: true },
    });

    if (!sheet) {
      return NextResponse.json({ error: "Sheet not found." }, { status: 404 });
    }

    const updatedSheet = await prisma.jobDescriptionSheet.update({
      where: { id: params.sheetId },
      data: {
        tableData,
        rowColors: rowColors ?? null,
        columnWidths: columnWidths ?? null,
      } as any,
    });

    return NextResponse.json({
      sheet: {
        id: updatedSheet.id,
        companyName: updatedSheet.companyName,
        typeOfRoles: updatedSheet.typeOfRoles,
        tableData: normalizeJobDescriptionTable(updatedSheet.tableData),
        rowColors: (updatedSheet as any).rowColors,
        columnWidths: (updatedSheet as any).columnWidths,
        createdAt: updatedSheet.createdAt.toISOString(),
        updatedAt: updatedSheet.updatedAt.toISOString(),
      },
      message: "Sheet saved successfully.",
    });
  } catch (error) {
    console.error("Unable to save job description sheet.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!canManageSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const sheet = await prisma.jobDescriptionSheet.findUnique({
      where: { id: params.sheetId },
      select: { id: true },
    });

    if (!sheet) {
      return NextResponse.json({ error: "Sheet not found." }, { status: 404 });
    }

    await prisma.jobDescriptionSheet.delete({
      where: { id: params.sheetId },
    });

    return NextResponse.json({ message: "Sheet deleted successfully." });
  } catch (error) {
    console.error("Unable to delete job description sheet.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}
