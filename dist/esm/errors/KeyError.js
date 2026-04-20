import { LyricsLibError } from './LyricsLibError.js';
/**
 * @deprecated Since v2.0.0. Not thrown by any code path today — the v1.x
 * Genius scraper that used it is gone. Kept in the public surface so
 * existing `instanceof KeyError` call sites keep working; no removal is
 * planned. Future keyed providers (Genius, Musixmatch) may reuse this
 * class for API-key failures when that work lands.
 */
export class KeyError extends LyricsLibError {
    name = 'KeyError';
    constructor(_error) {
        super('The key has not been configured.');
    }
}
//# sourceMappingURL=KeyError.js.map