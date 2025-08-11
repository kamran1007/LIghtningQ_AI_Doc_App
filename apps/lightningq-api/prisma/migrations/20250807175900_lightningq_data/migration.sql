-- CreateEnum
CREATE TYPE "AcuityLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

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

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WHATSAPP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'RETRYING');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "TreatmentSource" AS ENUM ('TYPED', 'DICTATED', 'SNIPPET');

-- CreateEnum
CREATE TYPE "FollowUpUnit" AS ENUM ('Days', 'Weeks', 'Months', 'Years');

-- CreateTable
CREATE TABLE "User" (
    "UserId" SERIAL NOT NULL,
    "Prefix" "Title" NOT NULL,
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
    "SpecializationId" INTEGER NOT NULL,
    "Experience" TEXT NOT NULL,
    "Employee_ID" TEXT NOT NULL,
    "SignatureOfUser" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "HospitalName" TEXT NOT NULL,
    "HospitalCode" TEXT NOT NULL,
    "ParentHospitalCode" TEXT NOT NULL,
    "Organizationcode" TEXT NOT NULL,
    "SpecializationType" "SpecializationType" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
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
    "UserId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,

    CONSTRAINT "UserHospitalAccess_pkey" PRIMARY KEY ("UserHospitalAccessId")
);

-- CreateTable
CREATE TABLE "DoctorTimeSlotHistory" (
    "DoctorTimeSlotHistoryId" SERIAL NOT NULL,
    "DoctorTimeSlotId" INTEGER,
    "userId" INTEGER NOT NULL,
    "HospitalId" INTEGER NOT NULL,
    "DayOfWeek" TEXT NOT NULL,
    "Morning_From" TEXT,
    "Morning_To" TEXT,
    "Evening_From" TEXT,
    "Evening_To" TEXT,
    "consult_Time_InMin" INTEGER NOT NULL,
    "Accept_Appointment_Selected_Date" BOOLEAN NOT NULL,
    "is_DND" BOOLEAN NOT NULL,
    "is_SlotCancelled" BOOLEAN NOT NULL,
    "isPermanentCancelled" BOOLEAN NOT NULL,
    "DNDremarks" TEXT,
    "Slot_cancellation_remarks" TEXT,
    "isDeleted" BOOLEAN NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "isBooked" BOOLEAN NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL,
    "isRejected" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" INTEGER NOT NULL,
    "isSlotChanged" BOOLEAN,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,

    CONSTRAINT "DoctorTimeSlotHistory_pkey" PRIMARY KEY ("DoctorTimeSlotHistoryId")
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
CREATE TABLE "DoctorTimeSlot" (
    "DoctorTimeSlotId" SERIAL NOT NULL,
    "DoctorId" INTEGER NOT NULL,
    "HospitalId" INTEGER NOT NULL,
    "DayOfWeek" TEXT NOT NULL,
    "Morning_From" TEXT,
    "Morning_To" TEXT,
    "Evening_From" TEXT,
    "Evening_To" TEXT,
    "consult_Time_InMin" INTEGER NOT NULL DEFAULT 15,
    "Accept_Appointment_Selected_Date" BOOLEAN NOT NULL DEFAULT true,
    "is_DND" BOOLEAN NOT NULL DEFAULT false,
    "is_SlotCancelled" BOOLEAN NOT NULL DEFAULT false,
    "DNDremarks" TEXT,
    "Slot_cancellation_remarks" TEXT,
    "isSlotChanged" BOOLEAN NOT NULL DEFAULT false,
    "isPermanentCancelled" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isRejected" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorTimeSlot_pkey" PRIMARY KEY ("DoctorTimeSlotId")
);

-- CreateTable
CREATE TABLE "DoctorSlot" (
    "DoctorSlotId" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "DoctorTimeSlotId" INTEGER NOT NULL,
    "slotDate" TIMESTAMP(3),
    "slotTime" TEXT,
    "dayOfWeek" TEXT,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "appointmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorSlot_pkey" PRIMARY KEY ("DoctorSlotId")
);

-- CreateTable
CREATE TABLE "DoctorCosting" (
    "DoctorCostingId" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "walkInFee" DOUBLE PRECISION NOT NULL,
    "teleConsultFee" DOUBLE PRECISION,
    "fastTrackFee" DOUBLE PRECISION,
    "homeVisitFee" DOUBLE PRECISION,
    "emergencyFee" DOUBLE PRECISION,
    "procedureFee" DOUBLE PRECISION,
    "freeFollowupCount" INTEGER,
    "followupValidityDays" INTEGER,
    "tax" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,
    "commission" DOUBLE PRECISION,
    "discountedFee" DOUBLE PRECISION,
    "totalFee" DOUBLE PRECISION,
    "doctorPayout" DOUBLE PRECISION,
    "insuranceApplicable" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,

    CONSTRAINT "DoctorCosting_pkey" PRIMARY KEY ("DoctorCostingId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "AuditLogId" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
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
CREATE TABLE "Patient" (
    "PatientId" SERIAL NOT NULL,
    "Patient_Medical_Record_No" TEXT,
    "profileImageUrl" TEXT,
    "Prefix" "Title" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "GenderType",
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
    "bloodGroup" "BloodGroup",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "HospitalId" INTEGER NOT NULL,
    "OrganizationId" INTEGER NOT NULL,

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
    "consultationId" INTEGER,
    "PatientId" INTEGER NOT NULL,
    "DoctorId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "visitTypeId" INTEGER NOT NULL,
    "acuity" "AcuityLevel" NOT NULL,
    "AssignedProviderId" INTEGER,
    "SpecializationId" INTEGER,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "RescheduleReason" TEXT,
    "cancellationReason" TEXT,
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "rescheduledAt" TIMESTAMP(3),
    "rescheduledDate" TIMESTAMP(3),
    "rescheduledBy" INTEGER,
    "TagPatientId" INTEGER,
    "paymentHistoryId" INTEGER,
    "paymentTypeId" INTEGER NOT NULL,
    "sendWhatsappMessage" BOOLEAN NOT NULL DEFAULT false,
    "sendSmsMessage" BOOLEAN NOT NULL DEFAULT false,
    "sendEmailMessage" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("AppointmentId")
);

-- CreateTable
CREATE TABLE "AppointmentNotification" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "channel" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "response" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "ConsultationId" SERIAL NOT NULL,
    "AppointmentId" INTEGER NOT NULL,
    "consultationDatTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultationEndDateTime" TIMESTAMP(3),
    "CheifcomplaintNotes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "IsconsultationCompleted" BOOLEAN DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,
    "updatedById" INTEGER,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("ConsultationId")
);

-- CreateTable
CREATE TABLE "Vitals" (
    "VitalsId" SERIAL NOT NULL,
    "AppointmentId" INTEGER NOT NULL,
    "Systolic" INTEGER,
    "Diastolic" INTEGER,
    "Weight" DOUBLE PRECISION,
    "Temperature" DOUBLE PRECISION,
    "HeartRate" INTEGER,
    "OxygenSaturation" DOUBLE PRECISION,
    "Height" DOUBLE PRECISION,
    "BloodGroup" "BloodGroup",
    "BMI" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,

    CONSTRAINT "Vitals_pkey" PRIMARY KEY ("VitalsId")
);

-- CreateTable
CREATE TABLE "VitalsHistory" (
    "VitalsHistoryId" SERIAL NOT NULL,
    "VitalsId" INTEGER NOT NULL,
    "AppointmentId" INTEGER NOT NULL,
    "Systolic" INTEGER,
    "Diastolic" INTEGER,
    "Weight" DOUBLE PRECISION,
    "Temperature" DOUBLE PRECISION,
    "HeartRate" INTEGER,
    "OxygenSaturation" DOUBLE PRECISION,
    "Height" DOUBLE PRECISION,
    "BloodGroup" "BloodGroup",
    "BMI" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedById" INTEGER,

    CONSTRAINT "VitalsHistory_pkey" PRIMARY KEY ("VitalsHistoryId")
);

-- CreateTable
CREATE TABLE "ChiefComplaintTag" (
    "ChiefComplaintTagId" SERIAL NOT NULL,
    "ChiefComplainTagName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specializationId" INTEGER NOT NULL,

    CONSTRAINT "ChiefComplaintTag_pkey" PRIMARY KEY ("ChiefComplaintTagId")
);

-- CreateTable
CREATE TABLE "ConsultationCheifComplaint" (
    "ConsultationComplaintId" SERIAL NOT NULL,
    "ConsultationId" INTEGER NOT NULL,
    "ChiefComplaintTagId" INTEGER NOT NULL,

    CONSTRAINT "ConsultationCheifComplaint_pkey" PRIMARY KEY ("ConsultationComplaintId")
);

-- CreateTable
CREATE TABLE "InvestigationType" (
    "InvestigationTypeId" SERIAL NOT NULL,
    "InvestigationTypeName" TEXT NOT NULL,
    "InvestigationTypeColorCode" TEXT,

    CONSTRAINT "InvestigationType_pkey" PRIMARY KEY ("InvestigationTypeId")
);

-- CreateTable
CREATE TABLE "InvestigationSubType" (
    "InvestigationSubTypeId" SERIAL NOT NULL,
    "InvestigationSubTypename" TEXT NOT NULL,
    "InvestigationTypeId" INTEGER NOT NULL,

    CONSTRAINT "InvestigationSubType_pkey" PRIMARY KEY ("InvestigationSubTypeId")
);

-- CreateTable
CREATE TABLE "ConsultationInvestigation" (
    "ConsultationInvestigationId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "InvestigationTypeId" INTEGER NOT NULL,
    "InvestigationSubTypeId" INTEGER NOT NULL,
    "ConsultationInvestigatRemark" TEXT,

    CONSTRAINT "ConsultationInvestigation_pkey" PRIMARY KEY ("ConsultationInvestigationId")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "MedicineId" SERIAL NOT NULL,
    "MedicineName" TEXT NOT NULL,
    "OnlyMedicineName" TEXT NOT NULL,
    "Strength" TEXT,
    "Units" TEXT,
    "MedicineUnitId" INTEGER,
    "ScheduleType" TEXT,
    "MedicineTypeName" TEXT,
    "MedicineType" INTEGER,
    "HSNCode" TEXT,
    "Instructions" TEXT,
    "GenericName" TEXT,
    "ScheduleTypeId" INTEGER,
    "UserId" INTEGER,
    "AvailableStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "HospitalId" INTEGER,
    "pharmacyPrice" DOUBLE PRECISION DEFAULT 0,
    "CategoryId" INTEGER,
    "IsFrequent" TEXT DEFAULT 'N',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("MedicineId")
);

-- CreateTable
CREATE TABLE "ConsultationMedication" (
    "ConsultationMedicationId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "medicationId" INTEGER,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "ConsultationMedication_pkey" PRIMARY KEY ("ConsultationMedicationId")
);

-- CreateTable
CREATE TABLE "ClinicalNote" (
    "ClinicalNoteId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ClinicalNote_pkey" PRIMARY KEY ("ClinicalNoteId")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "DiagnosisId" SERIAL NOT NULL,
    "DiagnosisName" TEXT NOT NULL,
    "icdCode" TEXT,
    "specializationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("DiagnosisId")
);

-- CreateTable
CREATE TABLE "ConsultationDiagnosis" (
    "ConsultationDiagnosisId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "diagnosisId" INTEGER NOT NULL,
    "DiagnosisRemark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationDiagnosis_pkey" PRIMARY KEY ("ConsultationDiagnosisId")
);

-- CreateTable
CREATE TABLE "Procedure" (
    "ProcedureId" SERIAL NOT NULL,
    "ProcedureName" TEXT NOT NULL,
    "ProcedureCode" TEXT,
    "specializationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("ProcedureId")
);

-- CreateTable
CREATE TABLE "ConsultationProcedure" (
    "ConsultationProcedureId" SERIAL NOT NULL,
    "consultationId" INTEGER,
    "Description" TEXT,
    "ProcedureId" INTEGER,
    "specializationId" INTEGER,
    "PatientId" INTEGER,
    "DoctorId" INTEGER,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" INTEGER,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationProcedure_pkey" PRIMARY KEY ("ConsultationProcedureId")
);

-- CreateTable
CREATE TABLE "ConsultationTreatment" (
    "ConsultationTreatmentId" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "source" "TreatmentSource" NOT NULL,
    "treatmentText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationTreatment_pkey" PRIMARY KEY ("ConsultationTreatmentId")
);

-- CreateTable
CREATE TABLE "ConsultationFollowUpPlan" (
    "id" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "followUpText" TEXT,
    "duration" INTEGER,
    "unit" "FollowUpUnit",
    "nextDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationFollowUpPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentType" (
    "AppointmentTypeId" SERIAL NOT NULL,
    "AppointmentTypeName" TEXT NOT NULL,

    CONSTRAINT "AppointmentType_pkey" PRIMARY KEY ("AppointmentTypeId")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "PaymentHistoryId" SERIAL NOT NULL,
    "TransactionId" BIGINT NOT NULL,
    "Transaction_DateTime" TIMESTAMP(3) NOT NULL,
    "AppointmentChargesPaid" DOUBLE PRECISION,
    "isAmountPaid" BOOLEAN DEFAULT true,
    "paymentTypePaymentTypeId" INTEGER NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("PaymentHistoryId")
);

-- CreateTable
CREATE TABLE "PaymentType" (
    "PaymentTypeId" SERIAL NOT NULL,
    "PaymentTypeName" TEXT NOT NULL,

    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("PaymentTypeId")
);

-- CreateTable
CREATE TABLE "_UserHospitals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserHospitals_AB_pkey" PRIMARY KEY ("A","B")
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

-- CreateTable
CREATE TABLE "_AppointmentToTagPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AppointmentToTagPatient_AB_pkey" PRIMARY KEY ("A","B")
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
CREATE UNIQUE INDEX "DoctorSlot_doctorId_slotDate_slotTime_key" ON "DoctorSlot"("doctorId", "slotDate", "slotTime");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorCosting_doctorId_hospitalId_key" ON "DoctorCosting"("doctorId", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Rolename_key" ON "Role"("Rolename");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_RoleId_permissionId_key" ON "RolePermission"("RoleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_Name_key" ON "Permission"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_SpecializationName_key" ON "Specialization"("SpecializationName");

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
CREATE UNIQUE INDEX "Appointment_consultationId_key" ON "Appointment"("consultationId");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_AppointmentId_key" ON "Consultation"("AppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Vitals_AppointmentId_key" ON "Vitals"("AppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ChiefComplaintTag_ChiefComplainTagName_key" ON "ChiefComplaintTag"("ChiefComplainTagName");

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationType_InvestigationTypeName_key" ON "InvestigationType"("InvestigationTypeName");

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationSubType_InvestigationSubTypename_Investigation_key" ON "InvestigationSubType"("InvestigationSubTypename", "InvestigationTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsultationFollowUpPlan_consultationId_key" ON "ConsultationFollowUpPlan"("consultationId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentType_AppointmentTypeName_key" ON "AppointmentType"("AppointmentTypeName");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentType_PaymentTypeName_key" ON "PaymentType"("PaymentTypeName");

-- CreateIndex
CREATE INDEX "_UserHospitals_B_index" ON "_UserHospitals"("B");

-- CreateIndex
CREATE INDEX "_PatientTagPatient_B_index" ON "_PatientTagPatient"("B");

-- CreateIndex
CREATE INDEX "_PatientAllergies_B_index" ON "_PatientAllergies"("B");

-- CreateIndex
CREATE INDEX "_PatientLanguages_B_index" ON "_PatientLanguages"("B");

-- CreateIndex
CREATE INDEX "_PatientMedicalHistory_B_index" ON "_PatientMedicalHistory"("B");

-- CreateIndex
CREATE INDEX "_AppointmentToTagPatient_B_index" ON "_AppointmentToTagPatient"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("RoleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_SpecializationId_fkey" FOREIGN KEY ("SpecializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("RoleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTimeSlot" ADD CONSTRAINT "DoctorTimeSlot_DoctorId_fkey" FOREIGN KEY ("DoctorId") REFERENCES "User"("UserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTimeSlot" ADD CONSTRAINT "DoctorTimeSlot_HospitalId_fkey" FOREIGN KEY ("HospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSlot" ADD CONSTRAINT "DoctorSlot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSlot" ADD CONSTRAINT "DoctorSlot_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSlot" ADD CONSTRAINT "DoctorSlot_DoctorTimeSlotId_fkey" FOREIGN KEY ("DoctorTimeSlotId") REFERENCES "DoctorTimeSlot"("DoctorTimeSlotId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCosting" ADD CONSTRAINT "DoctorCosting_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCosting" ADD CONSTRAINT "DoctorCosting_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCosting" ADD CONSTRAINT "DoctorCosting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginSession" ADD CONSTRAINT "LoginSession_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("RoleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("PermissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_HospitalId_fkey" FOREIGN KEY ("HospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentHistoryId_fkey" FOREIGN KEY ("paymentHistoryId") REFERENCES "PaymentHistory"("PaymentHistoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentNotification" ADD CONSTRAINT "AppointmentNotification_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_AppointmentId_fkey" FOREIGN KEY ("AppointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_AppointmentId_fkey" FOREIGN KEY ("AppointmentId") REFERENCES "Appointment"("AppointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalsHistory" ADD CONSTRAINT "VitalsHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiefComplaintTag" ADD CONSTRAINT "ChiefComplaintTag_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationCheifComplaint" ADD CONSTRAINT "ConsultationCheifComplaint_ConsultationId_fkey" FOREIGN KEY ("ConsultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationCheifComplaint" ADD CONSTRAINT "ConsultationCheifComplaint_ChiefComplaintTagId_fkey" FOREIGN KEY ("ChiefComplaintTagId") REFERENCES "ChiefComplaintTag"("ChiefComplaintTagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationSubType" ADD CONSTRAINT "InvestigationSubType_InvestigationTypeId_fkey" FOREIGN KEY ("InvestigationTypeId") REFERENCES "InvestigationType"("InvestigationTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_InvestigationTypeId_fkey" FOREIGN KEY ("InvestigationTypeId") REFERENCES "InvestigationType"("InvestigationTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationInvestigation" ADD CONSTRAINT "ConsultationInvestigation_InvestigationSubTypeId_fkey" FOREIGN KEY ("InvestigationSubTypeId") REFERENCES "InvestigationSubType"("InvestigationSubTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationMedication" ADD CONSTRAINT "ConsultationMedication_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationMedication" ADD CONSTRAINT "ConsultationMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medicine"("MedicineId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationDiagnosis" ADD CONSTRAINT "ConsultationDiagnosis_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationDiagnosis" ADD CONSTRAINT "ConsultationDiagnosis_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "Diagnosis"("DiagnosisId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationProcedure" ADD CONSTRAINT "ConsultationProcedure_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationProcedure" ADD CONSTRAINT "ConsultationProcedure_ProcedureId_fkey" FOREIGN KEY ("ProcedureId") REFERENCES "Procedure"("ProcedureId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationTreatment" ADD CONSTRAINT "ConsultationTreatment_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationFollowUpPlan" ADD CONSTRAINT "ConsultationFollowUpPlan_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("ConsultationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_paymentTypePaymentTypeId_fkey" FOREIGN KEY ("paymentTypePaymentTypeId") REFERENCES "PaymentType"("PaymentTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHospitals" ADD CONSTRAINT "_UserHospitals_A_fkey" FOREIGN KEY ("A") REFERENCES "Hospital"("HospitalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHospitals" ADD CONSTRAINT "_UserHospitals_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("UserId") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_AppointmentToTagPatient" ADD CONSTRAINT "_AppointmentToTagPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("AppointmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToTagPatient" ADD CONSTRAINT "_AppointmentToTagPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "TagPatient"("TagPatientId") ON DELETE CASCADE ON UPDATE CASCADE;
