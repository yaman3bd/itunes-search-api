import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [EpisodesService],
  imports: [HttpModule, PrismaModule],
})
export class EpisodesModule {}
