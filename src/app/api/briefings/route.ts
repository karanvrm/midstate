import { authOptions } from "@/auth";
import { canManageBriefings, canViewBriefings } from "@/lib/briefings/permissions";
import { createBriefing, getBriefings } from "@/lib/briefings/queries";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const briefingLinkSchema = z.object({
  title: z.string().trim().min(1, "Link title is required."),
  url: z.string().trim().url("Enter a valid link URL."),
});

const briefingFileSchema = z.object({
  fileName: z.string().trim().min(1, "File name is required."),
  fileUrl: z.string().trim().url("Enter a valid file URL."),
});

const createBriefingSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
  briefingText: z.string().trim().min(1, "Briefing text is required."),
  links: z.array(briefingLinkSchema).optional().default([]),
  files: z.array(briefingFileSchema).optional().default([]),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!canViewBriefings(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Active dashboard access required." }, { status: 403 });
  }

  try {
    const briefings = await getBriefings();

    return NextResponse.json({ briefings });
  } catch (error) {
    console.error("Unable to load briefings.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!canManageBriefings(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = createBriefingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid briefing details." },
      { status: 400 },
    );
  }

  try {
    const briefing = await createBriefing(parsed.data);

    return NextResponse.json(
      {
        briefing,
        message: "Briefing created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to create briefing.", error);
    return NextResponse.json(
      { error: "Unable to create briefing. Please try again shortly." },
      { status: 503 },
    );
  }
}
