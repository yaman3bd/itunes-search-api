import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItunesService } from './itunes.service';
import { ItunesSearchDto } from './dto/itunes-search.dto';

@Controller('itunes')
export class ItunesController {
  constructor(private readonly itunesService: ItunesService) {}

  @Get('search')
  async search(@Query() query: ItunesSearchDto) {
    return this.itunesService.search(query.term, query.limit, query.page);
  }

  @Get('podcast/:id')
  async getPodcast(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.itunesService.getPodcastDetails(id, limit, offset);
  }

  @Get('episode/:id')
  async getEpisode(@Param('id') id: string, @Query('trackId') trackId: string) {
    return this.itunesService.getEpisode(id, trackId);
  }
}
