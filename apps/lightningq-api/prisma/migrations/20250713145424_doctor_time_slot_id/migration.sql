/*
  Warnings:

  - You are about to drop the column `templateId` on the `DoctorSlot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorSlot" DROP CONSTRAINT "DoctorSlot_templateId_fkey";

-- AlterTable
ALTER TABLE "DoctorSlot" DROP COLUMN "templateId",
ADD COLUMN     "DoctorTimeSlotId" INTEGER;

-- AddForeignKey
ALTER TABLE "DoctorSlot" ADD CONSTRAINT "DoctorSlot_DoctorTimeSlotId_fkey" FOREIGN KEY ("DoctorTimeSlotId") REFERENCES "DoctorTimeSlot"("DoctorTimeSlotId") ON DELETE SET NULL ON UPDATE CASCADE;
