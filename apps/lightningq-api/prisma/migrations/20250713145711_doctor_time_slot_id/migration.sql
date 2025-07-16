/*
  Warnings:

  - Made the column `DoctorTimeSlotId` on table `DoctorSlot` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DoctorSlot" DROP CONSTRAINT "DoctorSlot_DoctorTimeSlotId_fkey";

-- AlterTable
ALTER TABLE "DoctorSlot" ALTER COLUMN "DoctorTimeSlotId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "DoctorSlot" ADD CONSTRAINT "DoctorSlot_DoctorTimeSlotId_fkey" FOREIGN KEY ("DoctorTimeSlotId") REFERENCES "DoctorTimeSlot"("DoctorTimeSlotId") ON DELETE RESTRICT ON UPDATE CASCADE;
