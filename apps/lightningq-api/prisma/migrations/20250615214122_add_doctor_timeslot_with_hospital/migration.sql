-- CreateTable
CREATE TABLE "DoctorTimeSlot" (
    "DoctorTimeSlotId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
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
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isRejected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorTimeSlot_pkey" PRIMARY KEY ("DoctorTimeSlotId")
);

-- AddForeignKey
ALTER TABLE "DoctorTimeSlot" ADD CONSTRAINT "DoctorTimeSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("UserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTimeSlot" ADD CONSTRAINT "DoctorTimeSlot_HospitalId_fkey" FOREIGN KEY ("HospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE CASCADE ON UPDATE CASCADE;
