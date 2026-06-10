import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    userId: string;
  };
}

interface UpdateStatusRequest {
  status: "PENDING" | "ACTIVE" | "REJECTED";
}

const requireOwner = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "OWNER" || session.user.status !== "ACTIVE") {
    return null;
  }

  return session;
};

const isValidStatus = (status: string): status is "PENDING" | "ACTIVE" | "REJECTED" => {
  return ["PENDING", "ACTIVE", "REJECTED"].includes(status);
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await requireOwner();

  if (!session) {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({})) as UpdateStatusRequest;

  if (!body.status || !isValidStatus(body.status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be one of: PENDING, ACTIVE, REJECTED" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true, role: true, status: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (user.role === "OWNER") {
    return NextResponse.json({ error: "Owner accounts cannot be changed here." }, { status: 400 });
  }

  if (user.status === body.status) {
    return NextResponse.json({ error: "User already has this status." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: params.userId },
    data: { status: body.status },
  });

  const statusMessages = {
    PENDING: "User status changed to Pending.",
    ACTIVE: "User status changed to Active.",
    REJECTED: "User status changed to Rejected.",
  };

  return NextResponse.json({ message: statusMessages[body.status] });
}
