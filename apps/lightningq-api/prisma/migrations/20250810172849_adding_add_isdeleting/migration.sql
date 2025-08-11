-- AlterTable
ALTER TABLE "ChiefComplaintTag" ADD COLUMN     "IsDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "IsDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "InvestigationSubType" ADD COLUMN     "IsDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "MedicalHistory" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "IsDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Procedure" ADD COLUMN     "IsDeleted" BOOLEAN DEFAULT false;
