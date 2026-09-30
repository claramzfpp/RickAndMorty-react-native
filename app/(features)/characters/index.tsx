import { router, Stack } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterCard, CharacterCellSize } from '@/components/characters/CharacterCard';
import { useCharacterCarouselViewModel } from '@/components/characters/charactersCarousel/characterCarouselViewModel';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getCharacterRepository } from '@/services/composition/repositories';

const HEADER_CONTENT_HEIGHT = 44;

export default function CharactersListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const state = useCharacterCarouselViewModel(getCharacterRepository());

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.gray, paddingTop: insets.top + HEADER_CONTENT_HEIGHT },
      ]}
    >
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />

      {state.status === 'loading' && <ActivityIndicator />}
      {state.status === 'error' && <Text>{state.message}</Text>}

      {state.status === 'loaded' && (
        <ScrollView
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {state.charactersArray.map(character => (
            <CharacterCard
              key={character.id.value}
              character={character}
              size={CharacterCellSize.Grid}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
});
