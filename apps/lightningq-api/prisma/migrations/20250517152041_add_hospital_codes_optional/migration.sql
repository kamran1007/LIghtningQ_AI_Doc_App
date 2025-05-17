/*
  Warnings:

  - You are about to drop the column `name` on the `Hospitaltype` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[HospitalType]` on the table `Hospitaltype` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `HospitalType` to the `Hospitaltype` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Hospitaltype_name_key";

-- AlterTable
ALTER TABLE "Hospitaltype" DROP COLUMN "name",
ADD COLUMN     "HospitalType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hospitaltype_HospitalType_key" ON "Hospitaltype"("HospitalType");
