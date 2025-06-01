-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('HOSPITAL', 'CLINIC', 'DIAGNOSTICS');

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "Organizationcode" TEXT,
ADD COLUMN     "ParentHospitalCode" TEXT;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "Orgnizationtype" "OrganizationType";
