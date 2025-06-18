import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XMLParser } from 'fast-xml-parser';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RssEpisode, RssFeed } from './types';

@Injectable()
export class EpisodesService {
  private readonly logger = new Logger(EpisodesService.name);
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getById(id: number) {
    return this.prisma.episode.findUnique({
      where: { id },
      include: {
        podcast: true,
      },
    });
  }

  async setFavorite(id: number, isFavorite: boolean) {
    return this.prisma.episode.update({
      where: { id },
      data: { isFavorite },
    });
  }

  async getEpisodesForPodcast(podcastId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const podcast = await this.prisma.podcast.findUnique({
      where: { id: podcastId },
    });

    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }
    const shouldRefresh =
      !podcast?.lastFetchedAt ||
      new Date().getTime() - new Date(podcast.lastFetchedAt).getTime() >
        1000 * 60 * 60 * 6; // 6 hours

    if (shouldRefresh) {
      await this.fetchAndSaveFromFeed(podcastId);
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.episode.findMany({
        where: { podcastId },
        orderBy: { pubDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.episode.count({ where: { podcastId } }),
    ]);

    return {
      items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getLatestEpisode(podcastId: number) {
    const latest = await this.prisma.episode.findFirst({
      where: { podcastId },
      orderBy: { pubDate: 'desc' },
      include: {
        podcast: true,
      },
    });

    if (!latest) {
      throw new NotFoundException(`No episodes found for podcast ${podcastId}`);
    }

    return latest;
  }

  private async fetchAndSaveFromFeed(podcastId: number) {
    const podcast = await this.prisma.podcast.findUnique({
      where: { id: podcastId },
    });

    if (!podcast?.feedUrl) return;

    const xml = await firstValueFrom(
      this.httpService.get<string>(podcast.feedUrl).pipe(
        map((res) => res.data),
        catchError((error: unknown) => {
          const err = error as Error;
          this.logger.error(
            'Failed to fetch podcast feed',
            err.message || error,
          );
          return throwError(() => new Error('Failed to fetch podcast feed'));
        }),
      ),
    );

    const parsed = this.parser.parse(xml) as RssFeed;
    const channel = parsed?.rss?.channel;

    if (!channel?.item) return;

    const items: RssEpisode[] = Array.isArray(channel.item)
      ? channel.item
      : [channel.item];

    for (const item of items) {
      const audioUrl = item.enclosure?.url ?? item.enclosure?.['@_url'];
      const image = item['itunes:image']?.href || channel['itunes:image']?.href;

      await this.prisma.episode.create({
        data: {
          podcastId,
          title: item.title,
          pubDate: new Date(item.pubDate),
          description: item.description ?? '',
          audioUrl,
          duration: String(item['itunes:duration']),
          episodeNumber: item['itunes:episode']
            ? Number(item['itunes:episode'])
            : null,
          episodeType: item['itunes:episodeType'] ?? null,
          image,
        },
      });
    }

    await this.prisma.podcast.update({
      where: { id: podcastId },
      data: { lastFetchedAt: new Date() },
    });
  }
}
