/*
  Warnings:

  - Made the column `HospitalId` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `OrganizationId` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_HospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_OrganizationId_fkey";

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "HospitalId" SET NOT NULL,
ALTER COLUMN "OrganizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_HospitalId_fkey" FOREIGN KEY ("HospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
