/*
  Warnings:

  - You are about to drop the column `PatirntImage` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "PatirntImage",
ADD COLUMN     "HospitalId" INTEGER,
ADD COLUMN     "OrganizationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_HospitalId_fkey" FOREIGN KEY ("HospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("OrganizationId") ON DELETE SET NULL ON UPDATE CASCADE;
