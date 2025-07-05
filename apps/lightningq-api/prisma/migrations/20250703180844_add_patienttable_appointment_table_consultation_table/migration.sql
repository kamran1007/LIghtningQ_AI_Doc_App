-- CreateEnum
CREATE TYPE "AcuityLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- CreateTable
CREATE TABLE "Patient" (
    "PatientId" SERIAL NOT NULL,
    "Patient_Medical_Record_No" TEXT NOT NULL,
    "Prefix" "Title" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "isQuickRegistered" BOOLEAN NOT NULL DEFAULT false,
    "mobile" TEXT NOT NULL,
    "altContactNumber" TEXT,
    "email" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "area" TEXT,
    "city" TEXT NOT NULL,
    "cityId" TEXT,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "postalCode" INTEGER NOT NULL,
    "landmark" TEXT,
    "taluka" TEXT,
    "emergencyName" TEXT,
    "emergencyContact" TEXT,
    "emergencyRelation" TEXT,
    "kinName" TEXT,
    "kinContact" TEXT,
    "kinRelation" TEXT,
    "profileImageUrl" TEXT,
    "bloodGroup" "BloodGroup" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("PatientId")
);

-- CreateTable
CREATE TABLE "TagPatient" (
    "TagPatientId" SERIAL NOT NULL,
    "TagPatientName" TEXT NOT NULL,

    CONSTRAINT "TagPatient_pkey" PRIMARY KEY ("TagPatientId")
);

-- CreateTable
CREATE TABLE "Allergy" (
    "AllergyId" SERIAL NOT NULL,
    "AllergyName" TEXT NOT NULL,
    "duration" TEXT,
    "Remark" TEXT NOT NULL,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("AllergyId")
);

-- CreateTable
CREATE TABLE "Language" (
    "LanguageId" SERIAL NOT NULL,
    "LanguageName" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("LanguageId")
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "MedicalHistoryId" SERIAL NOT NULL,
    "MedicalHistoryName" TEXT NOT NULL,
    "duration" TEXT,
    "Remark" TEXT NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("MedicalHistoryId")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "AppointmentId" SERIAL NOT NULL,
    "PatientId" INTEGER NOT NULL,
    "DoctorId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "visitTypeId" INTEGER NOT NULL,
    "paymentTypeId" INTEGER NOT NULL,
    "acuity" "AcuityLevel" NOT NULL,
    "AssignedProviderId" INTEGER,
    "SpecializationId" INTEGER,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "rescheduledAt" TIMESTAMP(3),
    "rescheduledBy" INTEGER,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("AppointmentId")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "ConsultationId" SERIAL NOT NULL,
    "AppointmentId" INTEGER NOT NULL,
    "consultationDatTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultationEndDateTime" TIMESTAMP(3),
    "notes" TEXT,
    "diagnosis" TEXT,
    "followUpDate" TIMESTAMP(3),
    "isDraft" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("ConsultationId")
);

-- CreateTable
CREATE TABLE "Vitals" (
    "VitalsId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "BloodPressure" TEXT,
    "PulseRate" INTEGER,
    "Temperature" DOUBLE PRECISION,
    "Weight" DOUBLE PRECISION,
    "Height" DOUBLE PRECISION,
    "SpO2" DOUBLE PRECISION,
    "BloodGroup" DOUBLE PRECISION,
    "BMI" DOUBLE PRECISION,

    CONSTRAINT "Vitals_pkey" PRIMARY KEY ("VitalsId")
);

-- CreateTable
CREATE TABLE "MedicationRecord" (
    "MedicationRecordId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "MedicationRecord_pkey" PRIMARY KEY ("MedicationRecordId")
);

-- CreateTable
CREATE TABLE "ClinicalNote" (
    "ClinicalNoteId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ClinicalNote_pkey" PRIMARY KEY ("ClinicalNoteId")
);

-- CreateTable
CREATE TABLE "AppointmentType" (
    "AppointmentTypeId" SERIAL NOT NULL,
    "AppointmentTypeName" TEXT NOT NULL,

    CONSTRAINT "AppointmentType_pkey" PRIMARY KEY ("AppointmentTypeId")
);

