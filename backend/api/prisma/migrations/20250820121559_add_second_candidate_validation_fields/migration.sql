-- AlterTable
ALTER TABLE "stage_requests" ADD COLUMN     "requires_second_candidate_validation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "second_candidate_user_id" UUID,
ADD COLUMN     "second_candidate_validated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "second_candidate_validation_expires_at" TIMESTAMP(3),
ADD COLUMN     "second_candidate_validation_token" TEXT;
