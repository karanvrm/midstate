import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    userId: string;
  };
}

const requireOwner = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "OWNER" || session.user.status !== "ACTIVE") {
    return null;
  }

  return session;
};

export async function PATCH(_request: Request, { params }: RouteContext) {
  const session = await requireOwner();

  if (!session) {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
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

  if (user.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending registrations can be approved." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: params.userId },
    data: { status: "ACTIVE", activatedAt: new Date() },
  });

  return NextResponse.json({ message: "User approved successfully." });
}
