import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { buildLookupUrl, buildSearchUrl, type Lookup } from '../../helper';

@Injectable()
export class ItunesService {
  private readonly logger = new Logger(ItunesService.name);

  constructor(private readonly http: HttpService) {}

  async callItunesApi<T>(url: string): Promise<T> {
    try {
      return await firstValueFrom(
        this.http.get<T>(`https://itunes.apple.com/${url}`).pipe(
          map((res) => res.data),
          catchError((error) => {
            const err = error as Error;
            this.logger.error('iTunes API failed', err.message || error);
            return throwError(() => new Error('Failed to call iTunes API'));
          }),
        ),
      );
    } catch (error) {
      this.logger.error('iTunes API call failed', error);
      throw new InternalServerErrorException('Failed to call iTunes API');
    }
  }

  async search<T>(
    term: string,
    options?: Record<string, string | number>,
  ): Promise<T> {
    const url = buildSearchUrl(term, options);
    return this.callItunesApi<T>(url);
  }

  async lookup<T>(
    type: Lookup,
    value: number | string,
    options?: Record<string, string | number>,
  ): Promise<T> {
    const url = buildLookupUrl(type, value, options);
    return this.callItunesApi<T>(url);
  }
}
