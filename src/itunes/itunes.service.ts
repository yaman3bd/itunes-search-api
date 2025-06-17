import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { map, catchError, throwError, firstValueFrom } from 'rxjs';
import {
  ItunesSearchResponse,
  ItunesSearchResult,
} from './types/itunes-search-response';

@Injectable()
export class ItunesService {
  private readonly logger = new Logger(ItunesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async lookup(key: string, value: string): Promise<ItunesSearchResponse> {
    if (!key || !value) {
      this.logger.error('Key and value are required for lookup');
      throw new Error('Key and value are required for lookup');
    }

    const url = `https://itunes.apple.com/lookup?${key}=${encodeURIComponent(value)}`;

    const response = await firstValueFrom(
      this.httpService.get<ItunesSearchResponse>(url).pipe(
        map((res) => res.data),
        catchError((error) => {
          this.logger.error('iTunes API call failed', error?.message || error);
          return throwError(() => new Error('Failed to call iTunes API'));
        }),
      ),
    );

    if (!response || !response.results) {
      this.logger.warn('iTunes returned empty results');
      throw new InternalServerErrorException('Unexpected iTunes response');
    }

    return response;
  }

  async searchAndPersist(term: string, limit?: string, media?: string) {
    if (!term) {
      this.logger.error('Search term is required');
      throw new Error('Search term is required');
    }

    const urlParams = new URLSearchParams();
    urlParams.set('term', encodeURIComponent(term.trim()));
    urlParams.set('media', media || 'podcast');
    if (limit) {
      urlParams.set('limit', limit);
    }
    const url = `https://itunes.apple.com/search?media=podcast&term=${encodeURIComponent(term)}`;

    const response = await firstValueFrom(
      this.httpService.get<ItunesSearchResponse>(url).pipe(
        map((res) => res.data),
        catchError((error) => {
          this.logger.error('iTunes API call failed', error?.message || error);
          return throwError(() => new Error('Failed to call iTunes API'));
        }),
      ),
    );

    if (!response || !response.results) {
      this.logger.warn('iTunes returned empty results');
      throw new InternalServerErrorException('Unexpected iTunes response');
    }

    await this.saveResultsToDb(response.results);

    return response;
  }

  private async saveResultsToDb(results: ItunesSearchResult[]) {
    try {
      await this.prisma.track.createMany({
        data: results,
        skipDuplicates: true,
      });
    } catch (error) {
      this.logger.error(`Failed to save trackId `, error);
    }
  }
}
