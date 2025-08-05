/*
  Warnings:

  - Added the required column `longTailKeyword` to the `BlogPostSeed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPostSeed" ADD COLUMN     "longTailKeyword" TEXT NOT NULL;
