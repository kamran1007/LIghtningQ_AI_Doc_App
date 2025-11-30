/*
  Warnings:

  - You are about to drop the column `IsConsultationCompleted` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `IsConsultationCompleted` on the `Consultation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('NOT_STARTED', 'ONGOING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "IsConsultationCompleted",
ADD COLUMN     "consultationStatus" "ConsultationStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "IsConsultationCompleted",
ADD COLUMN     "consultationStatus" "ConsultationStatus" NOT NULL DEFAULT 'NOT_STARTED';
