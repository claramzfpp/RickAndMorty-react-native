import { useEffect, useState } from 'react';

import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationCarouselUIState } from './locationCarouselUIState';

export function useLocationCarouselViewModel(
    locationRepository: LocationRepository
): LocationCarouselUIState {
    const [state, setState] = useState<LocationCarouselUIState>({ status: 'loading' });

    useEffect(() => {
        let isCancelled = false;
        setState({ status: 'loading' });

        (async () => {
            try {
                if (locationRepository.locations.length === 0) {
                    await locationRepository.loadNextPage();
                }

                if (!isCancelled) {
                    setState({ status: 'loaded', locationsArray: locationRepository.locations });
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

    return state;
}
