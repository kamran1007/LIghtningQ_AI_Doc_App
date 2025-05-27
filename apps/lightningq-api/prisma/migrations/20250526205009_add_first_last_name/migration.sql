/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- Remove old name column
ALTER TABLE "User" DROP COLUMN "name";

-- Add new columns with default values for existing rows
ALTER TABLE "User"
ADD COLUMN "firstName" TEXT NOT NULL DEFAULT 'TempFirstName',
ADD COLUMN "lastName" TEXT NOT NULL DEFAULT 'TempLastName',
ADD COLUMN "dateOfBirth" TIMESTAMP(3);

