-- CreateTable
CREATE TABLE "ReportedEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportedEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportedEvent" ADD CONSTRAINT "ReportedEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
