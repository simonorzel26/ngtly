-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "internalId" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "returnEndpoint" TEXT NOT NULL,
    "promptEndpoint" TEXT NOT NULL,
    "prompt" TEXT,
    "readyToBatch" BOOLEAN NOT NULL DEFAULT false,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "htmlId" TEXT,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Html" (
    "id" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "urlScrapeRequestId" TEXT NOT NULL,
    "gptResponseId" TEXT,

    CONSTRAINT "Html_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GptResponse" (
    "id" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "htmlId" TEXT NOT NULL,

    CONSTRAINT "GptResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Request_id_key" ON "Request"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Request_htmlId_key" ON "Request"("htmlId");

-- CreateIndex
CREATE UNIQUE INDEX "Html_id_key" ON "Html"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Html_urlScrapeRequestId_key" ON "Html"("urlScrapeRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Html_gptResponseId_key" ON "Html"("gptResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "GptResponse_id_key" ON "GptResponse"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GptResponse_htmlId_key" ON "GptResponse"("htmlId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_htmlId_fkey" FOREIGN KEY ("htmlId") REFERENCES "Html"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Html" ADD CONSTRAINT "Html_gptResponseId_fkey" FOREIGN KEY ("gptResponseId") REFERENCES "GptResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
