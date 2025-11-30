/*
  Warnings:

  - You are about to drop the `_BillItemTypeToBillingItemCharge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BillItemTypeToBillingItemCharge" DROP CONSTRAINT "_BillItemTypeToBillingItemCharge_A_fkey";

-- DropForeignKey
ALTER TABLE "_BillItemTypeToBillingItemCharge" DROP CONSTRAINT "_BillItemTypeToBillingItemCharge_B_fkey";

-- AlterTable
ALTER TABLE "BillingItemCharge" ADD COLUMN     "chargeTypeId" INTEGER;

-- DropTable
DROP TABLE "_BillItemTypeToBillingItemCharge";

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_chargeTypeId_fkey" FOREIGN KEY ("chargeTypeId") REFERENCES "BillItemType"("BillItemTypeId") ON DELETE SET NULL ON UPDATE CASCADE;
