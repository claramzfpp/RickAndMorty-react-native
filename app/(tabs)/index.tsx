import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { CharacterRepositoryImpl } from '@/services/data/repositoryImplementation/CharacterRepositoryImpl';
import { EpisodeRepositoryImpl } from '@/services/data/repositoryImplementation/EpisodeRepositoryImpl';
import { LocationRepositoryImpl } from '@/services/data/repositoryImplementation/LocationRepositoryImpl';
import { Character } from '@/services/domain/model/Character';
import { Episode } from '@/services/domain/model/Episode';
import { Location } from '@/services/domain/model/Location';

const characterRepository = new CharacterRepositoryImpl();
const episodeRepository = new EpisodeRepositoryImpl();
const locationRepository = new LocationRepositoryImpl();

export default function DiscoverView() {
  // pegando o esquema de cores atual (claro ou escuro) e as cores correspondentes do arquivo Colors.ts
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    episodeRepository
      .loadAllEpisodes()
      .then(() => setEpisodes(episodeRepository.getEpisodesBySeason(1)))
      .catch((e) => {
        console.error('Falha ao carregar episódios', e);
        setError('Falha ao carregar episódios');
      });
  }, []);

  useEffect(() => {
    locationRepository
      .loadAllLocations()
      .then(() => setLocations(locationRepository.getAllLocations()))
      .catch((e) => {
        console.error('Falha ao carregar localizações', e);
        setError('Falha ao carregar localizações');
      });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>
      {error && <Text>{error}</Text>}

      <FlatList
        style={styles.list}
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />

      <FlatList
        style={styles.list}
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#67159C',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  list: {
    width: '100%',
  },
  item: {
    paddingVertical: 8,
    textAlign: 'center',
  },
});
