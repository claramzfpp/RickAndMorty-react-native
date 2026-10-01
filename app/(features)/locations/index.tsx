import { router, Stack } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationCard, LocationCellSize } from '@/components/locationsCarousel/LocationCard';
import { useLocationListViewModel } from '@/components/locationsCarousel/locationListViewModel';
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
  const { state, loadMore } = useLocationListViewModel(getLocationRepository());

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
          data={state.locations}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            state.isLoadingMore ? (
              <ActivityIndicator />
            ) : state.loadMoreError !== undefined ? (
              <Pressable onPress={loadMore}>
                <Text>Tentar novamente</Text>
              </Pressable>
            ) : null
          }
          keyExtractor={(location) => location.id.value.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <LocationCard location={item} index={index} size={LocationCellSize.Grid} />
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
