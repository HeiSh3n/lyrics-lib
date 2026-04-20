/**
 * Look up lyrics by title only via `GET /api/search`, then fetch the first
 * result by id via `GET /api/get/:id`.
 *
 * Returns:
 * - `plainLyrics` if present, otherwise `syncedLyrics`, otherwise `null`.
 * - `null` when the search returns no results or the first result has no id.
 *
 * Throws {@link RequestError} on transport failure or non-2xx responses
 * (other than 404 on the get-by-id call, which is treated as "no result").
 *
 * Note: this picks the **first** search result with no ranking. Pass an
 * artist to {@link getLyrics} when match precision matters.
 */
export declare function fetchByTitleOnly(title: string): Promise<string | null>;
//# sourceMappingURL=fetchByTitleOnly.d.ts.map