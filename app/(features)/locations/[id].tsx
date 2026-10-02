import { router, Stack, useLocalSearchParams } from 'expo-router';

import { LocationDetailsView } from '@/components/locationsCarousel/details/LocationDetailsView';
import { useLocationDetailsViewModel } from '@/components/locationsCarousel/details/locationDetailsViewModel';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { getLocationRepository } from '@/services/composition/repositories';

export default function LocationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, retry } = useLocationDetailsViewModel(getLocationRepository(), id);

  return (
    <>
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />
      <LocationDetailsView state={state} onRetry={retry} />
    </>
  );
}
