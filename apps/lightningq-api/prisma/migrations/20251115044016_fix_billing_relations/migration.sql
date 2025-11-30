-- CreateTable
CREATE TABLE "BillingTransaction" (
    "BillingTransactionId" SERIAL NOT NULL,
    "OPInvoiceNo" TEXT NOT NULL,
    "billType" TEXT NOT NULL DEFAULT 'OPD',
    "billDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" INTEGER NOT NULL,
    "appointmentId" INTEGER,
    "hospitalId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "createdBy" INTEGER,
    "cancelledBy" INTEGER,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "totalDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalTax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "overallDiscountType" TEXT,
    "overallDiscountValue" DECIMAL(10,2) DEFAULT 0,
    "netAmount" DECIMAL(10,2) NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "paymentStatusId" INTEGER NOT NULL,
    "billStatusId" INTEGER NOT NULL,
    "remarks" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingTransaction_pkey" PRIMARY KEY ("BillingTransactionId")
);

-- CreateTable
CREATE TABLE "BillingTransactionItem" (
    "BillingTransactionItemId" SERIAL NOT NULL,
    "billingTransactionId" INTEGER NOT NULL,
    "billingItemChargeId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "chargeType" TEXT,
    "units" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "discountType" TEXT,
    "discountValue" DECIMAL(10,2) DEFAULT 0,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "gstType" TEXT,
    "gstValue" DECIMAL(10,2) DEFAULT 0,
    "gstAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingTransactionItem_pkey" PRIMARY KEY ("BillingTransactionItemId")
);

-- CreateTable
CREATE TABLE "BillingPayment" (
    "BillingPaymentId" SERIAL NOT NULL,
    "billingTransactionId" INTEGER NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "referenceNumber" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingPayment_pkey" PRIMARY KEY ("BillingPaymentId")
);

-- CreateTable
CREATE TABLE "BillStatus" (
    "BillStatusId" SERIAL NOT NULL,
    "StatusName" TEXT NOT NULL,
    "Description" TEXT,
    "colorCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillStatus_pkey" PRIMARY KEY ("BillStatusId")
);

-- CreateTable
CREATE TABLE "PaymentStatus" (
    "PaymentStatusId" SERIAL NOT NULL,
    "StatusName" TEXT NOT NULL,
    "Description" TEXT,
    "colorCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentStatus_pkey" PRIMARY KEY ("PaymentStatusId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingTransaction_OPInvoiceNo_key" ON "BillingTransaction"("OPInvoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "BillStatus_StatusName_key" ON "BillStatus"("StatusName");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentStatus_StatusName_key" ON "PaymentStatus"("StatusName");

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("PatientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_cancelledBy_fkey" FOREIGN KEY ("cancelledBy") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_paymentStatusId_fkey" FOREIGN KEY ("paymentStatusId") REFERENCES "PaymentStatus"("PaymentStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransaction" ADD CONSTRAINT "BillingTransaction_billStatusId_fkey" FOREIGN KEY ("billStatusId") REFERENCES "BillStatus"("BillStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransactionItem" ADD CONSTRAINT "BillingTransactionItem_billingTransactionId_fkey" FOREIGN KEY ("billingTransactionId") REFERENCES "BillingTransaction"("BillingTransactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingTransactionItem" ADD CONSTRAINT "BillingTransactionItem_billingItemChargeId_fkey" FOREIGN KEY ("billingItemChargeId") REFERENCES "BillingItemCharge"("BillingItemChargeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPayment" ADD CONSTRAINT "BillingPayment_billingTransactionId_fkey" FOREIGN KEY ("billingTransactionId") REFERENCES "BillingTransaction"("BillingTransactionId") ON DELETE RESTRICT ON UPDATE CASCADE;
