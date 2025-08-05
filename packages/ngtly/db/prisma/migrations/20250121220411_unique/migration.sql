/*
  Warnings:

  - A unique constraint covering the columns `[blogPostSeedId]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cityId,language,longTailKeyword]` on the table `BlogPostSeed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_blogPostSeedId_key" ON "BlogPost"("blogPostSeedId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostSeed_cityId_language_longTailKeyword_key" ON "BlogPostSeed"("cityId", "language", "longTailKeyword");
