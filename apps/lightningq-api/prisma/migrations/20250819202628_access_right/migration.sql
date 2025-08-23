/*
  Warnings:

  - You are about to drop the column `Category` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `DisplayName` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `permissionId` on the `RolePermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[UserId,hospitalId,roleId]` on the table `UserHospitalAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `SubModuleId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PermissionId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropIndex
DROP INDEX "Permission_Name_key";

-- DropIndex
DROP INDEX "RolePermission_RoleId_permissionId_key";

-- DropIndex
DROP INDEX "UserHospitalAccess_UserId_hospitalId_key";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "Category",
DROP COLUMN "Description",
DROP COLUMN "DisplayName",
DROP COLUMN "Name",
ADD COLUMN     "CanAI_Assist" BOOLEAN DEFAULT false,
ADD COLUMN     "CanCreate" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "CanDelete" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "CanExport" BOOLEAN DEFAULT true,
ADD COLUMN     "CanUpdate" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "CanView" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "IsActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "SubModuleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "permissionId",
ADD COLUMN     "HospitalId" INTEGER,
ADD COLUMN     "OrganizationId" INTEGER,
ADD COLUMN     "PermissionId" INTEGER NOT NULL,
ADD COLUMN     "UserId" INTEGER;

-- AlterTable
ALTER TABLE "UserHospitalAccess" ADD COLUMN     "OrganizationId" INTEGER;

-- CreateTable
CREATE TABLE "Module" (
    "ModuleId" SERIAL NOT NULL,
    "ModuleName" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("ModuleId")
);

-- CreateTable
CREATE TABLE "SubModule" (
    "SubModuleId" SERIAL NOT NULL,
    "ModuleId" INTEGER NOT NULL,
    "SubModuleName" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubModule_pkey" PRIMARY KEY ("SubModuleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserHospitalAccess_UserId_hospitalId_roleId_key" ON "UserHospitalAccess"("UserId", "hospitalId", "roleId");

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("OrganizationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModule" ADD CONSTRAINT "SubModule_ModuleId_fkey" FOREIGN KEY ("ModuleId") REFERENCES "Module"("ModuleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_SubModuleId_fkey" FOREIGN KEY ("SubModuleId") REFERENCES "SubModule"("SubModuleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_PermissionId_fkey" FOREIGN KEY ("PermissionId") REFERENCES "Permission"("PermissionId") ON DELETE RESTRICT ON UPDATE CASCADE;
