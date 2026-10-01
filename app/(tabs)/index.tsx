import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiscoverSearchResults } from '@/components/discover/DiscoverSearchResults';
import { useDiscoverSearch } from '@/components/discover/discoverSearchViewModel';
import { TAB_BAR_OCCUPIED_HEIGHT } from '@/components/shared/CustomTabBar';
import { SafeAreaBlur } from '@/components/shared/SafeAreaBlur';
import { SearchBar } from '@/components/shared/SearchBar';
import { SeasonEpisodesCarousel } from '@/components/season+episodes/SeasonEpisodesCarousel';
import { CharactersCarousel } from '@/components/characters/charactersCarousel/CharactersCarousel';
import { LocationCarousel } from '@/components/locationsCarousel/LocationCarousel';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getCharacterRepository, getEpisodeRepository, getLocationRepository } from '@/services/composition/repositories';

export default function DiscoverView() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const characterRepository = getCharacterRepository();
  const locationRepository = getLocationRepository();
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const search = useDiscoverSearch(characterRepository, locationRepository, debouncedQuery);

  return (
    <View style={[styles.root, { backgroundColor: colors.gray }]}>
      <ScrollView
        style={{ backgroundColor: colors.gray }}
        contentContainerStyle={[styles.container, { paddingTop: insets.top, paddingBottom: TAB_BAR_OCCUPIED_HEIGHT + 16 }]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={(event) => setIsScrolled(event.nativeEvent.contentOffset.y > 0)}
      >

        <Text style={styles.title}>Discover</Text>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search characters and locations"
        />

        {search.isSearching ? (
          <DiscoverSearchResults
            characters={search.characters}
            locations={search.locations}
            query={debouncedQuery.trim()}
            onRetryCharacters={search.retryCharacters}
            onRetryLocations={search.retryLocations}
          />
        ) : (
          <>
            <SeasonEpisodesCarousel
              episodeRepository={getEpisodeRepository()}
            />

            <CharactersCarousel
              characterRepository={characterRepository}
              onSeeAllClick={() => router.push('/characters')}
            />

            <LocationCarousel
              locationRepository={locationRepository}
              onSeeAllClick={() => router.push('/locations')}
            />
          </>
        )}

      </ScrollView>
      {isScrolled && <SafeAreaBlur />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    gap: 10
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: Colors.light.green
  },
});
