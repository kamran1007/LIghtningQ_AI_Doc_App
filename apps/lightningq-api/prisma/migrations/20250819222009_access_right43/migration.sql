/*
  Warnings:

  - Made the column `HospitalId` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `OrganizationId` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `UserId` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RolePermission" ALTER COLUMN "HospitalId" SET NOT NULL,
ALTER COLUMN "OrganizationId" SET NOT NULL,
ALTER COLUMN "UserId" SET NOT NULL;
