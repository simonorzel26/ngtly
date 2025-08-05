/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `PromotedEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[promotionDate,cityId]` on the table `PromotedEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PromotedEvent_id_key" ON "PromotedEvent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PromotedEvent_promotionDate_cityId_key" ON "PromotedEvent"("promotionDate", "cityId");
