import { Module } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { PodcastsController } from './podcasts.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { EpisodesService } from '../episodes/episodes.service';
import { ItunesModule } from '../itunes/itunes.module';

@Module({
  controllers: [PodcastsController],
  providers: [PodcastsService, EpisodesService],
  imports: [HttpModule, PrismaModule, ItunesModule],
})
export class PodcastsModule {}
