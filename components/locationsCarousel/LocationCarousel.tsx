import { GenericCarousel } from '@/components/shared/GenericCarousel';
import { LocationRepository } from '@/services/domain/repository/LocationRepository';
import { router } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import { LocationCard, LocationCellSize } from './LocationCard';
import { useLocationCarouselViewModel } from './locationCarouselViewModel';

export interface LocationCarouselProps {
    locationRepository: LocationRepository;
    onSeeAllClick?: () => void;
}

export const LocationCarousel = ({
    locationRepository,
    onSeeAllClick,
}: LocationCarouselProps) => {
    const state = useLocationCarouselViewModel(locationRepository);

    if (state.status === 'loading') {
        return <ActivityIndicator />;
    }

    if (state.status === 'error') {
        return <Text>{state.message}</Text>;
    }

    return (
        <GenericCarousel
            title="Locations"
            numRows={2}
            onSeeAllClick={onSeeAllClick}
            content={
                <>
                    {state.locationsArray.map((location, index) => (
                        <LocationCard
                            key={location.id.value}
                            location={location}
                            index={index}
                            size={LocationCellSize.Discover}
                            onPress={() => router.push(`/locations/${location.id.value}`)}
                        />
                    ))}
                </>
            }
        />
    );
};
