import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/analytics";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { CandidateStatus } from "@/types/tasks";

function toStatus(raw: string): CandidateStatus {
  return (raw ?? "PENDING").toLowerCase() as CandidateStatus;
}

function serializeCandidate(candidate: Awaited<ReturnType<typeof prisma.candidate.update>>) {
  return {
    id: candidate.id,
    batchId: candidate.batch_id,
    assignedTo: candidate.assigned_to ?? "",
    name: candidate.name ?? "",
    email: candidate.email ?? "",
    phone: candidate.phone ?? "",
    currentLocation: candidate.current_location ?? "",
    preferredLocations: candidate.preferred_locations ?? "",
    experience: candidate.experience ?? "",
    qualification: candidate.qualification ?? "",
    status: toStatus(candidate.status),
    remarks: candidate.remarks ?? "",
    selectedCompany: candidate.selectedCompany ?? "",
    selectedPosition: candidate.selectedPosition ?? "",
    selectedAt: candidate.selectedAt?.toISOString() ?? null,
    tenureCompleted: candidate.tenureCompleted,
    updatedAt: candidate.updated_at.toISOString(),
  };
}

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

    const requestedStatus = typeof body.status === "string"
      ? body.status.toUpperCase()
      : undefined;
    const isAlreadySelected = candidate.status.toUpperCase() === "SELECTED";
    const isMarkingSelected = !isAlreadySelected && requestedStatus === "SELECTED";
    const selectedCompany = typeof body.selectedCompany === "string"
      ? body.selectedCompany.trim()
      : "";
    const selectedPosition = typeof body.selectedPosition === "string"
      ? body.selectedPosition.trim()
      : "";
    const requestedTenureCompleted = typeof body.tenureCompleted === "boolean"
      ? body.tenureCompleted
      : undefined;
    const placementName = candidate.name?.trim() ?? "";
    const placementPhone = candidate.phone?.trim() ?? "";

    if (isAlreadySelected && requestedStatus && requestedStatus !== "SELECTED") {
      return NextResponse.json(
        { error: "This candidate has already been placed. Selected status cannot be changed." },
        { status: 400 }
      );
    }

    if (isAlreadySelected && (body.selectedCompany !== undefined || body.selectedPosition !== undefined)) {
      return NextResponse.json(
        { error: "Placement company and position are locked after selection." },
        { status: 400 }
      );
    }

    if (requestedTenureCompleted !== undefined && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only Admin users can update tenure completion." },
        { status: 403 }
      );
    }

    if (requestedTenureCompleted !== undefined && candidate.status.toUpperCase() !== "SELECTED") {
      return NextResponse.json(
        { error: "Tenure completion can only be set for selected candidates." },
        { status: 400 }
      );
    }

    if (isMarkingSelected && (!placementName || !placementPhone)) {
      return NextResponse.json(
        { error: "The task row must contain values in the first two columns before it can be placed." },
        { status: 400 }
      );
    }

    if (isMarkingSelected && (!selectedCompany || !selectedPosition)) {
      return NextResponse.json(
        { error: "Company Name and Position/Post are required when marking a candidate as placed." },
        { status: 400 }
      );
    }

    const updated = await prisma.candidate.update({
      where: { id: params.id },
      data: {
        ...(requestedStatus && { status: requestedStatus }),
        ...(body.remarks !== undefined && { remarks: body.remarks as string }),
        ...(isMarkingSelected && {
          selectedCompany,
          selectedPosition,
          selectedAt: new Date(),
        }),
        ...(requestedTenureCompleted !== undefined && {
          tenureCompleted: requestedTenureCompleted,
        }),
        updated_at: new Date(),
      },
    });

    // Record the recruiter activity log
    if (body.status || body.remarks !== undefined) {
      try {
        await recordActivity({
          candidateId: params.id,
          staffId: session.user.id,
          status: updated.status,
          remarks: updated.remarks,
        });
      } catch (activityError) {
        console.error("Failed to record recruiter activity:", activityError);
      }
    }

    return NextResponse.json({
      candidate: serializeCandidate(updated),
      message: "Candidate updated successfully",
    });
  } catch (error) {
    console.error("Failed to update candidate:", error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 503 });
  }
}
