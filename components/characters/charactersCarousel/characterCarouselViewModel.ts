import { useEffect, useState } from 'react';

import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { CharacterCarouselUIState } from './characterCarouselUIState';

export function useCharacterCarouselViewModel(
    characterRepository: CharacterRepository
): CharacterCarouselUIState {
    const [state, setState] = useState<CharacterCarouselUIState>({ status: 'loading' });

    useEffect(() => {
        let isCancelled = false;
        setState({ status: 'loading' }); //pra ter ceteza que tá começando como loading

        (async () => {
            try {
                if (characterRepository.characters.length === 0) {
                    await characterRepository.loadNextPage();
                }

                if (!isCancelled) {
                    setState({ status: 'loaded', charactersArray: characterRepository.characters });
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
    }, [characterRepository]);

    return state;
}