import { authOptions } from "@/auth";
import { canManageBriefings } from "@/lib/briefings/permissions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!canManageBriefings(session?.user?.role, session?.user?.status)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  const files = formData?.getAll("files").filter((item): item is File => item instanceof File);

  if (!files?.length) {
    return NextResponse.json({ error: "Upload at least one file." }, { status: 400 });
  }

  try {
    const uploadDirectory = path.join(process.cwd(), "public", "uploads", "briefings");
    await mkdir(uploadDirectory, { recursive: true });

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const extension = path.extname(file.name);
        const baseName = path
          .basename(file.name, extension)
          .replace(/[^a-zA-Z0-9-_]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase();
        const fileName = `${baseName || "briefing-file"}-${randomUUID()}${extension}`;
        const filePath = path.join(uploadDirectory, fileName);
        const bytes = Buffer.from(await file.arrayBuffer());

        await writeFile(filePath, bytes);

        return {
          fileName: file.name,
          fileUrl: `/uploads/briefings/${fileName}`,
        };
      }),
    );

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Unable to upload briefing files.", error);
    return NextResponse.json(
      { error: "Unable to upload files. Please try again shortly." },
      { status: 503 },
    );
  }
}
