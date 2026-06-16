import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}

interface UpdateStatusRequest {
  status: "Active" | "Assigned" | "Rejected";
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

const isValidStatus = (status: string): status is "Active" | "Assigned" | "Rejected" => {
  return ["Active", "Assigned", "Rejected"].includes(status);
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await requireAdminOrOwner();

  if (!session) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({})) as UpdateStatusRequest;

    if (!body.status || !isValidStatus(body.status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: Active, Assigned, Rejected" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      select: { id: true, status: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    if (application.status === body.status) {
      return NextResponse.json({ error: "Application already has this status." }, { status: 400 });
    }

    await prisma.application.update({
      where: { id: params.id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      message: `Application status updated to ${body.status} successfully.`,
    });
  } catch (error) {
    console.error("Failed to update application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status. Please try again later." },
      { status: 500 }
    );
  }
}
