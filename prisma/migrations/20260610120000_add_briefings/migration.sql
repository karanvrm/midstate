CREATE TABLE "Briefing" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "briefingText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Briefing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BriefingLink" (
    "id" TEXT NOT NULL,
    "briefingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BriefingLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BriefingFile" (
    "id" TEXT NOT NULL,
    "briefingId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BriefingFile_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BriefingLink_briefingId_idx" ON "BriefingLink"("briefingId");

CREATE INDEX "BriefingFile_briefingId_idx" ON "BriefingFile"("briefingId");

ALTER TABLE "BriefingLink" ADD CONSTRAINT "BriefingLink_briefingId_fkey" FOREIGN KEY ("briefingId") REFERENCES "Briefing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BriefingFile" ADD CONSTRAINT "BriefingFile_briefingId_fkey" FOREIGN KEY ("briefingId") REFERENCES "Briefing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
