/*
  Warnings:

  - A unique constraint covering the columns `[BillingItemName,hospitalId,doctorId,appointmentTypeId]` on the table `BillingItemCharge` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BillingItemCharge_BillingItemName_key";

-- CreateTable
CREATE TABLE "PrintPage" (
    "id" SERIAL NOT NULL,
    "pageName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorPrintSetting" (
    "DoctorPrintSettingId" SERIAL NOT NULL,
    "parentOrganizationId" INTEGER NOT NULL,
    "HospitalId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "language" INTEGER,
    "type" BOOLEAN,
    "printHeaderImgUrl" TEXT,
    "printHeaderImgAlignment" TEXT,
    "printImageHeaderUrl" TEXT,
    "printImageFooterUrl" TEXT,
    "printBillingLogoUrl" TEXT,
    "printBillingHeaderImgUrl" TEXT,
    "printBillingFooterImgUrl" TEXT,
    "printPrescriptionLogoUrl" TEXT,
    "printPrescriptionHeaderImgUrl" TEXT,
    "printPrescriptionFooterImgUrl" TEXT,
    "printVisitSummaryLogoUrl" TEXT,
    "printVisitSummaryHeaderImgUrl" TEXT,
    "printVisitSummaryFooterImgUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorPrintSetting_pkey" PRIMARY KEY ("DoctorPrintSettingId")
);

-- CreateTable
CREATE TABLE "PrintDetail" (
    "PrintDetailId" SERIAL NOT NULL,
    "DoctorPrintSettingId" INTEGER NOT NULL,
    "printPageId" INTEGER,
    "letterHeadValue" TEXT NOT NULL,

    CONSTRAINT "PrintDetail_pkey" PRIMARY KEY ("PrintDetailId")
);

-- CreateTable
CREATE TABLE "PageSettings" (
    "PageSettingsId" SERIAL NOT NULL,
    "printDetailId" INTEGER NOT NULL,
    "pageSize" TEXT NOT NULL,
    "pageOrientation" TEXT NOT NULL,
    "marginTop" INTEGER NOT NULL,
    "marginBottom" INTEGER NOT NULL,
    "marginLeft" INTEGER NOT NULL,
    "marginRight" INTEGER NOT NULL,

    CONSTRAINT "PageSettings_pkey" PRIMARY KEY ("PageSettingsId")
);

-- CreateTable
CREATE TABLE "CustomPrintSettings" (
    "CustomPrintSettingsId" SERIAL NOT NULL,
    "printDetailId" INTEGER NOT NULL,
    "headerSettings" TEXT,
    "contentSettings" TEXT,
    "footerSettings" TEXT,

    CONSTRAINT "CustomPrintSettings_pkey" PRIMARY KEY ("CustomPrintSettingsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrintPage_pageName_key" ON "PrintPage"("pageName");

-- CreateIndex
CREATE UNIQUE INDEX "PageSettings_printDetailId_key" ON "PageSettings"("printDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomPrintSettings_printDetailId_key" ON "CustomPrintSettings"("printDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingItemCharge_BillingItemName_hospitalId_doctorId_appoi_key" ON "BillingItemCharge"("BillingItemName", "hospitalId", "doctorId", "appointmentTypeId");

-- AddForeignKey
ALTER TABLE "DoctorPrintSetting" ADD CONSTRAINT "DoctorPrintSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorPrintSetting" ADD CONSTRAINT "DoctorPrintSetting_HospitalId_fkey" FOREIGN KEY ("HospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorPrintSetting" ADD CONSTRAINT "DoctorPrintSetting_parentOrganizationId_fkey" FOREIGN KEY ("parentOrganizationId") REFERENCES "Organization"("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintDetail" ADD CONSTRAINT "PrintDetail_DoctorPrintSettingId_fkey" FOREIGN KEY ("DoctorPrintSettingId") REFERENCES "DoctorPrintSetting"("DoctorPrintSettingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintDetail" ADD CONSTRAINT "PrintDetail_printPageId_fkey" FOREIGN KEY ("printPageId") REFERENCES "PrintPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSettings" ADD CONSTRAINT "PageSettings_printDetailId_fkey" FOREIGN KEY ("printDetailId") REFERENCES "PrintDetail"("PrintDetailId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPrintSettings" ADD CONSTRAINT "CustomPrintSettings_printDetailId_fkey" FOREIGN KEY ("printDetailId") REFERENCES "PrintDetail"("PrintDetailId") ON DELETE RESTRICT ON UPDATE CASCADE;
