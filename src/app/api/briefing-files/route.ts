import { authOptions } from "@/auth";
import { canManageBriefings } from "@/lib/briefings/permissions";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!canManageBriefings(session?.user?.role, session?.user?.status)) {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 }
    );
  }

  const formData = await request.formData().catch(() => null);

  const files = formData
    ?.getAll("files")
    .filter((item): item is File => item instanceof File);

  if (!files?.length) {
    return NextResponse.json(
      { error: "Upload at least one file." },
      { status: 400 }
    );
  }

  try {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const extension = file.name.split(".").pop() ?? "";
        const storageFileName = `${randomUUID()}.${extension}`;

        const bytes = Buffer.from(await file.arrayBuffer());

        const { error: uploadError } = await supabaseAdmin.storage
          .from("briefings")
          .upload(storageFileName, bytes, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabaseAdmin.storage
          .from("briefings")
          .getPublicUrl(storageFileName);

        return {
          fileName: file.name,
          fileUrl: data.publicUrl,
        };
      })
    );

    return NextResponse.json({
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Unable to upload briefing files.", error);

    return NextResponse.json(
      {
        error: "Unable to upload files. Please try again shortly.",
      },
      {
        status: 503,
      }
    );
  }
}