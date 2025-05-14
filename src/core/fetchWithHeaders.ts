import { LRCLIB_CLIENT_HEADER } from '../config/constants';

export function fetchWithHeaders(url: string) {
  return fetch(url, {
    headers: {
      'Lrclib-Client': LRCLIB_CLIENT_HEADER,
      'User-Agent': LRCLIB_CLIENT_HEADER,
    },
  });
} 