import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Staff can only update candidates assigned to them
    if (
      session.user.role === 'STAFF' &&
      candidate.assigned_to !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.candidate.update({
      where: { id: params.id },
      data: {
        ...(body.status && { status: (body.status as string).toUpperCase() }),
        ...(body.remarks !== undefined && { remarks: body.remarks as string }),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      candidate: updated,
      message: "Candidate updated successfully",
    });
  } catch (error) {
    console.error("Failed to update candidate:", error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 503 });
  }
}
