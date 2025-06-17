-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "wrapperType" TEXT,
    "kind" TEXT DEFAULT 'podcast',
    "artistId" INTEGER,
    "collectionId" INTEGER,
    "trackId" INTEGER,
    "artistName" TEXT,
    "collectionName" TEXT,
    "trackName" TEXT,
    "collectionCensoredName" TEXT,
    "trackCensoredName" TEXT,
    "collectionViewUrl" TEXT,
    "feedUrl" TEXT,
    "artistViewUrl" TEXT,
    "trackViewUrl" TEXT,
    "artworkUrl30" TEXT,
    "artworkUrl60" TEXT,
    "artworkUrl100" TEXT,
    "artworkUrl600" TEXT,
    "collectionPrice" DOUBLE PRECISION DEFAULT 0,
    "trackPrice" DOUBLE PRECISION DEFAULT 0,
    "collectionHdPrice" DOUBLE PRECISION DEFAULT 0,
    "releaseDate" TIMESTAMP(3),
    "collectionExplicitness" TEXT,
    "trackExplicitness" TEXT,
    "trackCount" INTEGER,
    "trackTimeMillis" INTEGER,
    "country" TEXT,
    "currency" TEXT,
    "primaryGenreName" TEXT,
    "contentAdvisoryRating" TEXT,
    "genreIds" TEXT[],
    "genres" TEXT[],

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_trackId_key" ON "Track"("trackId");

-- CreateIndex
CREATE INDEX "Track_trackId_idx" ON "Track"("trackId");

-- CreateIndex
CREATE INDEX "Track_artistName_idx" ON "Track"("artistName");

-- CreateIndex
CREATE INDEX "Track_collectionName_idx" ON "Track"("collectionName");

-- CreateIndex
CREATE INDEX "Track_primaryGenreName_idx" ON "Track"("primaryGenreName");
