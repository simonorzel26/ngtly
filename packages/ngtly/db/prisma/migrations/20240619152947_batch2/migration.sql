/*
  Warnings:

  - The `batchStatus` column on the `BatchAwaiter` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BatchAwaiter" DROP COLUMN "batchStatus",
ADD COLUMN     "batchStatus" TEXT NOT NULL DEFAULT 'validating';

-- DropEnum
DROP TYPE "BatchStatus";
