/*
  Warnings:

  - Made the column `isSlotChanged` on table `DoctorTimeSlot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DoctorTimeSlot" ALTER COLUMN "isSlotChanged" SET NOT NULL,
ALTER COLUMN "isSlotChanged" SET DEFAULT false;

-- AlterTable
ALTER TABLE "DoctorTimeSlotHistory" ADD COLUMN     "isSlotChanged" BOOLEAN;
