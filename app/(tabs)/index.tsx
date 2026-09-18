import { StyleSheet } from 'react-native';

import { SeasonEpisodesCarousel } from '@/components/season+episodes/SeasonEpisodesCarousel';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getEpisodeRepository } from '@/services/composition/repositories';

export default function DiscoverView() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>

      <Text style={styles.title}>Discover</Text>

      <SeasonEpisodesCarousel
        episodeRepository={getEpisodeRepository()}
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
