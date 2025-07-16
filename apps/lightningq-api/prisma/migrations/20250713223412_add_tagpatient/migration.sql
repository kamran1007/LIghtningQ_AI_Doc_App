/*
  Warnings:

  - You are about to drop the column `TotalAppntAmount` on the `PaymentHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "TotalAppntAmount",
ADD COLUMN     "AppointmentChargesPaid" DOUBLE PRECISION;
