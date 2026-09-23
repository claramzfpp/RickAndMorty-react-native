import { StyleSheet } from 'react-native';

import { SeasonEpisodesCarousel } from '@/components/season+episodes/SeasonEpisodesCarousel';
import { CharactersCarousel } from '@/components/characters/charactersCarousel/CharactersCarousel';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getCharacterRepository, getEpisodeRepository } from '@/services/composition/repositories';
import { Location } from '@/services/domain/model/Location';
import { mockLocations } from '@/services/domain/model/__mocks__/Location.mock';
import { LocationCard } from '@/components/locationsCarousel/LocationCard';

export default function DiscoverView() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>

      <Text style={styles.title}>Discover</Text>

      <SeasonEpisodesCarousel
        episodeRepository={getEpisodeRepository()}
      />

      <CharactersCarousel
        characterRepository={getCharacterRepository()}
        onSeeAllClick={() => console.log("clickTest")}
      />

      <View style={{ padding: 16, gap: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
                  {mockLocations.map((location, index) => (
                      <LocationCard key={location.id.toString()} location={location} index={index + 1} />
                  ))}
              </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: Colors.light.green
  },
});
