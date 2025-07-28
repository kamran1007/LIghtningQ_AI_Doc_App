-- AlterTable
ALTER TABLE "ConsultationMedication" ADD COLUMN     "medicationId" INTEGER;

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

-- AddForeignKey
ALTER TABLE "ConsultationMedication" ADD CONSTRAINT "ConsultationMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medicine"("MedicineId") ON DELETE SET NULL ON UPDATE CASCADE;
