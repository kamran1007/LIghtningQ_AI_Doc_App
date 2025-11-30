-- AlterTable
ALTER TABLE "PatientPackageUsage" ADD COLUMN     "IsFastTrack" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "IsFreeFollowUp" BOOLEAN NOT NULL DEFAULT false;
