/*
  Warnings:

  - You are about to drop the `Surgery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Surgery" DROP CONSTRAINT "Surgery_consultationId_fkey";

-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "specializationId" INTEGER;

-- DropTable
DROP TABLE "Surgery";

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE SET NULL ON UPDATE CASCADE;
