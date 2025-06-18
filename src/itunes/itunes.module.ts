import { Module } from '@nestjs/common';
import { ItunesService } from './itunes.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [ItunesService],
  exports: [ItunesService],
  imports: [HttpModule],
})
export class ItunesModule {}
