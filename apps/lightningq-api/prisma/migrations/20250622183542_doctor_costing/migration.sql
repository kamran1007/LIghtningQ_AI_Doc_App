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
    "insuranceApplicable" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorCosting_pkey" PRIMARY KEY ("DoctorCostingId")
);

-- AddForeignKey
ALTER TABLE "DoctorCosting" ADD CONSTRAINT "DoctorCosting_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCosting" ADD CONSTRAINT "DoctorCosting_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;
