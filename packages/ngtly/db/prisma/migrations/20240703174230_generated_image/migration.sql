-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "generatedImage" TEXT,
ADD COLUMN     "imageInQueue" BOOLEAN NOT NULL DEFAULT false;
