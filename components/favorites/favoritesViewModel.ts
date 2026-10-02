import { useCallback, useEffect, useRef, useState } from 'react';

import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { FavoritesRepository } from '@/services/domain/repository/FavoritesRepository';

import { FavoritesUIState } from './favoritesUIState';

export function useFavoritesViewModel(
    favorites: FavoritesRepository,
    characters: CharacterRepository
): { state: FavoritesUIState; reload: () => void } {
    const [state, setState] = useState<FavoritesUIState>({ status: 'loading' });
    // Lets reload() skip the spinner when data is already on screen (re-focus), without changing its identity.
    const hasDataRef = useRef(false);
    // Only the latest request may write state, so overlapping reloads cannot resolve out of order.
    const requestIdRef = useRef(0);
    const isUnmountedRef = useRef(false);

    useEffect(() => {
        isUnmountedRef.current = false;
        return () => {
            isUnmountedRef.current = true;
        };
    }, []);

    const reload = useCallback(() => {
        const requestId = ++requestIdRef.current;
        const isStale = () => isUnmountedRef.current || requestId !== requestIdRef.current;

        if (!hasDataRef.current) {
            setState({ status: 'loading' });
        }

        (async () => {
            try {
                const ids = await favorites.getFavoriteIds();

                if (ids.length === 0) {
                    if (!isStale()) {
                        hasDataRef.current = true;
                        setState({ status: 'empty' });
                    }
                    return;
                }

                // The repository stores ids in insertion order; the newest favorite goes first.
                const loaded = await characters.getCharactersByIds([...ids].reverse());

                if (isStale()) {
                    return;
                }

                // Ids the API no longer knows are omitted, so every id may have vanished.
                hasDataRef.current = loaded.length > 0;
                setState(loaded.length === 0 ? { status: 'empty' } : { status: 'loaded', characters: loaded });
            } catch (error) {
                if (!isStale()) {
                    hasDataRef.current = false;
                    const message = error instanceof Error ? error.message : 'Unknown error';
                    setState({ status: 'error', message });
                }
            }
        })();
    }, [favorites, characters]);

    return { state, reload };
}
