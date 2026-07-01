import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { CandidateStatus } from "@/types/tasks";

function toStatus(raw: string): CandidateStatus {
  return (raw ?? 'PENDING').toLowerCase() as CandidateStatus;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");

  try {
    let whereClause: any = {};

    if (session.user.role === "ADMIN" || session.user.role === "OWNER") {
      if (taskId) {
        whereClause.taskId = taskId;
      }
    } else {
      whereClause.assigned_to = session.user.id;
      if (taskId) {
        whereClause.taskId = taskId;
      }
    }

    const candidates = await prisma.candidate.findMany({
      where: whereClause,
      orderBy: { updated_at: "desc" },
    });

    return NextResponse.json({
      candidates: candidates.map((c) => ({
        id: c.id,
        batchId: c.batch_id,
        assignedTo: c.assigned_to ?? "",
        name: c.name ?? "",
        email: c.email ?? "",
        phone: c.phone ?? "",
        currentLocation: c.current_location ?? "",
        preferredLocations: c.preferred_locations ?? "",
        experience: c.experience ?? "",
        qualification: c.qualification ?? "",
        status: toStatus(c.status),
        remarks: c.remarks ?? "",
        selectedCompany: c.selectedCompany ?? "",
        selectedPosition: c.selectedPosition ?? "",
        selectedAt: c.selectedAt?.toISOString() ?? null,
        updatedAt: c.updated_at.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to load candidates:", error);
    return NextResponse.json({ error: "Failed to load candidates" }, { status: 503 });
  }
}
