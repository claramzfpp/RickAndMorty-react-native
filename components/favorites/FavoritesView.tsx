import { useFocusEffect, useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterCard, CharacterCellSize } from '@/components/characters/CharacterCard';
import { TAB_BAR_OCCUPIED_HEIGHT } from '@/components/shared/CustomTabBar';
import { SearchErrorState, SearchLoadingState } from '@/components/shared/SearchStateViews';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { CharacterRepository } from '@/services/domain/repository/CharacterRepository';
import { FavoritesRepository } from '@/services/domain/repository/FavoritesRepository';

import { useFavoritesViewModel } from './favoritesViewModel';

export interface FavoritesViewProps {
  favoritesRepository: FavoritesRepository;
  characterRepository: CharacterRepository;
}

export function FavoritesView({ favoritesRepository, characterRepository }: FavoritesViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, reload } = useFavoritesViewModel(favoritesRepository, characterRepository);

  // Reload on every focus so a heart toggled in character details shows up immediately.
  useFocusEffect(reload);

  const savedCount = state.status === 'loaded' ? state.characters.length : 0;
  const subtitle = `${savedCount} ${savedCount === 1 ? 'character' : 'characters'} saved`;

  const header = (
    <View style={styles.header}>
      <Text style={styles.title}>Favorites</Text>
      {state.status === 'loaded' && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>
      {state.status === 'loaded' ? (
        <FlatList
          data={state.characters}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={header}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top, paddingBottom: TAB_BAR_OCCUPIED_HEIGHT + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CharacterCard
              character={item}
              size={CharacterCellSize.Grid}
              onPress={() => router.push(`/characters/${item.id.toString()}`)}
            />
          )}
        />
      ) : (
        <View style={[styles.content, { paddingTop: insets.top }]}>
          {header}
          {state.status === 'loading' && <SearchLoadingState />}
          {state.status === 'error' && <SearchErrorState message={state.message} onRetry={reload} />}
          {state.status === 'empty' && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptyMessage}>Tap the heart on a character to save it.</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 12,
  },
  header: {
    alignSelf: 'stretch',
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: Colors.light.green,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.brown,
  },
  row: {
    justifyContent: 'center',
    gap: 12,
  },
  empty: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 24,
    backgroundColor: 'transparent',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.brown,
  },
  emptyMessage: {
    fontSize: 15,
    color: Colors.light.brown,
    textAlign: 'center',
  },
});
