import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { LocationCarouselUIState } from './locationCarouselUIState';
import { useLocationListViewModel } from './locationListViewModel';

export function useLocationCarouselViewModel(
    locationRepository: LocationRepository
): LocationCarouselUIState {
    const { state } = useLocationListViewModel(locationRepository);

    if (state.status === 'loaded') {
        return { status: 'loaded', locationsArray: state.locations };
    }
    return state;
}
