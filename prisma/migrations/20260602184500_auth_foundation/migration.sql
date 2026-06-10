-- Rename the password field to reflect bcrypt storage.
ALTER TABLE "User" RENAME COLUMN "password" TO "passwordHash";

-- The requested model requires name; backfill existing empty names before enforcing it.
UPDATE "User"
SET "name" = "email"
WHERE "name" IS NULL OR btrim("name") = '';

ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- Replace ApprovalStatus with the requested Status enum.
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User"
  ALTER COLUMN "status" TYPE "Status"
  USING (
    CASE
      WHEN "status"::text = 'APPROVED' THEN 'ACTIVE'
      ELSE "status"::text
    END
  )::"Status";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'PENDING';

DROP TYPE "ApprovalStatus";

-- Keep the user table scoped to the requested authentication fields.
ALTER TABLE "User" DROP COLUMN "image";
