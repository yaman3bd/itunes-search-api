import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ItunesService } from '../itunes/itunes.service';
import { Response } from '../../helper';

@Injectable()
export class PodcastsService {
  private readonly logger = new Logger(PodcastsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly itunes: ItunesService,
  ) {}

  async search(term: string) {
    if (!term) {
      throw new Error('Search term is required');
    }

    const existing = await this.prisma.podcast.findMany({
      where: {
        collectionName: {
          contains: term,
          mode: 'insensitive',
        },
      },
    });
    if (existing.length > 0) {
      return existing;
    }

    const response = await this.itunes.search<Response<'podcast', 'podcast'>>(
      term,
      {
        media: 'podcast',
      },
    );

    const podcasts = await Promise.all(
      response.results.map(async (item) => {
        try {
          return await this.prisma.podcast.upsert({
            where: { collectionId: item.collectionId },
            update: {},
            create: {
              collectionId: item.collectionId,
              trackId: item.trackId,
              artistName: item.artistName ?? 'Unknown',
              collectionName: item.collectionName,
              trackName: item.trackName,
              feedUrl: item.feedUrl,
              artworkUrl30: item.artworkUrl30,
              artworkUrl60: item.artworkUrl60,
              artworkUrl100: item.artworkUrl100,
              artworkUrl600: item.artworkUrl600,
              releaseDate: item.releaseDate
                ? new Date(item.releaseDate)
                : new Date(),
              trackCount: item.trackCount ?? 0,
              trackTimeMillis: item.trackTimeMillis ?? 0,
              country: item.country ?? 'Unknown',
              currency: item.currency ?? 'USD',
              primaryGenreName: item.primaryGenreName ?? 'Uncategorized',
            },
          });
        } catch (err) {
          this.logger.error(`Failed to save podcast ${item.collectionId}`, err);
          return null;
        }
      }),
    );
    return podcasts.filter(Boolean);
  }

  async getById(id: number) {
    const podcast = await this.prisma.podcast.findUnique({
      where: { id },
    });

    if (!podcast) {
      throw new NotFoundException(`No episodes found for podcast ${id}`);
    }

    return podcast;
  }

  async setFavorite(id: number, isFavorite: boolean) {
    return this.prisma.podcast.update({
      where: { id },
      data: { isFavorite },
    });
  }
  async getPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.podcast.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.podcast.count(),
    ]);

    return {
      items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
