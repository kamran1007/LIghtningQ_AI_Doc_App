/*
  Warnings:

  - You are about to drop the column `InvestigationSubTypeId` on the `ConsultationInvestigation` table. All the data in the column will be lost.
  - You are about to drop the column `InvestigationTypeId` on the `ConsultationInvestigation` table. All the data in the column will be lost.
  - You are about to drop the column `ProcedureId` on the `ConsultationProcedure` table. All the data in the column will be lost.
  - Made the column `consultationId` on table `ConsultationProcedure` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ConsultationInvestigation" DROP CONSTRAINT "ConsultationInvestigation_InvestigationSubTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ConsultationInvestigation" DROP CONSTRAINT "ConsultationInvestigation_InvestigationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ConsultationProcedure" DROP CONSTRAINT "ConsultationProcedure_ProcedureId_fkey";

-- DropForeignKey
ALTER TABLE "ConsultationProcedure" DROP CONSTRAINT "ConsultationProcedure_consultationId_fkey";

-- AlterTable
ALTER TABLE "ConsultationInvestigation" DROP COLUMN "InvestigationSubTypeId",
DROP COLUMN "InvestigationTypeId",
ADD COLUMN     "BillingItemChargeId" INTEGER;

-- AlterTable
ALTER TABLE "ConsultationProcedure" DROP COLUMN "ProcedureId",
ADD COLUMN     "BillingItemChargeId" INTEGER,
ALTER COLUMN "consultationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_BillingItemChargeId_fkey" FOREIGN KEY ("BillingItemChargeId") REFERENCES "BillingItemCharge"("BillingItemChargeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationProcedure" ADD CONSTRAINT "ConsultationProcedure_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationProcedure" ADD CONSTRAINT "ConsultationProcedure_BillingItemChargeId_fkey" FOREIGN KEY ("BillingItemChargeId") REFERENCES "BillingItemCharge"("BillingItemChargeId") ON DELETE SET NULL ON UPDATE CASCADE;
