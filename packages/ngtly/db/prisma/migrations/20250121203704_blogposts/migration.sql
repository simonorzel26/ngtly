-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "author" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "publisherName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" VARCHAR(2083),
    "tags" TEXT[],
    "keywords" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL,
    "interactionStatistic" JSONB NOT NULL,
    "isAccessibleForFree" BOOLEAN NOT NULL DEFAULT true,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datePublished" TIMESTAMP(3) NOT NULL,
    "dateModified" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
