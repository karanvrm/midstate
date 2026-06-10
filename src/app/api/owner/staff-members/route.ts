import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const canManageTasks = (role?: string, status?: string) =>
  status === "ACTIVE" && (role === "OWNER" || role === "ADMIN");

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!canManageTasks(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const staffMembers = await prisma.user.findMany({
      where: {
        role: "STAFF",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      staffMembers,
    });
  } catch (error) {
    console.error("Unable to load staff members.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}
