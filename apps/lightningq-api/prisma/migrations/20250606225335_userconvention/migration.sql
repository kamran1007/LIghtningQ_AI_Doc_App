-- CreateEnum
CREATE TYPE "HospitalLevel" AS ENUM ('SUPER', 'CHILD', 'SUB_CHILD');

-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof', 'Other');

-- CreateEnum
CREATE TYPE "Hospital_Org_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SpecializationType" AS ENUM ('GENERAL', 'OPHTHALMOLOGY', 'DENTAL', 'ENT', 'ORTHOPEDIC', 'MULTISPECIALITY', 'OTHER');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('HOSPITAL', 'CLINIC', 'DIAGNOSTICS');

-- CreateTable
CREATE TABLE "User" (
    "UserId" SERIAL NOT NULL,
    "Prefix" "Title",
    "imageUrl" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hashedRefreshToken" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "roleId" INTEGER NOT NULL,
    "SpecializationId" INTEGER,
    "Experience" TEXT,
    "Employee_ID" TEXT,
    "SignatureOfUser" TEXT,
    "organizationId" INTEGER NOT NULL,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "OrganizationId" SERIAL NOT NULL,
    "OrganizationName" TEXT NOT NULL,
    "Organizationcode" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "Orgnizationtype" "OrganizationType",
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

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("OrganizationId")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "HospitalId" SERIAL NOT NULL,
    "HospitalName" TEXT,
    "HospitalCode" TEXT,
    "ParentHospitalCode" TEXT,
    "Organizationcode" TEXT,
    "SpecializationType" "SpecializationType" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" "Hospital_Org_status" NOT NULL DEFAULT 'ACTIVE',
    "level" "HospitalLevel",
    "parentHospitalId" INTEGER,
    "organizationId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("HospitalId")
);

-- CreateTable
CREATE TABLE "UserHospitalAccess" (
    "UserHospitalAccessId" SERIAL NOT NULL,
    "UserId" INTEGER,
    "hospitalId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHospitalAccess_pkey" PRIMARY KEY ("UserHospitalAccessId")
);

-- CreateTable
CREATE TABLE "Setting" (
    "SettingId" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("SettingId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "AuditLogId" SERIAL NOT NULL,
    "UserId" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("AuditLogId")
);

-- CreateTable
CREATE TABLE "LoginSession" (
    "LoginSessionId" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginSession_pkey" PRIMARY KEY ("LoginSessionId")
);

-- CreateTable
CREATE TABLE "Role" (
    "RoleId" SERIAL NOT NULL,
    "Rolename" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("RoleId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "RolePermissionId" SERIAL NOT NULL,
    "RoleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("RolePermissionId")
);

-- CreateTable
CREATE TABLE "Permission" (
    "PermissionId" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "DisplayName" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("PermissionId")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "SpecializationId" SERIAL NOT NULL,
    "SpecializationName" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("SpecializationId")
);

-- CreateTable
CREATE TABLE "_UserHospitals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserHospitals_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_Organizationcode_key" ON "Organization"("Organizationcode");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_HospitalCode_key" ON "Hospital"("HospitalCode");

-- CreateIndex
CREATE UNIQUE INDEX "UserHospitalAccess_UserId_hospitalId_key" ON "UserHospitalAccess"("UserId", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_UserId_key" ON "Setting"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Rolename_key" ON "Role"("Rolename");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_RoleId_permissionId_key" ON "RolePermission"("RoleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_Name_key" ON "Permission"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_SpecializationName_key" ON "Specialization"("SpecializationName");

-- CreateIndex
CREATE INDEX "_UserHospitals_B_index" ON "_UserHospitals"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("RoleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_SpecializationId_fkey" FOREIGN KEY ("SpecializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_parentHospitalId_fkey" FOREIGN KEY ("parentHospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("RoleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginSession" ADD CONSTRAINT "LoginSession_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("RoleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("PermissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHospitals" ADD CONSTRAINT "_UserHospitals_A_fkey" FOREIGN KEY ("A") REFERENCES "Hospital"("HospitalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHospitals" ADD CONSTRAINT "_UserHospitals_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("UserId") ON DELETE CASCADE ON UPDATE CASCADE;
