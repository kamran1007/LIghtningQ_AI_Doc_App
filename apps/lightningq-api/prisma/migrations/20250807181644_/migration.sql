/*
  Warnings:

  - A unique constraint covering the columns `[Employee_ID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_SpecializationId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "SpecializationId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_Employee_ID_key" ON "User"("Employee_ID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_SpecializationId_fkey" FOREIGN KEY ("SpecializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE SET NULL ON UPDATE CASCADE;
