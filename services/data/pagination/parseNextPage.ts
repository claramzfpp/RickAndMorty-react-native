/**
 * Extracts the page number from the API's `info.next` URL.
 * Returns null when there is no next page or the URL carries no `page` param.
 */
export function parseNextPage(nextUrl: string | null): number | null {
    if (nextUrl === null) {
        return null;
    }
    const match = /[?&]page=(\d+)/.exec(nextUrl);
    return match === null ? null : Number(match[1]);
}
