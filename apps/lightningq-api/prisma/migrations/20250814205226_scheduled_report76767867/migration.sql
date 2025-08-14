-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_paymentHistoryId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "paymentHistoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentHistoryId_fkey" FOREIGN KEY ("paymentHistoryId") REFERENCES "PaymentHistory"("PaymentHistoryId") ON DELETE SET NULL ON UPDATE CASCADE;
