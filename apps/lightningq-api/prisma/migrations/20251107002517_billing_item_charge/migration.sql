/*
  Warnings:

  - You are about to drop the column `name` on the `BillingItemCharge` table. All the data in the column will be lost.
  - Added the required column `BillingItemName` to the `BillingItemCharge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillingItemCharge" DROP COLUMN "name",
ADD COLUMN     "BillingItemName" TEXT NOT NULL;
