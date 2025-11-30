/*
  Warnings:

  - Added the required column `chargeTypeId` to the `BillingItemCharge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillingItemCharge" ADD COLUMN     "chargeTypeId" INTEGER NOT NULL;
