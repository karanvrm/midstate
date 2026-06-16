import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (
    session?.user?.role !== "STAFF" ||
    session?.user?.status !== "ACTIVE"
  ) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      select: {
        resumeName: true,
        resumeType: true,
        resumeData: true,
        assignedToId: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // Ensure staff can only access resumes for applications assigned to them
    if (application.assignedToId !== session.user.id) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const forceDownload = searchParams.get("download") === "true";
    const disposition = forceDownload ? "attachment" : "inline";

    return new Response(application.resumeData, {
      headers: {
        "Content-Type": application.resumeType,
        "Content-Disposition": `${disposition}; filename="${encodeURIComponent(application.resumeName)}"`,
      },
    });
  } catch (error) {
    console.error("Failed to load resume for staff:", error);
    return NextResponse.json(
      { error: "Failed to retrieve resume. Please try again later." },
      { status: 500 }
    );
  }
}
