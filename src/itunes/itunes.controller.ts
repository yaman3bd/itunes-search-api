import { Controller, Get, Query } from '@nestjs/common';
import { ItunesService } from './itunes.service';
import { ItunesSearchDto } from './dto/itunes-search.dto';

@Controller('itunes')
export class ItunesController {
  constructor(private readonly itunesService: ItunesService) {}

  @Get('search')
  async search(@Query() query: ItunesSearchDto) {
    return this.itunesService.searchAndPersist(
      query.term,
      query.limit,
      query.media,
    );
  }

  @Get('lookup')
  async lookup(@Query('key') key: string, @Query('value') value: string) {
    return this.itunesService.lookup(key, value);
  }
}
