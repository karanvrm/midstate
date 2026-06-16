import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}

interface AssignRequest {
  staffUserId: string;
}

const requireAdminOrOwner = async () => {
  const session = await getServerSession(authOptions);

  if (
    (session?.user?.role !== "OWNER" && session?.user?.role !== "ADMIN") ||
    session?.user?.status !== "ACTIVE"
  ) {
    return null;
  }

  return session;
};

export async function POST(request: Request, { params }: RouteContext) {
  const session = await requireAdminOrOwner();

  if (!session) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as AssignRequest;

    if (!body.staffUserId || typeof body.staffUserId !== "string") {
      return NextResponse.json(
        { error: "staffUserId is required." },
        { status: 400 }
      );
    }

    // Validate the target staff member
    const staffMember = await prisma.user.findUnique({
      where: { id: body.staffUserId },
      select: { id: true, name: true, role: true, status: true },
    });

    if (!staffMember) {
      return NextResponse.json(
        { error: "Staff member not found." },
        { status: 404 }
      );
    }

    if (staffMember.role !== "STAFF" || staffMember.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Selected user is not an active staff member." },
        { status: 400 }
      );
    }

    // Validate the application exists
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    // Assign and update status
    await prisma.application.update({
      where: { id: params.id },
      data: {
        assignedToId: body.staffUserId,
        status: "Assigned",
      },
    });

    return NextResponse.json({
      message: `Application successfully assigned to ${staffMember.name}.`,
      assignedTo: { id: staffMember.id, name: staffMember.name },
    });
  } catch (error) {
    console.error("Failed to assign application:", error);
    return NextResponse.json(
      { error: "Failed to assign application. Please try again later." },
      { status: 500 }
    );
  }
}
