-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "clerkUserID" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clerkUserID" TEXT,
ADD COLUMN     "customerAddress" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerOrgNr" TEXT,
ADD COLUMN     "vatRate" INTEGER DEFAULT 25;
