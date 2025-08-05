/*
  Warnings:

  - Added the required column `blogPostSeedId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "blogPostSeedId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BlogPostSeed" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "cityId" TEXT NOT NULL,

    CONSTRAINT "BlogPostSeed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_blogPostSeedId_fkey" FOREIGN KEY ("blogPostSeedId") REFERENCES "BlogPostSeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostSeed" ADD CONSTRAINT "BlogPostSeed_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
