-- AlterTable
ALTER TABLE "UserHospitalAccess" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "UserHospitalAccess" ADD CONSTRAINT "UserHospitalAccess_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;
