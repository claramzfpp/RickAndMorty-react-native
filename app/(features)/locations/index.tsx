import { router, Stack } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationCard, LocationCellSize } from '@/components/locationsCarousel/LocationCard';
import { useLocationListViewModel } from '@/components/locationsCarousel/locationListViewModel';
import { useLocationSearchViewModel } from '@/components/locationsCarousel/locationSearchViewModel';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { HeaderSearchButton, headerSearchButtonItem } from '@/components/shared/HeaderSearchButton';
import { SearchBar } from '@/components/shared/SearchBar';
import { SearchEmptyState, SearchErrorState, SearchLoadingState } from '@/components/shared/SearchStateViews';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { HEADER_CONTENT_HEIGHT, isIOS } from '@/constants/Header';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Location } from '@/services/domain/model/Location';
import { getLocationRepository } from '@/services/composition/repositories';

const SEARCH_BAR_HEIGHT = 44;

export default function LocationsListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const contentTopPadding = isIOS ? headerHeight + 16 : 16;
  const repository = getLocationRepository();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setQuery('');
    setIsSearchOpen(false);
  };
  const debouncedQuery = useDebouncedValue(query);
  const isSearching = debouncedQuery.trim() !== '';
  const list = useLocationListViewModel(repository);
  const search = useLocationSearchViewModel(repository, debouncedQuery);
  const loadMore = isSearching ? search.loadMore : list.loadMore;

  // Normalize list/search states into one shape so the rendering below is shared.
  type ScreenState =
    | { status: 'loading' }
    | { status: 'empty' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; items: Location[]; isLoadingMore: boolean; loadMoreError?: string };
  let view: ScreenState;
  if (isSearching) {
    const s = search.state;
    view = s.status === 'idle' ? { status: 'loading' } : s;
  } else {
    const s = list.state;
    view = s.status === 'loaded'
      ? { status: 'loaded', items: s.locations, isLoadingMore: s.isLoadingMore, loadMoreError: s.loadMoreError }
      : s;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.gray,
          paddingTop: isIOS ? 0 : insets.top + HEADER_CONTENT_HEIGHT,
        },
      ]}
    >
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        headerBackVisible: isSearchOpen ? false : undefined,
        unstable_headerLeftItems: () => isSearchOpen ? [] : [headerBackButtonItem(() => router.back())],
        unstable_headerRightItems: () => isSearchOpen ? [] : [headerSearchButtonItem(openSearch)],
        headerRight: () => isSearchOpen ? null : <HeaderSearchButton onPress={openSearch} />,
      }} />

      {view.status === 'loading' && <SearchLoadingState topOffset={contentTopPadding} />}
      {view.status === 'empty' && (
        <View style={[styles.stateWrapper, { marginTop: contentTopPadding }]}>
          <SearchEmptyState query={debouncedQuery.trim()} />
        </View>
      )}
      {view.status === 'error' && (
        isSearching
          ? (
            <View style={[styles.stateWrapper, { marginTop: contentTopPadding }]}>
              <SearchErrorState message={view.message} onRetry={search.retry} />
            </View>
          )
          : <Text style={{ marginTop: contentTopPadding }}>{view.message}</Text>
      )}

      {view.status === 'loaded' && (
        <FlatList
          data={view.items}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListFooterComponent={
            view.isLoadingMore ? (
              <ActivityIndicator />
            ) : view.loadMoreError !== undefined ? (
              <Pressable onPress={loadMore}>
                <Text>Tentar novamente</Text>
              </Pressable>
            ) : null
          }
          keyExtractor={(item) => item.id.value.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.content,
            { paddingTop: contentTopPadding, paddingBottom: insets.bottom + 16 },
          ]}
          scrollIndicatorInsets={isIOS ? { top: headerHeight } : undefined}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <LocationCard location={item} index={index} size={LocationCellSize.Grid} />
          )}
        />
      )}

      {/* Flutua sobre a área do header (que fica vazia com a busca aberta), assim a lista continua rolando por baixo do header transparente. */}
      {isSearchOpen && (
        <View
          style={[
            styles.searchBar,
            { top: isIOS ? insets.top : insets.top + (HEADER_CONTENT_HEIGHT - SEARCH_BAR_HEIGHT) / 2 },
          ]}
        >
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search locations"
            onClear={closeSearch}
            alwaysShowClear
            autoFocus
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  stateWrapper: {
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  content: {
    gap: 12,
  },
  row: {
    justifyContent: 'center',
    gap: 12,
  },
});
