/*
  Warnings:

  - A unique constraint covering the columns `[urlSlug]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlSlug` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "urlSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Club_urlSlug_key" ON "Club"("urlSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Club_url_key" ON "Club"("url");
