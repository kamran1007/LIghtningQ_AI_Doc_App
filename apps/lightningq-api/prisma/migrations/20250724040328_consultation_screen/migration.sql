/*
  Warnings:

  - You are about to drop the column `title` on the `ClinicalNote` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `BloodPressure` on the `Vitals` table. All the data in the column will be lost.
  - You are about to drop the column `PulseRate` on the `Vitals` table. All the data in the column will be lost.
  - You are about to drop the column `SpO2` on the `Vitals` table. All the data in the column will be lost.
  - You are about to drop the column `Weight` on the `Vitals` table. All the data in the column will be lost.
  - You are about to drop the column `consultationId` on the `Vitals` table. All the data in the column will be lost.
  - The `BloodGroup` column on the `Vitals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `MedicationRecord` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[AppointmentId]` on the table `Vitals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AppointmentId` to the `Vitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vitals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TreatmentSource" AS ENUM ('TYPED', 'DICTATED', 'SNIPPET');

-- CreateEnum
CREATE TYPE "FollowUpUnit" AS ENUM ('Days', 'Weeks', 'Months', 'Years');

-- DropForeignKey
ALTER TABLE "MedicationRecord" DROP CONSTRAINT "MedicationRecord_consultationId_fkey";

-- DropForeignKey
ALTER TABLE "Vitals" DROP CONSTRAINT "Vitals_consultationId_fkey";

-- DropIndex
DROP INDEX "Vitals_consultationId_key";

-- AlterTable
ALTER TABLE "ClinicalNote" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "diagnosis",
ADD COLUMN     "complaintNotes" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" INTEGER;

-- AlterTable
ALTER TABLE "Vitals" DROP COLUMN "BloodPressure",
DROP COLUMN "PulseRate",
DROP COLUMN "SpO2",
DROP COLUMN "Weight",
DROP COLUMN "consultationId",
ADD COLUMN     "AppointmentId" INTEGER NOT NULL,
ADD COLUMN     "Diastolic" INTEGER,
ADD COLUMN     "HeartRate" INTEGER,
ADD COLUMN     "OxygenSaturation" DOUBLE PRECISION,
ADD COLUMN     "Systolic" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "BloodGroup",
ADD COLUMN     "BloodGroup" "BloodGroup";

-- DropTable
DROP TABLE "MedicationRecord";

-- CreateTable
CREATE TABLE "VitalsHistory" (
    "VitalsHistoryId" SERIAL NOT NULL,
    "VitalsId" INTEGER NOT NULL,
    "AppointmentId" INTEGER NOT NULL,
    "Systolic" INTEGER,
    "Diastolic" INTEGER,
    "Weight" DOUBLE PRECISION,
    "Temperature" DOUBLE PRECISION,
    "HeartRate" INTEGER,
    "OxygenSaturation" DOUBLE PRECISION,
    "Height" DOUBLE PRECISION,
    "BloodGroup" "BloodGroup",
    "BMI" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedById" INTEGER,

    CONSTRAINT "VitalsHistory_pkey" PRIMARY KEY ("VitalsHistoryId")
);

-- CreateTable
CREATE TABLE "ChiefComplaintTag" (
    "ChiefComplaintTagId" SERIAL NOT NULL,
    "ChiefComplainTagName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specializationId" INTEGER NOT NULL,

    CONSTRAINT "ChiefComplaintTag_pkey" PRIMARY KEY ("ChiefComplaintTagId")
);

-- CreateTable
CREATE TABLE "ConsultationCheifComplaint" (
    "ConsultationComplaintId" SERIAL NOT NULL,
    "ConsultationId" INTEGER NOT NULL,
    "ChiefComplaintTagId" INTEGER NOT NULL,

    CONSTRAINT "ConsultationCheifComplaint_pkey" PRIMARY KEY ("ConsultationComplaintId")
);

-- CreateTable
CREATE TABLE "InvestigationType" (
    "InvestigationTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InvestigationType_pkey" PRIMARY KEY ("InvestigationTypeId")
);

-- CreateTable
CREATE TABLE "InvestigationSubType" (
    "InvestigationSubTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "InvestigationSubType_pkey" PRIMARY KEY ("InvestigationSubTypeId")
);

-- CreateTable
CREATE TABLE "ConsultationInvestigation" (
    "ConsultationInvestigationId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "subtypeId" INTEGER NOT NULL,
    "ConsultationInvestigatRemark" TEXT,

    CONSTRAINT "ConsultationInvestigation_pkey" PRIMARY KEY ("ConsultationInvestigationId")
);

-- CreateTable
CREATE TABLE "ConsultationMedication" (
    "ConsultationMedicationId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "ConsultationMedication_pkey" PRIMARY KEY ("ConsultationMedicationId")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "DiagnosisId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icdCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("DiagnosisId")
);

-- CreateTable
CREATE TABLE "ConsultationDiagnosis" (
    "ConsultationDiagnosisId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "diagnosisId" INTEGER NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationDiagnosis_pkey" PRIMARY KEY ("ConsultationDiagnosisId")
);

-- CreateTable
CREATE TABLE "ConsultationTreatment" (
    "ConsultationTreatmentId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "source" "TreatmentSource" NOT NULL,
    "treatmentText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationTreatment_pkey" PRIMARY KEY ("ConsultationTreatmentId")
);

-- CreateTable
CREATE TABLE "ConsultationFollowUpPlan" (
    "id" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "followUpText" TEXT,
    "duration" INTEGER,
    "unit" "FollowUpUnit",
    "nextDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationFollowUpPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChiefComplaintTag_ChiefComplainTagName_key" ON "ChiefComplaintTag"("ChiefComplainTagName");

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationType_name_key" ON "InvestigationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationSubType_name_typeId_key" ON "InvestigationSubType"("name", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsultationFollowUpPlan_consultationId_key" ON "ConsultationFollowUpPlan"("consultationId");

-- CreateIndex
CREATE UNIQUE INDEX "Vitals_AppointmentId_key" ON "Vitals"("AppointmentId");

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_AppointmentId_fkey" FOREIGN KEY ("AppointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalsHistory" ADD CONSTRAINT "VitalsHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiefComplaintTag" ADD CONSTRAINT "ChiefComplaintTag_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationCheifComplaint" ADD CONSTRAINT "ConsultationCheifComplaint_ConsultationId_fkey" FOREIGN KEY ("ConsultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationCheifComplaint" ADD CONSTRAINT "ConsultationCheifComplaint_ChiefComplaintTagId_fkey" FOREIGN KEY ("ChiefComplaintTagId") REFERENCES "ChiefComplaintTag"("ChiefComplaintTagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationSubType" ADD CONSTRAINT "InvestigationSubType_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InvestigationType"("InvestigationTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InvestigationType"("InvestigationTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_subtypeId_fkey" FOREIGN KEY ("subtypeId") REFERENCES "InvestigationSubType"("InvestigationSubTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationMedication" ADD CONSTRAINT "ConsultationMedication_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationDiagnosis" ADD CONSTRAINT "ConsultationDiagnosis_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationDiagnosis" ADD CONSTRAINT "ConsultationDiagnosis_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "Diagnosis"("DiagnosisId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationTreatment" ADD CONSTRAINT "ConsultationTreatment_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationFollowUpPlan" ADD CONSTRAINT "ConsultationFollowUpPlan_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;
