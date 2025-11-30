/*
  Warnings:

  - You are about to drop the column `name` on the `BillItemType` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `BillingItemCharge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[BillItemTypeName]` on the table `BillItemType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `BillItemTypeName` to the `BillItemType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillingItemCharge" DROP CONSTRAINT "BillingItemCharge_BillingItemChargeId_fkey";

-- DropIndex
DROP INDEX "BillItemType_name_key";

-- AlterTable
ALTER TABLE "BillItemType" DROP COLUMN "name",
ADD COLUMN     "BillItemTypeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BillingItemCharge" DROP COLUMN "price",
ADD COLUMN     "BillItemPrice" DECIMAL(10,2);

-- CreateIndex
CREATE UNIQUE INDEX "BillItemType_BillItemTypeName_key" ON "BillItemType"("BillItemTypeName");

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_chargeTypeId_fkey" FOREIGN KEY ("chargeTypeId") REFERENCES "BillItemType"("BillItemTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
