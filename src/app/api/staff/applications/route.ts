import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const requireActiveStaff = async () => {
  const session = await getServerSession(authOptions);

  if (
    session?.user?.role !== "STAFF" ||
    session?.user?.status !== "ACTIVE"
  ) {
    return null;
  }

  return session;
};

export async function GET() {
  const session = await requireActiveStaff();

  if (!session) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const applications = await prisma.application.findMany({
      where: {
        assignedToId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        preferredLocation: true,
        jobTitle: true,
        resumeName: true,
        resumeType: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Failed to fetch staff applications:", error);
    return NextResponse.json(
      { error: "Failed to load applications. Please try again later." },
      { status: 500 }
    );
  }
}
