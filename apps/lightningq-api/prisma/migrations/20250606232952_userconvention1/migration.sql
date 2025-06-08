/*
  Warnings:

  - Made the column `UserId` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `HospitalName` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `HospitalCode` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ParentHospitalCode` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Organizationcode` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `website` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logoUrl` on table `Hospital` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Prefix` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `SpecializationId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Experience` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Employee_ID` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `SignatureOfUser` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `UserId` on table `UserHospitalAccess` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_UserId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_SpecializationId_fkey";

-- DropForeignKey
ALTER TABLE "UserHospitalAccess" DROP CONSTRAINT "UserHospitalAccess_UserId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "UserId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Hospital" ALTER COLUMN "HospitalName" SET NOT NULL,
ALTER COLUMN "HospitalCode" SET NOT NULL,
ALTER COLUMN "ParentHospitalCode" SET NOT NULL,
ALTER COLUMN "Organizationcode" SET NOT NULL,
ALTER COLUMN "website" SET NOT NULL,
ALTER COLUMN "logoUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "Prefix" SET NOT NULL,
ALTER COLUMN "SpecializationId" SET NOT NULL,
ALTER COLUMN "Experience" SET NOT NULL,
ALTER COLUMN "Employee_ID" SET NOT NULL,
ALTER COLUMN "SignatureOfUser" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserHospitalAccess" ALTER COLUMN "UserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_SpecializationId_fkey" FOREIGN KEY ("SpecializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;
