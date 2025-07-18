/*
  Warnings:

  - You are about to drop the column `RrescheduleReason` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `rescheduleReason` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "RrescheduleReason",
DROP COLUMN "rescheduleReason";
