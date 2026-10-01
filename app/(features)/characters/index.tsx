import { router, Stack } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterCard, CharacterCellSize } from '@/components/characters/CharacterCard';
import { useCharacterListViewModel } from '@/components/characters/charactersCarousel/characterListViewModel';
import { useCharacterSearchViewModel } from '@/components/characters/charactersCarousel/characterSearchViewModel';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { SearchBar } from '@/components/shared/SearchBar';
import { SearchEmptyState, SearchErrorState, SearchLoadingState } from '@/components/shared/SearchStateViews';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { HEADER_CONTENT_HEIGHT, isIOS } from '@/constants/Header';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Character } from '@/services/domain/model/Character';
import { getCharacterRepository } from '@/services/composition/repositories';

export default function CharactersListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const contentTopPadding = isIOS ? headerHeight + 16 : 16;
  const repository = getCharacterRepository();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const isSearching = debouncedQuery.trim() !== '';
  const list = useCharacterListViewModel(repository);
  const search = useCharacterSearchViewModel(repository, debouncedQuery);
  const loadMore = isSearching ? search.loadMore : list.loadMore;

  // Normalize list/search states into one shape so the rendering below is shared.
  type ScreenState =
    | { status: 'loading' }
    | { status: 'empty' }
    | { status: 'error'; message: string }
    | { status: 'loaded'; items: Character[]; isLoadingMore: boolean; loadMoreError?: string };
  let view: ScreenState;
  if (isSearching) {
    const s = search.state;
    view = s.status === 'idle' ? { status: 'loading' } : s;
  } else {
    const s = list.state;
    view = s.status === 'loaded'
      ? { status: 'loaded', items: s.characters, isLoadingMore: s.isLoadingMore, loadMoreError: s.loadMoreError }
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
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />

      <View style={[styles.searchBar, { paddingTop: contentTopPadding }]}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search characters"
        />
      </View>

      {view.status === 'loading' && <SearchLoadingState />}
      {view.status === 'empty' && <SearchEmptyState query={debouncedQuery.trim()} />}
      {view.status === 'error' && (
        isSearching
          ? <SearchErrorState message={view.message} onRetry={search.retry} />
          : <Text>{view.message}</Text>
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
            { paddingTop: 12, paddingBottom: insets.bottom + 16 },
          ]}
          scrollIndicatorInsets={isIOS ? { top: headerHeight } : undefined}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CharacterCard character={item} size={CharacterCellSize.Grid} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchBar: {
    alignSelf: 'stretch',
    paddingHorizontal: 12,
  },
  content: {
    gap: 12,
  },
  row: {
    justifyContent: 'center',
    gap: 12,
  },
});
