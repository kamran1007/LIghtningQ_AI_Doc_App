-- CreateTable
CREATE TABLE "BillItemType" (
    "BillItemTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillItemType_pkey" PRIMARY KEY ("BillItemTypeId")
);

-- CreateTable
CREATE TABLE "BillingItemCharge" (
    "BillingItemChargeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "hospitalId" INTEGER NOT NULL,
    "specializationId" INTEGER,
    "maxDiscountPercent" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "BillingItemCharge_pkey" PRIMARY KEY ("BillingItemChargeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillItemType_name_key" ON "BillItemType"("name");

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_BillingItemChargeId_fkey" FOREIGN KEY ("BillingItemChargeId") REFERENCES "BillItemType"("BillItemTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;
