-- CreateTable
CREATE TABLE "BillingHistory" (
    "BillingHistoryId" SERIAL NOT NULL,
    "BillingTransactionId" INTEGER NOT NULL,
    "historyType" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "remarks" TEXT,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingHistory_pkey" PRIMARY KEY ("BillingHistoryId")
);

-- AddForeignKey
ALTER TABLE "BillingHistory" ADD CONSTRAINT "BillingHistory_BillingTransactionId_fkey" FOREIGN KEY ("BillingTransactionId") REFERENCES "BillingTransaction"("BillingTransactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingHistory" ADD CONSTRAINT "BillingHistory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("UserId") ON DELETE SET NULL ON UPDATE CASCADE;
