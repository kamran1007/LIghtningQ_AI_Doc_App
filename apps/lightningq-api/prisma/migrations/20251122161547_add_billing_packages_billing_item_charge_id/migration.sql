/*
  Warnings:

  - You are about to drop the column `packageId` on the `PatientPackageUsage` table. All the data in the column will be lost.
  - You are about to drop the `_BillingItemChargeToPatientPackageUsage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `billingItemChargeId` to the `PatientPackageUsage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BillingItemChargeToPatientPackageUsage" DROP CONSTRAINT "_BillingItemChargeToPatientPackageUsage_A_fkey";

-- DropForeignKey
ALTER TABLE "_BillingItemChargeToPatientPackageUsage" DROP CONSTRAINT "_BillingItemChargeToPatientPackageUsage_B_fkey";

-- AlterTable
ALTER TABLE "PatientPackageUsage" DROP COLUMN "packageId",
ADD COLUMN     "billingItemChargeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_BillingItemChargeToPatientPackageUsage";

-- AddForeignKey
ALTER TABLE "PatientPackageUsage" ADD CONSTRAINT "PatientPackageUsage_billingItemChargeId_fkey" FOREIGN KEY ("billingItemChargeId") REFERENCES "BillingItemCharge"("BillingItemChargeId") ON DELETE RESTRICT ON UPDATE CASCADE;
