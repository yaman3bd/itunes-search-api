import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ItunesModule } from './itunes/itunes.module';
import { PodcastsModule } from './podcasts/podcasts.module';
import { EpisodesModule } from './episodes/episodes.module';

@Module({
  imports: [PrismaModule, ItunesModule, PodcastsModule, EpisodesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
