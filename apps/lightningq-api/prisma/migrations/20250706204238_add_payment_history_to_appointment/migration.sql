/*
  Warnings:

  - You are about to drop the column `TransactionId` on the `PaymentType` table. All the data in the column will be lost.
  - You are about to drop the column `Transaction_DateTime` on the `PaymentType` table. All the data in the column will be lost.
  - Added the required column `paymentHistoryId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "paymentHistoryId" INTEGER NOT NULL,
ADD COLUMN     "rescheduleReason" TEXT,
ADD COLUMN     "rescheduledDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PaymentType" DROP COLUMN "TransactionId",
DROP COLUMN "Transaction_DateTime";

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "PaymentHistoryId" SERIAL NOT NULL,
    "TransactionId" INTEGER NOT NULL,
    "Transaction_DateTime" TIMESTAMP(3) NOT NULL,
    "paymentTypePaymentTypeId" INTEGER NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("PaymentHistoryId")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentHistoryId_fkey" FOREIGN KEY ("paymentHistoryId") REFERENCES "PaymentHistory"("PaymentHistoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_paymentTypePaymentTypeId_fkey" FOREIGN KEY ("paymentTypePaymentTypeId") REFERENCES "PaymentType"("PaymentTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
