/*
  Warnings:

  - Made the column `paymentHistoryId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_paymentHistoryId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "paymentHistoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentHistoryId_fkey" FOREIGN KEY ("paymentHistoryId") REFERENCES "PaymentHistory"("PaymentHistoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
