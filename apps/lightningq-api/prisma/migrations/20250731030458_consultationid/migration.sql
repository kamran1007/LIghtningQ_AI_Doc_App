/*
  Warnings:

  - A unique constraint covering the columns `[consultationId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "consultationId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_consultationId_key" ON "Appointment"("consultationId");
