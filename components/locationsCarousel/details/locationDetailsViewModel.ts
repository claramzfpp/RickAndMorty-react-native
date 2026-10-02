import { LocationId } from '@/services/domain/model/LocationId';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { useCallback, useEffect, useState } from 'react';

import { LocationDetailsUIState } from './locationDetailsUIState';

export function useLocationDetailsViewModel(
    locations: LocationRepository,
    rawId: string
): { state: LocationDetailsUIState; retry: () => void } {
    const [state, setState] = useState<LocationDetailsUIState>({ status: 'loading' });
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => setAttempt((current) => current + 1), []);

    useEffect(() => {
        let isCancelled = false;
        setState({ status: 'loading' });

        (async () => {
            try {
                // Route params are strings; the value object throws on NaN or non-positive ids.
                const id = new LocationId(Number(rawId));
                const location = await locations.getLocationById(id);

                if (!isCancelled) {
                    setState({ status: 'loaded', location });
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
    }, [locations, rawId, attempt]);

    return { state, retry };
}
