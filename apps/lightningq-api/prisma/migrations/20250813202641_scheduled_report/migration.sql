-- CreateTable
CREATE TABLE "ScheduledReport" (
    "ScheduledReportId" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "reportTypes" TEXT[],
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledReport_pkey" PRIMARY KEY ("ScheduledReportId")
);

-- AddForeignKey
ALTER TABLE "ScheduledReport" ADD CONSTRAINT "ScheduledReport_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;
