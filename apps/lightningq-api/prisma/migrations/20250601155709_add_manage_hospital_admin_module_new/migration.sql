/*
  Warnings:

  - You are about to drop the column `levelId` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `superHospitalCode` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `UserHospitalAccess` table. All the data in the column will be lost.
  - You are about to drop the `Hospitaltype` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[hospitalCode]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `SpecializationType` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoUrl` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Made the column `parentHospitalId` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hospitalCode` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Made the column `Rolename` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `organizationId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `hashedRefreshToken` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `roleId` to the `UserHospitalAccess` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HospitalLevel" AS ENUM ('SUPER', 'CHILD', 'SUB_CHILD');

-- CreateEnum
CREATE TYPE "Hospital_Org_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SpecializationType" AS ENUM ('GENERAL', 'OPHTHALMOLOGY', 'DENTAL', 'ENT', 'ORTHOPEDIC', 'MULTISPECIALITY', 'OTHER');

-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_parentHospitalId_fkey";

-- DropIndex
DROP INDEX "UserHospitalAccess_hospitalId_idx";

-- DropIndex
DROP INDEX "UserHospitalAccess_userId_idx";

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "levelId",
DROP COLUMN "location",
DROP COLUMN "superHospitalCode",
ADD COLUMN     "SpecializationType" "SpecializationType" NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "level" "HospitalLevel" NOT NULL,
ADD COLUMN     "logoUrl" TEXT NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "organizationId" INTEGER NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "status" "Hospital_Org_status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "website" TEXT NOT NULL,
ALTER COLUMN "parentHospitalId" SET NOT NULL,
ALTER COLUMN "hospitalCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "displayName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "Rolename" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "organizationId" INTEGER NOT NULL,
ALTER COLUMN "hashedRefreshToken" SET NOT NULL,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserHospitalAccess" DROP COLUMN "isActive",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Hospitaltype";

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "OrganizationName" TEXT NOT NULL,
    "Organizationcode" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "establishedOn" TIMESTAMP(3) NOT NULL,
    "industryType" TEXT NOT NULL,
    "status" "Hospital_Org_status" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_Organizationcode_key" ON "Organization"("Organizationcode");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_hospitalCode_key" ON "Hospital"("hospitalCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_parentHospitalId_fkey" FOREIGN KEY ("parentHospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
