-- CreateEnum
CREATE TYPE "Surname" AS ENUM ('Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof', 'Other');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "surname" "Surname";
