/*
  Warnings:

  - Added the required column `stripeClientSecret` to the `PromotedEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromotedEvent" ADD COLUMN     "stripeClientSecret" TEXT NOT NULL;
