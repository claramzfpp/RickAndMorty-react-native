import { useCallback, useEffect, useRef, useState } from 'react';

import { PagedResult } from '@/services/domain/model/PagedResult';

export type PaginatedSearchState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'empty' }
    | { status: 'error'; message: string }
    | {
        status: 'loaded';
        items: T[];
        hasNextPage: boolean;
        isLoadingMore: boolean;
        loadMoreError?: string;
    };

const errorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Unknown error';

/**
 * `query` is expected to be already debounced. A blank query yields `idle`.
 * Responses from superseded queries/retries are discarded.
 */
export function usePaginatedSearch<T>(
    fetchPage: (query: string, page: number) => Promise<PagedResult<T>>,
    query: string
): { state: PaginatedSearchState<T>; loadMore: () => void; retry: () => void } {
    const trimmed = query.trim();
    const [state, setState] = useState<PaginatedSearchState<T>>(
        trimmed === '' ? { status: 'idle' } : { status: 'loading' }
    );
    const [retryToken, setRetryToken] = useState(0);

    const fetchPageRef = useRef(fetchPage);
    fetchPageRef.current = fetchPage;
    const requestIdRef = useRef(0);
    const isLoadingMoreRef = useRef(false);
    const nextPageRef = useRef<number | null>(null);

    useEffect(() => {
        const requestId = ++requestIdRef.current;
        isLoadingMoreRef.current = false;
        nextPageRef.current = null;

        if (trimmed === '') {
            setState({ status: 'idle' });
            return;
        }

        setState({ status: 'loading' });
        fetchPageRef.current(trimmed, 1)
            .then(result => {
                if (requestId !== requestIdRef.current) return;
                nextPageRef.current = result.nextPage;
                setState(
                    result.items.length === 0
                        ? { status: 'empty' }
                        : {
                            status: 'loaded',
                            items: result.items,
                            hasNextPage: result.nextPage !== null,
                            isLoadingMore: false,
                        }
                );
            })
            .catch((error: unknown) => {
                if (requestId !== requestIdRef.current) return;
                setState({ status: 'error', message: errorMessage(error) });
            });
    }, [trimmed, retryToken]);

    const loadMore = useCallback(() => {
        const page = nextPageRef.current;
        if (isLoadingMoreRef.current || page === null) return;

        const requestId = requestIdRef.current;
        const currentQuery = trimmed;
        isLoadingMoreRef.current = true;
        setState(current =>
            current.status === 'loaded'
                ? { ...current, isLoadingMore: true, loadMoreError: undefined }
                : current
        );

        fetchPageRef.current(currentQuery, page)
            .then(result => {
                if (requestId !== requestIdRef.current) return;
                nextPageRef.current = result.nextPage;
                setState(current =>
                    current.status === 'loaded'
                        ? {
                            status: 'loaded',
                            items: [...current.items, ...result.items],
                            hasNextPage: result.nextPage !== null,
                            isLoadingMore: false,
                        }
                        : current
                );
            })
            .catch((error: unknown) => {
                if (requestId !== requestIdRef.current) return;
                setState(current =>
                    current.status === 'loaded'
                        ? { ...current, isLoadingMore: false, loadMoreError: errorMessage(error) }
                        : current
                );
            })
            .finally(() => {
                // A superseded request must not clear the flag of a newer one;
                // the effect already reset it when the query/retry changed.
                if (requestId === requestIdRef.current) {
                    isLoadingMoreRef.current = false;
                }
            });
    }, [trimmed]);

    const retry = useCallback(() => setRetryToken(token => token + 1), []);

    return { state, loadMore, retry };
}
