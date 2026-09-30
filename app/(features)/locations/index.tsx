import { router, Stack } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationCard } from '@/components/locationsCarousel/LocationCard';
import { useLocationCarouselViewModel } from '@/components/locationsCarousel/locationCarouselViewModel';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getLocationRepository } from '@/services/composition/repositories';

const HEADER_CONTENT_HEIGHT = 44;

export default function LocationsListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const state = useLocationCarouselViewModel(getLocationRepository());

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.gray, paddingTop: insets.top + HEADER_CONTENT_HEIGHT },
      ]}
    >
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />

      {state.status === 'loading' && <ActivityIndicator />}
      {state.status === 'error' && <Text>{state.message}</Text>}

      {state.status === 'loaded' && (
        <FlatList
          data={state.locationsArray}
          keyExtractor={(location) => location.id.value.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
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
    paddingTop: 16,
    gap: 12,
  },
  row: {
    justifyContent: 'center',
    gap: 12,
  },
});
