/*
  Warnings:

  - You are about to drop the column `remark` on the `ConsultationDiagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `subtypeId` on the `ConsultationInvestigation` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `ConsultationInvestigation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InvestigationSubType` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `InvestigationSubType` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InvestigationType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[InvestigationSubTypename,InvestigationTypeId]` on the table `InvestigationSubType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[InvestigationTypeName]` on the table `InvestigationType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `InvestigationSubTypeId` to the `ConsultationInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvestigationTypeId` to the `ConsultationInvestigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiagnosisName` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvestigationSubTypename` to the `InvestigationSubType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvestigationTypeId` to the `InvestigationSubType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvestigationTypeName` to the `InvestigationType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConsultationInvestigation" DROP CONSTRAINT "ConsultationInvestigation_subtypeId_fkey";

-- DropForeignKey
ALTER TABLE "ConsultationInvestigation" DROP CONSTRAINT "ConsultationInvestigation_typeId_fkey";

-- DropForeignKey
ALTER TABLE "InvestigationSubType" DROP CONSTRAINT "InvestigationSubType_typeId_fkey";

-- DropIndex
DROP INDEX "InvestigationSubType_name_typeId_key";

-- DropIndex
DROP INDEX "InvestigationType_name_key";

-- AlterTable
ALTER TABLE "ConsultationDiagnosis" DROP COLUMN "remark",
ADD COLUMN     "DiagnosisRemark" TEXT;

-- AlterTable
ALTER TABLE "ConsultationInvestigation" DROP COLUMN "subtypeId",
DROP COLUMN "typeId",
ADD COLUMN     "InvestigationSubTypeId" INTEGER NOT NULL,
ADD COLUMN     "InvestigationTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Diagnosis" DROP COLUMN "name",
ADD COLUMN     "DiagnosisName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InvestigationSubType" DROP COLUMN "name",
DROP COLUMN "typeId",
ADD COLUMN     "InvestigationSubTypename" TEXT NOT NULL,
ADD COLUMN     "InvestigationTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InvestigationType" DROP COLUMN "name",
ADD COLUMN     "InvestigationTypeName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationSubType_InvestigationSubTypename_Investigation_key" ON "InvestigationSubType"("InvestigationSubTypename", "InvestigationTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationType_InvestigationTypeName_key" ON "InvestigationType"("InvestigationTypeName");

-- AddForeignKey
ALTER TABLE "InvestigationSubType" ADD CONSTRAINT "InvestigationSubType_InvestigationTypeId_fkey" FOREIGN KEY ("InvestigationTypeId") REFERENCES "InvestigationType"("InvestigationTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_InvestigationTypeId_fkey" FOREIGN KEY ("InvestigationTypeId") REFERENCES "InvestigationType"("InvestigationTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_InvestigationSubTypeId_fkey" FOREIGN KEY ("InvestigationSubTypeId") REFERENCES "InvestigationSubType"("InvestigationSubTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
