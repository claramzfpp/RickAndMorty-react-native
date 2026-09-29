import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { LocationCard } from '@/components/locationsCarousel/LocationCard';
import { useLocationCarouselViewModel } from '@/components/locationsCarousel/locationCarouselViewModel';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getLocationRepository } from '@/services/composition/repositories';

export default function LocationsListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const state = useLocationCarouselViewModel(getLocationRepository());

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>
      <Stack.Screen options={{ title: 'Locations' }} />

      {state.status === 'loading' && <ActivityIndicator />}
      {state.status === 'error' && <Text>{state.message}</Text>}

      {state.status === 'loaded' && (
        <FlatList
          data={state.locationsArray}
          keyExtractor={(location) => location.id.value.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
          renderItem={({ item, index }) => (
            <LocationCard location={item} index={index} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    gap: 12,
  },
  row: {
    gap: 12,
  },
});
