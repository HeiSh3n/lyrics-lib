import { LRCLIB_CLIENT_HEADER } from '../config/constants';

/**
 * Fetch a resource from a URL with custom headers for LRCLIB API requests.
 * @param url - The URL to fetch.
 * @returns The fetch Response object.
 */
export function fetchWithHeaders(url: string) {
  return fetch(url, {
    headers: {
      'Lrclib-Client': LRCLIB_CLIENT_HEADER,
      'User-Agent': LRCLIB_CLIENT_HEADER,
    },
  });
} 