/*
  Warnings:

  - You are about to drop the column `userId` on the `DoctorTimeSlot` table. All the data in the column will be lost.
  - Added the required column `DoctorId` to the `DoctorTimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DoctorTimeSlot" DROP CONSTRAINT "DoctorTimeSlot_userId_fkey";

-- AlterTable
ALTER TABLE "DoctorTimeSlot" DROP COLUMN "userId",
ADD COLUMN     "DoctorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DoctorTimeSlot" ADD CONSTRAINT "DoctorTimeSlot_DoctorId_fkey" FOREIGN KEY ("DoctorId") REFERENCES "User"("UserId") ON DELETE CASCADE ON UPDATE CASCADE;
