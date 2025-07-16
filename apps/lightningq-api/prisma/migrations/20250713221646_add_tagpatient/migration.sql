-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "TagPatientId" INTEGER;

-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "TotalAppntAmount" DOUBLE PRECISION,
ADD COLUMN     "isAmountPaid" BOOLEAN DEFAULT true;

-- CreateTable
CREATE TABLE "_AppointmentToTagPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AppointmentToTagPatient_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AppointmentToTagPatient_B_index" ON "_AppointmentToTagPatient"("B");

-- AddForeignKey
ALTER TABLE "_AppointmentToTagPatient" ADD CONSTRAINT "_AppointmentToTagPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("AppointmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToTagPatient" ADD CONSTRAINT "_AppointmentToTagPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "TagPatient"("TagPatientId") ON DELETE CASCADE ON UPDATE CASCADE;
