/*
  Warnings:

  - You are about to drop the column `BillItemPrice` on the `BillingItemCharge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BillingItemCharge" DROP COLUMN "BillItemPrice",
ADD COLUMN     "price" DECIMAL(10,2);
