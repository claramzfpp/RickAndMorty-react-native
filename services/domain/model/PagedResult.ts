export type PagedResult<T> = {
    items: T[];
    // null when there are no more pages
    nextPage: number | null;
};
