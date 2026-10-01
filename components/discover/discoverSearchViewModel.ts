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

/** Re-runs `request` up to `MAX_RETRIES` more times; the loading state stays up meanwhile. */
const withRetries = async <T,>(request: () => Promise<T>): Promise<T> => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            return await request();
        } catch {
            // swallowed only to retry; the final attempt below surfaces its error
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

    // Sequential on purpose: locations only start after characters settle, and both
    // sections leave the loading state together.
    const load = useCallback(async () => {
        const requestId = ++requestRef.current;
        setCharacters(loading);
        setLocations(loading);
        const [charactersResult] = await Promise.allSettled([withRetries(() => characterRepository.searchCharacters(trimmed, 1))]);
        if (requestId !== requestRef.current) return;
        const [locationsResult] = await Promise.allSettled([withRetries(() => locationRepository.searchLocationsByName(trimmed, 1))]);
        if (requestId !== requestRef.current) return;
        setCharacters(toSection(charactersResult));
        setLocations(toSection(locationsResult));
    }, [characterRepository, locationRepository, trimmed]);

    useEffect(() => {
        if (!isSearching) {
            // invalidate in-flight requests
            requestRef.current++;
            return;
        }
        void load();
    }, [isSearching, load]);

    return {
        isSearching,
        characters,
        locations,
        retry: () => { void load(); },
    };
}
