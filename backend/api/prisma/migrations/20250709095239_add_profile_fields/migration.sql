-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "major" TEXT,
ADD COLUMN     "school" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notifEvaluation" BOOLEAN DEFAULT true,
ADD COLUMN     "notifMessages" BOOLEAN DEFAULT true,
ADD COLUMN     "notifRapports" BOOLEAN DEFAULT true;
