-- AlterTable
ALTER TABLE "ScheduledReport" ADD COLUMN     "HospitalId" INTEGER;

-- AddForeignKey
ALTER TABLE "ScheduledReport" ADD CONSTRAINT "ScheduledReport_HospitalId_fkey" FOREIGN KEY ("HospitalId") REFERENCES "Hospital"("HospitalId") ON DELETE SET NULL ON UPDATE CASCADE;
