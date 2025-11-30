-- AlterTable
ALTER TABLE "BillingItemCharge" ADD COLUMN     "doctorId" INTEGER,
ADD COLUMN     "fastTrackCharges" DECIMAL(10,2),
ADD COLUMN     "followupValidity" INTEGER DEFAULT 0,
ADD COLUMN     "numberOfFollowups" INTEGER DEFAULT 0,
ADD COLUMN     "telePrice" DECIMAL(10,2),
ADD COLUMN     "walkinPrice" DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "BillingItemCharge" ADD CONSTRAINT "BillingItemCharge_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;
