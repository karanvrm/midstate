import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateRecordSchema = z.object({
  recordId: z.string().trim().min(1, "Record ID is required."),
  status: z.enum(["-", "P", "A", "HD", "H"], {
    errorMap: () => ({ message: "Invalid attendance status." }),
  }),
});

const canManageSheets = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

export async function PATCH(
  request: Request,
  { params }: { params: { sheetId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!canManageSheets(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateRecordSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid record details." },
      { status: 400 },
    );
  }

  try {
    // Verify the record belongs to the given sheet
    const record = await prisma.attendanceRecord.findUnique({
      where: { id: parsed.data.recordId },
    });

    if (!record || record.sheetId !== params.sheetId) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    const updatedRecord = await prisma.attendanceRecord.update({
      where: { id: parsed.data.recordId },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(
      {
        record: {
          ...updatedRecord,
          createdAt: updatedRecord.createdAt.toISOString(),
          updatedAt: updatedRecord.updatedAt.toISOString(),
        },
        message: "Attendance updated.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unable to update attendance record.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}
