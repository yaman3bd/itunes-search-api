import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import {
  ItunesSearchResponse,
  ItunesSearchResult,
} from './types/itunes-search-response';
import { buildLookupUrl, buildSearchUrl } from '../../helper';

@Injectable()
export class ItunesService {
  private readonly logger = new Logger(ItunesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async search(term: string, limit?: string, page?: string) {
    if (!term) {
      throw new Error('Search term is required');
    }

    const url = buildSearchUrl(term, {
      media: 'podcast',
      explicit: true,
    });

    const response = await this.callItunesApi<ItunesSearchResponse>(url);

    await this.saveResultsToDb(response.results);

    return response;
  }

  async getPodcastDetails(podcastId: string, limit?: string, offset?: string) {
    if (!podcastId) throw new Error('Podcast ID is required');

    const limitValue = limit ? Number(limit) : 8;

    const lookupOptions: Record<string, any> = {
      media: 'podcast',
      entity: 'podcastEpisode',
      limit: limitValue,
      offset: offset ? Number(offset) : 0,
    };

    const url = buildLookupUrl('id', podcastId, lookupOptions);

    console.log(url);
    return await this.callItunesApi<ItunesSearchResponse>(url);
  }

  async getEpisode(collectionId: string, trackId: string) {
    if (!collectionId || !trackId) throw new Error('Episode ID is required');

    const url = buildLookupUrl('id', collectionId, {
      media: 'podcast',
      entity: 'podcastEpisode',
    });

    const response = await this.callItunesApi<ItunesSearchResponse>(url);

    if (!response.results?.length) {
      throw new InternalServerErrorException('Episode not found');
    }

    return (
      response.results.find(
        (result) => result.trackId.toString() === trackId,
      ) || null
    );
  }

  async callItunesApi<T>(url: string): Promise<T> {
    try {
      return await firstValueFrom(
        this.httpService.get<T>(`https://itunes.apple.com/${url}`).pipe(
          map((res) => res.data),
          catchError((error) => {
            this.logger.error('iTunes API failed', error?.message || error);
            return throwError(() => new Error('Failed to call iTunes API'));
          }),
        ),
      );
    } catch (error) {
      this.logger.error('iTunes API call failed', error);
      throw new InternalServerErrorException('Failed to call iTunes API');
    }
  }

  private async saveResultsToDb(results: ItunesSearchResult[]) {
    try {
      await this.prisma.track.createMany({
        data: results,
        skipDuplicates: true,
      });
    } catch (error) {
      this.logger.error('Failed to save search results', error);
    }
  }
}
