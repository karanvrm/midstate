import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Maps Naukri XLSX column headers → Prisma Candidate field names
const COLUMN_MAP: Record<string, keyof typeof EMPTY_CANDIDATE> = {
  'Name': 'name',
  'Email ID': 'email',
  'Phone Number': 'phone',
  'Current Location': 'current_location',
  'Preferred Locations': 'preferred_locations',
  'Total Experience': 'experience',
  'Under Graduation degree': 'qualification',
};

const EMPTY_CANDIDATE = {
  name: null as string | null,
  email: null as string | null,
  phone: null as string | null,
  current_location: null as string | null,
  preferred_locations: null as string | null,
  experience: null as string | null,
  qualification: null as string | null,
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const batches = await prisma.batch.findMany({
      orderBy: { uploaded_at: 'desc' },
    });

    return NextResponse.json({
      batches: batches.map((b) => ({
        id: b.id,
        title: b.title,
        uploadedBy: b.uploaded_by,
        uploadedAt: b.uploaded_at.toISOString(),
        status: b.status.toLowerCase(),
      })),
    });
  } catch (error) {
    console.error("Failed to load batches:", error);
    return NextResponse.json({ error: "Failed to load batches" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (
    !session?.user ||
    session.user.status !== 'ACTIVE' ||
    !['ADMIN', 'OWNER'].includes(session.user.role ?? '')
  ) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !Array.isArray(body.candidates)) {
    return NextResponse.json({ error: "Invalid payload: title and candidates are required" }, { status: 400 });
  }

  try {
    // Create the batch
    const batch = await prisma.batch.create({
      data: {
        title: body.title as string,
        uploaded_by: session.user.id,
        status: 'ACTIVE',
      },
    });

    // Map each candidate row using the column map
    if (body.candidates.length > 0) {
      const candidateData = body.candidates
        .filter((c: { assignedTo: string; data: Record<string, string> }) => c.assignedTo)
        .map((c: { assignedTo: string; data: Record<string, string> }) => {
          const fields = { ...EMPTY_CANDIDATE };
          Object.entries(COLUMN_MAP).forEach(([xlsxCol, dbField]) => {
            const val = c.data[xlsxCol] ?? '';
            (fields as Record<string, string | null>)[dbField] = val || null;
          });
          return {
            batch_id: batch.id,
            assigned_to: c.assignedTo,
            ...fields,
            status: 'PENDING',
          };
        });

      if (candidateData.length > 0) {
        await prisma.candidate.createMany({ data: candidateData });
      }
    }

    return NextResponse.json(
      { batchId: batch.id, message: "Batch and candidates created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json({ error: "Failed to create batch" }, { status: 503 });
  }
}
