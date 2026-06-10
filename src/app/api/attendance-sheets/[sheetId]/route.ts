import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

interface RouteContext {
  params: {
    sheetId: string;
  };
}

const updateSheetSchema = z.object({
  url: z.string().trim().url("Enter a valid Google Sheet URL."),
});

const canManageSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!canManageSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateSheetSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid sheet details." },
      { status: 400 },
    );
  }

  try {
    const sheet = await prisma.attendanceSheet.findUnique({
      where: { id: params.sheetId },
      select: { id: true },
    });

    if (!sheet) {
      return NextResponse.json({ error: "Sheet not found." }, { status: 404 });
    }

    await prisma.attendanceSheet.update({
      where: { id: params.sheetId },
      data: { url: parsed.data.url },
    });

    return NextResponse.json({ message: "Sheet link updated successfully." });
  } catch (error) {
    console.error("Unable to update attendance sheet.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}
