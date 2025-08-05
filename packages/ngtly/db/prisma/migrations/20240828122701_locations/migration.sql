/*
  Warnings:

  - A unique constraint covering the columns `[locationId]` on the table `Club` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "locationId" TEXT;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "streetNumber" TEXT,
    "street" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "administrativeAreaLevel1" TEXT,
    "administrativeAreaLevel2" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "placeId" TEXT NOT NULL,
    "types" TEXT[],
    "locationType" TEXT NOT NULL,
    "viewportNortheastLat" DOUBLE PRECISION,
    "viewportNortheastLng" DOUBLE PRECISION,
    "viewportSouthwestLat" DOUBLE PRECISION,
    "viewportSouthwestLng" DOUBLE PRECISION,
    "boundsNortheastLat" DOUBLE PRECISION,
    "boundsNortheastLng" DOUBLE PRECISION,
    "boundsSouthwestLat" DOUBLE PRECISION,
    "boundsSouthwestLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_placeId_key" ON "Location"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Club_locationId_key" ON "Club"("locationId");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