-- CreateTable
CREATE TABLE "PaymentType" (
    "PaymentTypeId" SERIAL NOT NULL,
    "TransactionId" INTEGER NOT NULL,
    "Transaction_DateTime" TIMESTAMP(3) NOT NULL,
    "PaymentTypeName" TEXT NOT NULL,

    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("PaymentTypeId")
);

-- CreateTable
CREATE TABLE "Surgery" (
    "SurgeryId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "surgeryType" TEXT NOT NULL,
    "surgeonId" INTEGER NOT NULL,
    "surgeryDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Surgery_pkey" PRIMARY KEY ("SurgeryId")
);

-- CreateTable
CREATE TABLE "_PatientTagPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PatientTagPatient_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PatientAllergies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PatientAllergies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PatientLanguages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PatientLanguages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PatientMedicalHistory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PatientMedicalHistory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_Patient_Medical_Record_No_key" ON "Patient"("Patient_Medical_Record_No");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mobile_key" ON "Patient"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TagPatient_TagPatientName_key" ON "TagPatient"("TagPatientName");

-- CreateIndex
CREATE UNIQUE INDEX "Allergy_AllergyName_key" ON "Allergy"("AllergyName");

-- CreateIndex
CREATE UNIQUE INDEX "Language_LanguageName_key" ON "Language"("LanguageName");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalHistory_MedicalHistoryName_key" ON "MedicalHistory"("MedicalHistoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_AppointmentId_key" ON "Consultation"("AppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Vitals_consultationId_key" ON "Vitals"("consultationId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentType_AppointmentTypeName_key" ON "AppointmentType"("AppointmentTypeName");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentType_PaymentTypeName_key" ON "PaymentType"("PaymentTypeName");

-- CreateIndex
CREATE UNIQUE INDEX "Surgery_consultationId_key" ON "Surgery"("consultationId");

-- CreateIndex
CREATE INDEX "_PatientTagPatient_B_index" ON "_PatientTagPatient"("B");

-- CreateIndex
CREATE INDEX "_PatientAllergies_B_index" ON "_PatientAllergies"("B");

-- CreateIndex
CREATE INDEX "_PatientLanguages_B_index" ON "_PatientLanguages"("B");

-- CreateIndex
CREATE INDEX "_PatientMedicalHistory_B_index" ON "_PatientMedicalHistory"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_PatientId_fkey" FOREIGN KEY ("PatientId") REFERENCES "Patient"("PatientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_DoctorId_fkey" FOREIGN KEY ("DoctorId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_AssignedProviderId_fkey" FOREIGN KEY ("AssignedProviderId") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_SpecializationId_fkey" FOREIGN KEY ("SpecializationId") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_rescheduledBy_fkey" FOREIGN KEY ("rescheduledBy") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_visitTypeId_fkey" FOREIGN KEY ("visitTypeId") REFERENCES "AppointmentType"("AppointmentTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentTypeId_fkey" FOREIGN KEY ("paymentTypeId") REFERENCES "PaymentType"("PaymentTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_AppointmentId_fkey" FOREIGN KEY ("AppointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationRecord" ADD CONSTRAINT "MedicationRecord_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientTagPatient" ADD CONSTRAINT "_PatientTagPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Patient"("PatientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientTagPatient" ADD CONSTRAINT "_PatientTagPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "TagPatient"("TagPatientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientAllergies" ADD CONSTRAINT "_PatientAllergies_A_fkey" FOREIGN KEY ("A") REFERENCES "Allergy"("AllergyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientAllergies" ADD CONSTRAINT "_PatientAllergies_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("PatientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientLanguages" ADD CONSTRAINT "_PatientLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "Language"("LanguageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientLanguages" ADD CONSTRAINT "_PatientLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("PatientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientMedicalHistory" ADD CONSTRAINT "_PatientMedicalHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "MedicalHistory"("MedicalHistoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientMedicalHistory" ADD CONSTRAINT "_PatientMedicalHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("PatientId") ON DELETE CASCADE ON UPDATE CASCADE;
