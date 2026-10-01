import { useCallback } from 'react';

import { usePaginatedSearch } from '@/hooks/usePaginatedSearch';
import { Location } from '@/services/domain/model/Location';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';

export function useLocationSearchViewModel(locationRepository: LocationRepository, query: string) {
    const fetchPage = useCallback(
        (name: string, page: number) => locationRepository.searchLocationsByName(name, page),
        [locationRepository]
    );
    return usePaginatedSearch<Location>(fetchPage, query);
}
