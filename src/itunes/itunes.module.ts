import { Module } from '@nestjs/common';
import { ItunesService } from './itunes.service';
import { ItunesController } from './itunes.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ItunesService],
  controllers: [ItunesController],
  imports: [HttpModule, PrismaModule],
})
export class ItunesModule {}
