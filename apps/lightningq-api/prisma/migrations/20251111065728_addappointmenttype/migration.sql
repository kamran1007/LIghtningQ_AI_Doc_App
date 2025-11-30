/*
  Warnings:

  - You are about to drop the column `chargeTypeId` on the `BillingItemCharge` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillingItemCharge" DROP CONSTRAINT "BillingItemCharge_chargeTypeId_fkey";

-- AlterTable
ALTER TABLE "BillingItemCharge" DROP COLUMN "chargeTypeId",
ADD COLUMN     "appointmentTypeId" INTEGER;

-- CreateTable
CREATE TABLE "_BillItemTypeToBillingItemCharge" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BillItemTypeToBillingItemCharge_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BillItemTypeToBillingItemCharge_B_index" ON "_BillItemTypeToBillingItemCharge"("B");

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_appointmentTypeId_fkey" FOREIGN KEY ("appointmentTypeId") REFERENCES "AppointmentType"("AppointmentTypeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BillItemTypeToBillingItemCharge" ADD CONSTRAINT "_BillItemTypeToBillingItemCharge_A_fkey" FOREIGN KEY ("A") REFERENCES "BillItemType"("BillItemTypeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BillItemTypeToBillingItemCharge" ADD CONSTRAINT "_BillItemTypeToBillingItemCharge_B_fkey" FOREIGN KEY ("B") REFERENCES "BillingItemCharge"("BillingItemChargeId") ON DELETE CASCADE ON UPDATE CASCADE;
