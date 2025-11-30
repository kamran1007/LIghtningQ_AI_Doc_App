-- AlterTable
ALTER TABLE "BillingItemCharge" ADD COLUMN     "investigationTypeId" INTEGER;

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_investigationTypeId_fkey" FOREIGN KEY ("investigationTypeId") REFERENCES "InvestigationType"("InvestigationTypeId") ON DELETE SET NULL ON UPDATE CASCADE;
