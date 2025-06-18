import type { Entities, Lookup, Media, Options } from './types';

// Generates full URL string instead of calling fetch
function buildUrl(
  endpoint: string,
  parameters: Record<string, boolean | number | string>,
): string {
  const query = new URLSearchParams();

  for (const [param, value] of Object.entries(parameters)) {
    query.set(param, String(value));
  }

  return `${endpoint}?${query.toString()}`;
}

export function buildSearchUrl<M extends Media, E extends Entities[M]>(
  searchTerm: string,
  options: Partial<Options<M, E>> = {},
): string {
  const resolvedOptions = { ...options };

  const queryParams = {
    ...resolvedOptions,
    term: searchTerm,
  };

  return buildUrl('search', queryParams);
}

export function buildLookupUrl<M extends Media, E extends Entities[M]>(
  type: Lookup,
  value: number | string,
  options: Partial<Options<M, E>> = {},
): string {
  const resolvedOptions = { ...options };
  const resolvedValue = { [type]: value } as Record<Lookup, number | string>;

  return buildUrl('lookup', { ...resolvedOptions, ...resolvedValue });
}

export * from './types';
