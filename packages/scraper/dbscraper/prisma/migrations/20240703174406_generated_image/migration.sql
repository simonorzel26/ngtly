/*
  Warnings:

  - You are about to drop the column `gptResponseId` on the `Html` table. All the data in the column will be lost.
  - You are about to drop the column `readyToBatch` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `GptResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Html" DROP CONSTRAINT "Html_gptResponseId_fkey";

-- DropIndex
DROP INDEX "Html_gptResponseId_key";

-- AlterTable
ALTER TABLE "Html" DROP COLUMN "gptResponseId";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "readyToBatch";

-- DropTable
DROP TABLE "GptResponse";
