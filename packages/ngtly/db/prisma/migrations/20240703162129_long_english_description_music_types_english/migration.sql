-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "longEnglishDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "musicTypesEnglish" TEXT[];
