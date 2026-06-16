ALTER TABLE "JobDescriptionSheet" RENAME COLUMN "name" TO "companyName";

ALTER TABLE "JobDescriptionSheet" ADD COLUMN "typeOfRoles" TEXT;
ALTER TABLE "JobDescriptionSheet" ADD COLUMN "tableData" JSONB;

UPDATE "JobDescriptionSheet"
SET
  "typeOfRoles" = 'General',
  "tableData" = (
    SELECT jsonb_agg(
      jsonb_build_array('', '', '', '', '', '', '', '', '', '')
    )
    FROM generate_series(1, 15)
  )
WHERE "typeOfRoles" IS NULL;

ALTER TABLE "JobDescriptionSheet" ALTER COLUMN "typeOfRoles" SET NOT NULL;
ALTER TABLE "JobDescriptionSheet" ALTER COLUMN "tableData" SET NOT NULL;

ALTER TABLE "JobDescriptionSheet" DROP COLUMN "url";

CREATE UNIQUE INDEX "JobDescriptionSheet_companyName_key" ON "JobDescriptionSheet"("companyName");
