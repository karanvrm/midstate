import { authOptions } from "@/auth";
import { canManageBriefings, canViewBriefings } from "@/lib/briefings/permissions";
import { getBriefingById, updateBriefing } from "@/lib/briefings/queries";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const briefingLinkSchema = z.object({
  title: z.string().trim().min(1, "Link title is required."),
  url: z.string().trim().min(1,"Enter a valid link URL."),
});

const briefingFileSchema = z.object({
  fileName: z.string().trim().min(1, "File name is required."),
  fileUrl: z.string().trim().min(1, "Enter a valid file URL."),
});

const updateBriefingSchema = z
  .object({
    companyName: z.string().trim().min(1, "Company name is required.").optional(),
    briefingText: z.string().trim().min(1, "Briefing text is required.").optional(),
    links: z.array(briefingLinkSchema).optional(),
    files: z.array(briefingFileSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one briefing field to update.",
  });

export async function GET(
  request: Request,
  { params }: { params: { briefingId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!canViewBriefings(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Active dashboard access required." }, { status: 403 });
  }

  try {
    const briefing = await getBriefingById(params.briefingId);

    if (!briefing) {
      return NextResponse.json({ error: "Briefing not found." }, { status: 404 });
    }

    return NextResponse.json({ briefing });
  } catch (error) {
    console.error("Unable to load briefing.", error);
    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { briefingId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!canManageBriefings(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateBriefingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid briefing details." },
      { status: 400 },
    );
  }

  try {
    const briefing = await updateBriefing(params.briefingId, parsed.data);

    if (!briefing) {
      return NextResponse.json({ error: "Briefing not found." }, { status: 404 });
    }

    return NextResponse.json({
      briefing,
      message: "Briefing updated successfully.",
    });
  } catch (error) {
    console.error("Unable to update briefing.", error);
    return NextResponse.json(
      { error: "Unable to update briefing. Please try again shortly." },
      { status: 503 },
    );
  }
}
