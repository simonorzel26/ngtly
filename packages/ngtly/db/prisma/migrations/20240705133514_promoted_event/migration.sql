-- CreateTable
CREATE TABLE "PromotedEvent" (
    "id" TEXT NOT NULL,
    "promotionDate" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotedEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromotedEvent" ADD CONSTRAINT "PromotedEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotedEvent" ADD CONSTRAINT "PromotedEvent_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
