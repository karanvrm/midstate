import { prisma } from "@/lib/prisma";
import type { Briefing, CreateBriefingInput, UpdateBriefingInput } from "@/types/briefing";

const briefingInclude = {
  links: {
    orderBy: { createdAt: "asc" as const },
  },
  files: {
    orderBy: { createdAt: "asc" as const },
  },
};

const serializeBriefing = <
  T extends {
    id: string;
    companyName: string;
    briefingText: string;
    createdAt: Date;
    updatedAt: Date;
    links: Array<{
      id: string;
      briefingId: string;
      title: string;
      url: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    files: Array<{
      id: string;
      briefingId: string;
      fileName: string;
      fileUrl: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  },
>(
  briefing: T,
): Briefing => ({
  id: briefing.id,
  companyName: briefing.companyName,
  briefingText: briefing.briefingText,
  createdAt: briefing.createdAt.toISOString(),
  updatedAt: briefing.updatedAt.toISOString(),
  links: briefing.links.map((link) => ({
    id: link.id,
    briefingId: link.briefingId,
    title: link.title,
    url: link.url,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  })),
  files: briefing.files.map((file) => ({
    id: file.id,
    briefingId: file.briefingId,
    fileName: file.fileName,
    fileUrl: file.fileUrl,
    createdAt: file.createdAt.toISOString(),
    updatedAt: file.updatedAt.toISOString(),
  })),
});

export const getBriefings = async () => {
  const briefings = await prisma.briefing.findMany({
    include: briefingInclude,
    orderBy: { createdAt: "desc" },
  });

  return briefings.map(serializeBriefing);
};

export const getBriefingById = async (briefingId: string) => {
  const briefing = await prisma.briefing.findUnique({
    where: { id: briefingId },
    include: briefingInclude,
  });

  return briefing ? serializeBriefing(briefing) : null;
};

export const createBriefing = async (input: CreateBriefingInput) => {
  const briefing = await prisma.briefing.create({
    data: {
      companyName: input.companyName,
      briefingText: input.briefingText,
      links: input.links?.length
        ? {
            create: input.links.map((link) => ({
              title: link.title,
              url: link.url,
            })),
          }
        : undefined,
      files: input.files?.length
        ? {
            create: input.files.map((file) => ({
              fileName: file.fileName,
              fileUrl: file.fileUrl,
            })),
          }
        : undefined,
    },
    include: briefingInclude,
  });

  return serializeBriefing(briefing);
};

export const updateBriefing = async (briefingId: string, input: UpdateBriefingInput) => {
  const briefing = await prisma.$transaction(async (tx) => {
    const existingBriefing = await tx.briefing.findUnique({
      where: { id: briefingId },
      select: { id: true },
    });

    if (!existingBriefing) {
      return null;
    }

    if (input.links) {
      await tx.briefingLink.deleteMany({ where: { briefingId } });
    }

    if (input.files) {
      await tx.briefingFile.deleteMany({ where: { briefingId } });
    }

    return tx.briefing.update({
      where: { id: briefingId },
      data: {
        ...(input.companyName && { companyName: input.companyName }),
        ...(input.briefingText && { briefingText: input.briefingText }),
        ...(input.links && {
          links: {
            create: input.links.map((link) => ({
              title: link.title,
              url: link.url,
            })),
          },
        }),
        ...(input.files && {
          files: {
            create: input.files.map((file) => ({
              fileName: file.fileName,
              fileUrl: file.fileUrl,
            })),
          },
        }),
      },
      include: briefingInclude,
    });
  });

  return briefing ? serializeBriefing(briefing) : null;
};
