/*
  Warnings:

  - You are about to drop the column `hashedrefreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedrefreshToken",
ADD COLUMN     "hashedRefreshToken" TEXT;
