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

/** First page of each kind only; `query` is expected to be already debounced. */
export function useDiscoverSearch(
    characterRepository: CharacterRepository,
    locationRepository: LocationRepository,
    query: string
): {
    isSearching: boolean;
    characters: SearchSection<Character>;
    locations: SearchSection<Location>;
    retryCharacters: () => void;
    retryLocations: () => void;
} {
    const trimmed = query.trim();
    const isSearching = trimmed !== '';
    const [characters, setCharacters] = useState<SearchSection<Character>>(loading);
    const [locations, setLocations] = useState<SearchSection<Location>>(loading);
    const charactersRequestRef = useRef(0);
    const locationsRequestRef = useRef(0);

    const loadCharacters = useCallback(async () => {
        const requestId = ++charactersRequestRef.current;
        setCharacters(loading);
        const [result] = await Promise.allSettled([characterRepository.searchCharacters(trimmed, 1)]);
        if (requestId === charactersRequestRef.current) setCharacters(toSection(result));
    }, [characterRepository, trimmed]);

    const loadLocations = useCallback(async () => {
        const requestId = ++locationsRequestRef.current;
        setLocations(loading);
        const [result] = await Promise.allSettled([locationRepository.searchLocationsByName(trimmed, 1)]);
        if (requestId === locationsRequestRef.current) setLocations(toSection(result));
    }, [locationRepository, trimmed]);

    useEffect(() => {
        if (!isSearching) {
            // invalidate in-flight requests
            charactersRequestRef.current++;
            locationsRequestRef.current++;
            return;
        }
        void loadCharacters();
        void loadLocations();
    }, [isSearching, loadCharacters, loadLocations]);

    return {
        isSearching,
        characters,
        locations,
        retryCharacters: () => { void loadCharacters(); },
        retryLocations: () => { void loadLocations(); },
    };
}
