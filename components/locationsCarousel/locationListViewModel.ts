import { useCallback, useEffect, useRef, useState } from 'react';

import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationListUIState } from './locationListUIState';

export function useLocationListViewModel(
    locationRepository: LocationRepository
): { state: LocationListUIState; loadMore: () => void } {
    const [state, setState] = useState<LocationListUIState>({ status: 'loading' });
    const isLoadingMoreRef = useRef(false);

    useEffect(() => {
        let isCancelled = false;
        setState({ status: 'loading' });

        (async () => {
            try {
                if (locationRepository.locations.length === 0) {
                    await locationRepository.loadNextPage();
                }

                if (!isCancelled) {
                    setState({
                        status: 'loaded',
                        locations: locationRepository.locations,
                        hasNextPage: locationRepository.hasNextPage,
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
    }, [locationRepository]);

    const loadMore = useCallback(() => {
        if (isLoadingMoreRef.current || !locationRepository.hasNextPage) {
            return;
        }

        isLoadingMoreRef.current = true;
        setState(current =>
            current.status === 'loaded'
                ? { ...current, isLoadingMore: true, loadMoreError: undefined }
                : current
        );

        locationRepository.loadNextPage()
            .then(() => {
                setState(current =>
                    current.status === 'loaded'
                        ? {
                            status: 'loaded',
                            locations: locationRepository.locations,
                            hasNextPage: locationRepository.hasNextPage,
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
    }, [locationRepository]);

    return { state, loadMore };
}
