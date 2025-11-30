/*
  Warnings:

  - Made the column `BillingItemChargeId` on table `ConsultationProcedure` required. This step will fail if there are existing NULL values in that column.

*/

-- ✅ 1) Fix existing NULL rows FIRST
UPDATE "ConsultationProcedure"
SET "BillingItemChargeId" = (
  SELECT "BillingItemChargeId"
  FROM "BillingItemCharge"
  LIMIT 1
)
WHERE "BillingItemChargeId" IS NULL;

-- DropForeignKey
ALTER TABLE "ConsultationProcedure" DROP CONSTRAINT "ConsultationProcedure_BillingItemChargeId_fkey";

-- AlterTable
ALTER TABLE "ConsultationProcedure" ALTER COLUMN "BillingItemChargeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ConsultationProcedure" ADD CONSTRAINT "ConsultationProcedure_BillingItemChargeId_fkey" FOREIGN KEY ("BillingItemChargeId") REFERENCES "BillingItemCharge"("BillingItemChargeId") ON DELETE RESTRICT ON UPDATE CASCADE;
