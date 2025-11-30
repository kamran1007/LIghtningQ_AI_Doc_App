-- CreateTable
CREATE TABLE "BillingHistoryDetails" (
    "HistoryDetailsId" SERIAL NOT NULL,
    "BillingHistoryId" INTEGER NOT NULL,
    "BilledCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "TotalAmountReceived" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "InvoiceId" TEXT NOT NULL,
    "OldInvoiceId" TEXT,
    "ReceiptId" TEXT,
    "ReceiptNo" TEXT,
    "BillingRemarks" TEXT,
    "TotalRoundOff" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "RoundOffType" TEXT,
    "CreatedDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedByName" TEXT,
    "HospitalId" INTEGER NOT NULL,
    "BranchName" TEXT,
    "BranchMobile" TEXT,
    "BranchEmail" TEXT,
    "BranchPincode" TEXT,
    "Address1" TEXT,
    "Address2" TEXT,
    "Address3" TEXT,
    "GSTNo" TEXT,
    "AreaCode" TEXT,
    "deleteInd" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BillingHistoryDetails_pkey" PRIMARY KEY ("HistoryDetailsId")
);

-- CreateTable
CREATE TABLE "HistoryPaymentInfo" (
    "HistoryPaymentInfoId" SERIAL NOT NULL,
    "BillingHistoryDetailsId" INTEGER NOT NULL,
    "PaymentModeId" INTEGER,
    "PaymentModeName" TEXT,
    "BankName" TEXT,
    "CardNumber" TEXT,
    "TransactionNumber" TEXT,
    "CardTypeId" INTEGER,
    "CardType" TEXT,
    "Amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ChequeNumber" TEXT,
    "NameOnCard" TEXT,
    "ValidTill" TEXT,
    "DisallowanceAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ModifiedBy" TEXT,
    "InsuranceAdvanceAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "PaymentReceiptNo" TEXT,

    CONSTRAINT "HistoryPaymentInfo_pkey" PRIMARY KEY ("HistoryPaymentInfoId")
);

-- AddForeignKey
ALTER TABLE "BillingHistoryDetails" ADD CONSTRAINT "BillingHistoryDetails_BillingHistoryId_fkey" FOREIGN KEY ("BillingHistoryId") REFERENCES "BillingHistory"("BillingHistoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryPaymentInfo" ADD CONSTRAINT "HistoryPaymentInfo_BillingHistoryDetailsId_fkey" FOREIGN KEY ("BillingHistoryDetailsId") REFERENCES "BillingHistoryDetails"("HistoryDetailsId") ON DELETE RESTRICT ON UPDATE CASCADE;
