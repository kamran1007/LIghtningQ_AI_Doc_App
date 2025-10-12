-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_SpecializationId_fkey";

-- CreateTable
CREATE TABLE "_Specialist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Specialist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Specialist_B_index" ON "_Specialist"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_SpecializationId_fkey" FOREIGN KEY ("SpecializationId") REFERENCES "Specialization"("SpecializationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Specialist" ADD CONSTRAINT "_Specialist_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("AppointmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Specialist" ADD CONSTRAINT "_Specialist_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("UserId") ON DELETE CASCADE ON UPDATE CASCADE;
