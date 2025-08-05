/*
  Warnings:

  - The primary key for the `EventTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EventTag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "EventTag_pkey" PRIMARY KEY ("eventId", "tagId");

-- CreateIndex
CREATE INDEX "EventTag_eventId_idx" ON "EventTag"("eventId");

-- CreateIndex
CREATE INDEX "EventTag_tagId_idx" ON "EventTag"("tagId");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
