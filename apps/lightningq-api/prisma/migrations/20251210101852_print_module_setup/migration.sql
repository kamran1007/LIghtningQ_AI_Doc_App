/*
  Warnings:

  - The primary key for the `PrintPage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PrintPage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrintDetail" DROP CONSTRAINT "PrintDetail_printPageId_fkey";

-- AlterTable
ALTER TABLE "PrintPage" DROP CONSTRAINT "PrintPage_pkey",
DROP COLUMN "id",
ADD COLUMN     "PrintPageId" SERIAL NOT NULL,
ADD CONSTRAINT "PrintPage_pkey" PRIMARY KEY ("PrintPageId");

-- AddForeignKey
ALTER TABLE "PrintDetail" ADD CONSTRAINT "PrintDetail_printPageId_fkey" FOREIGN KEY ("printPageId") REFERENCES "PrintPage"("PrintPageId") ON DELETE SET NULL ON UPDATE CASCADE;
