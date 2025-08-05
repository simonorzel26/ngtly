/*
  Warnings:

  - You are about to drop the column `stripeClientSecret` on the `PromotedEvent` table. All the data in the column will be lost.
  - Added the required column `stripePaymentId` to the `PromotedEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromotedEvent" DROP COLUMN "stripeClientSecret",
ADD COLUMN     "stripePaymentId" TEXT NOT NULL;
