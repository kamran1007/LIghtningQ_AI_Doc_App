-- CreateTable
CREATE TABLE "PatientPackageUsage" (
    "PatientPackageUsageId" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "appointmentId" INTEGER,
    "consultationId" INTEGER,
    "packageId" INTEGER NOT NULL,
    "usageDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientPackageUsage_pkey" PRIMARY KEY ("PatientPackageUsageId")
);

-- CreateTable
CREATE TABLE "_BillingItemChargeToPatientPackageUsage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BillingItemChargeToPatientPackageUsage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BillingItemChargeToPatientPackageUsage_B_index" ON "_BillingItemChargeToPatientPackageUsage"("B");

-- AddForeignKey
ALTER TABLE "PatientPackageUsage" ADD CONSTRAINT "PatientPackageUsage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("PatientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientPackageUsage" ADD CONSTRAINT "PatientPackageUsage_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientPackageUsage" ADD CONSTRAINT "PatientPackageUsage_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BillingItemChargeToPatientPackageUsage" ADD CONSTRAINT "_BillingItemChargeToPatientPackageUsage_A_fkey" FOREIGN KEY ("A") REFERENCES "BillingItemCharge"("BillingItemChargeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BillingItemChargeToPatientPackageUsage" ADD CONSTRAINT "_BillingItemChargeToPatientPackageUsage_B_fkey" FOREIGN KEY ("B") REFERENCES "PatientPackageUsage"("PatientPackageUsageId") ON DELETE CASCADE ON UPDATE CASCADE;
