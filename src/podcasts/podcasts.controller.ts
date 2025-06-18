import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Body,
  Patch,
} from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { EpisodesService } from '../episodes/episodes.service';

@Controller('podcasts')
export class PodcastsController {
  constructor(
    private readonly podcastsService: PodcastsService,
    private readonly episodesService: EpisodesService,
  ) {}

  @Get('search')
  async search(@Query('term') term: string) {
    return this.podcastsService.search(term);
  }

  @Get()
  async getPaginated(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.podcastsService.getPaginated(Number(page), Number(limit));
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.podcastsService.getById(id);
  }

  @Get(':id/episodes')
  async getEpisodes(
    @Param('id', ParseIntPipe) podcastId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.episodesService.getEpisodesForPodcast(
      podcastId,
      Number(page),
      Number(limit),
    );
  }

  @Patch(':id/favorite')
  async toggleFavoritePodcast(
    @Param('id', ParseIntPipe) id: number,
    @Body('isFavorite') isFavorite: boolean,
  ) {
    return this.podcastsService.setFavorite(id, isFavorite);
  }

  @Get(':id/episodes/latest')
  async getLatestEpisode(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.getLatestEpisode(id);
  }

  @Get(':id/episodes/:episodeId')
  async getEpisode(
    @Param('id', ParseIntPipe) podcastId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.episodesService.getById(episodeId);
  }

  @Patch(':id/episodes/:episodeId/favorite')
  async toggleFavoriteEpisode(
    @Param('id', ParseIntPipe) podcastId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body('isFavorite') isFavorite: boolean,
  ) {
    return this.episodesService.setFavorite(episodeId, isFavorite);
  }
}
