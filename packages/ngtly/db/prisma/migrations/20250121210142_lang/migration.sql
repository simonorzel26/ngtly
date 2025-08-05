-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN');

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'EN';
