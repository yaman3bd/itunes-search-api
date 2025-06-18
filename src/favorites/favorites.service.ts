import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const podcasts = await this.prisma.podcast.findMany({
      where: { isFavorite: true },
      orderBy: { updatedAt: 'desc' },
    });

    const episodes = await this.prisma.episode.findMany({
      where: { isFavorite: true },
      orderBy: { pubDate: 'desc' },
      include: {
        podcast: true,
      },
    });

    return {
      podcasts,
      episodes,
    };
  }
}
