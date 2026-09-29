import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { CharacterCard, CharacterCellSize } from '@/components/characters/CharacterCard';
import { useCharacterCarouselViewModel } from '@/components/characters/charactersCarousel/characterCarouselViewModel';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getCharacterRepository } from '@/services/composition/repositories';

export default function CharactersListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const state = useCharacterCarouselViewModel(getCharacterRepository());

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>
      <Stack.Screen options={{ title: 'Characters' }} />

      {state.status === 'loading' && <ActivityIndicator />}
      {state.status === 'error' && <Text>{state.message}</Text>}

      {state.status === 'loaded' && (
        <FlatList
          data={state.charactersArray}
          keyExtractor={(character) => character.id.value.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
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
  },
  content: {
    padding: 12,
    gap: 12,
  },
  row: {
    gap: 12,
  },
});
