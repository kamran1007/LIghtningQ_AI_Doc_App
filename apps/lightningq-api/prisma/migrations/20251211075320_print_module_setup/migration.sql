-- DropForeignKey
ALTER TABLE "CustomPrintSettings" DROP CONSTRAINT "CustomPrintSettings_printDetailId_fkey";

-- DropForeignKey
ALTER TABLE "PageSettings" DROP CONSTRAINT "PageSettings_printDetailId_fkey";

-- AddForeignKey
ALTER TABLE "PageSettings" ADD CONSTRAINT "PageSettings_printDetailId_fkey" FOREIGN KEY ("printDetailId") REFERENCES "PrintDetail"("PrintDetailId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPrintSettings" ADD CONSTRAINT "CustomPrintSettings_printDetailId_fkey" FOREIGN KEY ("printDetailId") REFERENCES "PrintDetail"("PrintDetailId") ON DELETE CASCADE ON UPDATE CASCADE;
