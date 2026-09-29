import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { SeasonEpisodesCarousel } from '@/components/season+episodes/SeasonEpisodesCarousel';
import { CharactersCarousel } from '@/components/characters/charactersCarousel/CharactersCarousel';
import { LocationCarousel } from '@/components/locationsCarousel/LocationCarousel';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getCharacterRepository, getEpisodeRepository, getLocationRepository } from '@/services/composition/repositories';

// app/ → só as telas (index.tsx, [id].tsx), propositalmente "magras": elas chamam o hook do view model e renderizam o componente, 
// mas não guardam lógica de UI ou de estado nelas mesmas.
// 
// components/ → os blocos reutilizáveis de apresentação: os Cards, os Carrossels, os ViewModels (useCharacterCarouselViewModel) e os UI States. 
// Nada aqui sabe que existe uma rota, um CharactersCarousel pode, em tese, ser usado em duas telas diferentes sem saber de nenhuma delas.
// 
//services/ → Domain e Data (repositórios, entidades, mappers) — a camada mais pura, sem nada de UI.
//
// o index é basicamente a rota de entrada para uma pasta (principal arquivo de referencia numa navegação (acho))

export default function DiscoverView() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>

      <Text style={styles.title}>Discover</Text>

      <SeasonEpisodesCarousel
        episodeRepository={getEpisodeRepository()}
      />

      <CharactersCarousel
        characterRepository={getCharacterRepository()}
        onSeeAllClick={() => router.push('/characters')}
      />

      <LocationCarousel
        locationRepository={getLocationRepository()}
        onSeeAllClick={() => router.push('/locations')}
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
    gap: 10
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: Colors.light.green
  },
});
