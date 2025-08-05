/*
  Warnings:

  - The primary key for the `EventTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventId` on the `EventTag` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `EventTag` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `EventTag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `EventTag` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `EventTag` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `EventTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_tagId_fkey";

-- DropIndex
DROP INDEX "EventTag_eventId_idx";

-- DropIndex
DROP INDEX "EventTag_tagId_idx";

-- AlterTable
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_pkey",
DROP COLUMN "eventId",
DROP COLUMN "tagId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "MusicTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMusicTag" (
    "eventId" TEXT NOT NULL,
    "musicTagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventMusicTag_pkey" PRIMARY KEY ("eventId","musicTagId")
);

-- CreateTable
CREATE TABLE "EventEventTag" (
    "eventId" TEXT NOT NULL,
    "eventTagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventEventTag_pkey" PRIMARY KEY ("eventId","eventTagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicTag_id_key" ON "MusicTag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MusicTag_name_key" ON "MusicTag"("name");

-- CreateIndex
CREATE INDEX "MusicTag_name_idx" ON "MusicTag"("name");

-- CreateIndex
CREATE INDEX "EventMusicTag_eventId_idx" ON "EventMusicTag"("eventId");

-- CreateIndex
CREATE INDEX "EventMusicTag_musicTagId_idx" ON "EventMusicTag"("musicTagId");

-- CreateIndex
CREATE UNIQUE INDEX "EventMusicTag_eventId_musicTagId_key" ON "EventMusicTag"("eventId", "musicTagId");

-- CreateIndex
CREATE INDEX "EventEventTag_eventId_idx" ON "EventEventTag"("eventId");

-- CreateIndex
CREATE INDEX "EventEventTag_eventTagId_idx" ON "EventEventTag"("eventTagId");

-- CreateIndex
CREATE UNIQUE INDEX "EventEventTag_eventId_eventTagId_key" ON "EventEventTag"("eventId", "eventTagId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTag_id_key" ON "EventTag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EventTag_name_key" ON "EventTag"("name");

-- CreateIndex
CREATE INDEX "EventTag_name_idx" ON "EventTag"("name");

-- AddForeignKey
ALTER TABLE "EventMusicTag" ADD CONSTRAINT "EventMusicTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMusicTag" ADD CONSTRAINT "EventMusicTag_musicTagId_fkey" FOREIGN KEY ("musicTagId") REFERENCES "MusicTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEventTag" ADD CONSTRAINT "EventEventTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEventTag" ADD CONSTRAINT "EventEventTag_eventTagId_fkey" FOREIGN KEY ("eventTagId") REFERENCES "EventTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
