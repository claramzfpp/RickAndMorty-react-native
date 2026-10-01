import { useCallback, useEffect, useRef, useState } from 'react';

import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { CharacterListUIState } from './characterListUIState';

export function useCharacterListViewModel(
    characterRepository: CharacterRepository
): { state: CharacterListUIState; loadMore: () => void } {
    const [state, setState] = useState<CharacterListUIState>({ status: 'loading' });
    const isLoadingMoreRef = useRef(false);

    useEffect(() => {
        let isCancelled = false;
        setState({ status: 'loading' });

        (async () => {
            try {
                if (characterRepository.characters.length === 0) {
                    await characterRepository.loadNextPage();
                }

                if (!isCancelled) {
                    setState({
                        status: 'loaded',
                        characters: characterRepository.characters,
                        hasNextPage: characterRepository.hasNextPage,
                        isLoadingMore: false,
                    });
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

    const loadMore = useCallback(() => {
        if (isLoadingMoreRef.current || !characterRepository.hasNextPage) {
            return;
        }

        isLoadingMoreRef.current = true;
        setState(current =>
            current.status === 'loaded'
                ? { ...current, isLoadingMore: true, loadMoreError: undefined }
                : current
        );

        characterRepository.loadNextPage()
            .then(() => {
                setState(current =>
                    current.status === 'loaded'
                        ? {
                            status: 'loaded',
                            characters: characterRepository.characters,
                            hasNextPage: characterRepository.hasNextPage,
                            isLoadingMore: false,
                        }
                        : current
                );
            })
            .catch((error: unknown) => {
                const message = error instanceof Error ? error.message : 'Unknown error';
                setState(current =>
                    current.status === 'loaded'
                        ? { ...current, isLoadingMore: false, loadMoreError: message }
                        : current
                );
            })
            .finally(() => {
                isLoadingMoreRef.current = false;
            });
    }, [characterRepository]);

    return { state, loadMore };
}
