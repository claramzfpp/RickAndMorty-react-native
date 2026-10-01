import { useCallback, useEffect, useRef, useState } from 'react';

import { Character } from '@/services/domain/model/Character';
import { Location } from '@/services/domain/model/Location';
import { PagedResult } from '@/services/domain/model/PagedResult';
import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { SearchSection } from './DiscoverSearchResults';

const loading = { status: 'loading' } as const;

const toSection = <T,>(result: PromiseSettledResult<PagedResult<T>>): SearchSection<T> => {
    if (result.status === 'rejected') {
        const message = result.reason instanceof Error ? result.reason.message : 'Unknown error';
        return { status: 'error', message };
    }
    return result.value.items.length === 0
        ? { status: 'empty' }
        : { status: 'loaded', items: result.value.items };
};

const MAX_RETRIES = 2;
const BACKOFF_MS = 300;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Re-runs `request` up to `MAX_RETRIES` more times, waiting `BACKOFF_MS * attempt` between tries. */
const withRetries = async <T,>(request: () => Promise<T>): Promise<T> => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await request();
        } catch {
            // swallowed only to retry; the final attempt below surfaces its error
            await delay(BACKOFF_MS * attempt);
        }
    }
    return request();
};

/** First page of each kind only; `query` is expected to be already debounced. */
export function useDiscoverSearch(
    characterRepository: CharacterRepository,
    locationRepository: LocationRepository,
    query: string
): {
    isSearching: boolean;
    characters: SearchSection<Character>;
    locations: SearchSection<Location>;
    retry: () => void;
} {
    const trimmed = query.trim();
    const isSearching = trimmed !== '';
    const [characters, setCharacters] = useState<SearchSection<Character>>(loading);
    const [locations, setLocations] = useState<SearchSection<Location>>(loading);
    const requestRef = useRef(0);

    const load = useCallback(async () => {
        const requestId = ++requestRef.current;
        setCharacters(loading);
        setLocations(loading);
        // Both requests run in parallel; each section settles on its own.
        await Promise.all([
            Promise.allSettled([withRetries(() => characterRepository.searchCharacters(trimmed, 1))]).then(([result]) => {
                if (requestId === requestRef.current) setCharacters(toSection(result));
            }),
            Promise.allSettled([withRetries(() => locationRepository.searchLocationsByName(trimmed, 1))]).then(([result]) => {
                if (requestId === requestRef.current) setLocations(toSection(result));
            }),
        ]);
    }, [characterRepository, locationRepository, trimmed]);

    useEffect(() => {
        if (!isSearching) {
            // invalidate in-flight requests and drop stale results
            requestRef.current++;
            setCharacters(loading);
            setLocations(loading);
            return;
        }
        void load();
    }, [isSearching, load]);

    const retry = useCallback(() => { void load(); }, [load]);

    return { isSearching, characters, locations, retry };
}
