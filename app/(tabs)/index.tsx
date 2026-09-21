import { StyleSheet } from 'react-native';

import { SeasonEpisodesCarousel } from '@/components/season+episodes/SeasonEpisodesCarousel';
import { CharacterCard, CharacterCellSize } from '@/components/characters/CharacterCard';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getEpisodeRepository } from '@/services/composition/repositories';
import { mockCharacter } from '@/services/domain/model/__mocks__/Character.mock';

export default function DiscoverView() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>

      <Text style={styles.title}>Discover</Text>

      <SeasonEpisodesCarousel
        episodeRepository={getEpisodeRepository()}
      />

      <CharacterCard
        character={mockCharacter}
        size={CharacterCellSize.Discover}
      />

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
