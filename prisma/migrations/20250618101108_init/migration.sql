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

-- CreateTable
CREATE TABLE "Podcast" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "artistName" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,
    "feedUrl" TEXT NOT NULL,
    "artworkUrl30" TEXT NOT NULL,
    "artworkUrl60" TEXT NOT NULL,
    "artworkUrl100" TEXT NOT NULL,
    "artworkUrl600" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "trackCount" INTEGER NOT NULL,
    "trackTimeMillis" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "primaryGenreName" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "lastFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER,
    "podcastId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT,
    "duration" TEXT,
    "pubDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "episodeNumber" INTEGER,
    "episodeType" TEXT,
    "image" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_collectionId_key" ON "Podcast"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_trackId_key" ON "Podcast"("trackId");

-- CreateIndex
CREATE INDEX "Podcast_collectionId_idx" ON "Podcast"("collectionId");

-- CreateIndex
CREATE INDEX "Podcast_trackId_idx" ON "Podcast"("trackId");

-- CreateIndex
CREATE INDEX "Podcast_artistName_idx" ON "Podcast"("artistName");

-- CreateIndex
CREATE INDEX "Podcast_collectionName_idx" ON "Podcast"("collectionName");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_trackId_key" ON "Episode"("trackId");

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
