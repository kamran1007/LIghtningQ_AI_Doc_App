/*
  Warnings:

  - The `gender` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "gender",
ADD COLUMN     "gender" "GenderType";
