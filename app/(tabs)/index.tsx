import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Character } from '@/services/domain/model/Character';
import { CharacterRepositoryImpl } from '@/services/data/repositoryImplementation/CharacterRepositoryImpl';

const characterRepository = new CharacterRepositoryImpl();

export default function DiscoverView() {
  // pegando o esquema de cores atual (claro ou escuro) e as cores correspondentes do arquivo Colors.ts
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    characterRepository
      .loadNextPage()
      .then(() => setCharacters(characterRepository.characters))
      .catch(() => setError('Falha ao carregar personagens'));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>
      {error && <Text>{error}</Text>}

      <FlatList
        style={styles.list}
        data={characters}
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
