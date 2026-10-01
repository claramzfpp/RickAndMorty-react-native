import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationCarouselUIState } from './locationCarouselUIState';
import { useLocationListViewModel } from './locationListViewModel';

const CAROUSEL_MAX_ITEMS = 20;

export function useLocationCarouselViewModel(
    locationRepository: LocationRepository
): LocationCarouselUIState {
    const { state } = useLocationListViewModel(locationRepository);

    if (state.status === 'loaded') {
        return { status: 'loaded', locationsArray: state.locations.slice(0, CAROUSEL_MAX_ITEMS) };
    }
    return state;
}
