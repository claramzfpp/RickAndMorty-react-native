import { useCallback, useEffect, useRef, useState } from 'react';

import { CharacterId } from '@/services/domain/model/CharacterId';
import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { FavoritesRepository } from '@/services/domain/repository/FavoritesRepository';

import { CharacterDetailsUIState } from './characterDetailsUIState';

export function useCharacterDetailsViewModel(
    characters: CharacterRepository,
    favorites: FavoritesRepository,
    rawId: string
) {
    const [state, setState] = useState<CharacterDetailsUIState>({ status: 'loading' });
    const [reloadToken, setReloadToken] = useState(0);
    // A ref (not state) so a second tap in the same render frame is also ignored.
    const isToggling = useRef(false);
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        let isCancelled = false;
        setState({ status: 'loading' });

        (async () => {
            try {
                const id = new CharacterId(Number(rawId));
                const [character, isFavorite] = await Promise.all([
                    characters.getCharacterById(id),
                    favorites.isFavorite(id),
                ]);

                if (!isCancelled) {
                    setState({ status: 'loaded', character, isFavorite });
                }
            } catch (error) {
                if (!isCancelled) {
                    const message = error instanceof Error ? error.message : 'Unknown error';
                    setState({ status: 'error', message });
                }
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [characters, favorites, rawId, reloadToken]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    // Rolls back and rethrows on failure so the caller can surface the error to the user.
    const toggleFavorite = useCallback(async (): Promise<void> => {
        const current = stateRef.current;
        if (current.status !== 'loaded' || isToggling.current) {
            return;
        }

        isToggling.current = true;
        const { character, isFavorite: previous } = current;
        setState({ status: 'loaded', character, isFavorite: !previous });

        try {
            if (previous) {
                await favorites.remove(character.id);
            } else {
                await favorites.add(character.id);
            }
        } catch (error) {
            setState({ status: 'loaded', character, isFavorite: previous });
            throw error;
        } finally {
            isToggling.current = false;
        }
    }, [favorites]);

    return { state, toggleFavorite, retry };
}
