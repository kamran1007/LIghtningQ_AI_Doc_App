/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,hospitalId]` on the table `DoctorCosting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `DoctorCosting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoctorCosting" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DoctorCosting_doctorId_hospitalId_key" ON "DoctorCosting"("doctorId", "hospitalId");

-- AddForeignKey
ALTER TABLE "DoctorCosting" ADD CONSTRAINT "DoctorCosting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;
