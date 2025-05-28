/*
  Warnings:

  - You are about to drop the column `surname` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof', 'Other');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "surname",
ADD COLUMN     "title" "Title";

-- DropEnum
DROP TYPE "Surname";
