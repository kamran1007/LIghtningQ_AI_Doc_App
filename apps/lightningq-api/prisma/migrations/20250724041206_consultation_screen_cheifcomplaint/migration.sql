/*
  Warnings:

  - You are about to drop the column `complaintNotes` on the `Consultation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "complaintNotes",
ADD COLUMN     "CheifcomplaintNotes" TEXT;
