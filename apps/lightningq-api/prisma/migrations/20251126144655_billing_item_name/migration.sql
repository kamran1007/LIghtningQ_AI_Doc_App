/*
  Warnings:

  - A unique constraint covering the columns `[BillingItemName]` on the table `BillingItemCharge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BillingItemCharge_BillingItemName_key" ON "BillingItemCharge"("BillingItemName");
