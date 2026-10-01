import { router, Stack } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterCard, CharacterCellSize } from '@/components/characters/CharacterCard';
import { useCharacterListViewModel } from '@/components/characters/charactersCarousel/characterListViewModel';
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
  const { state, loadMore } = useCharacterListViewModel(getCharacterRepository());

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
        <FlatList
          data={state.characters}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            state.isLoadingMore ? (
              <ActivityIndicator />
            ) : state.loadMoreError !== undefined ? (
              <Pressable onPress={loadMore}>
                <Text>Tentar novamente</Text>
              </Pressable>
            ) : null
          }
          keyExtractor={(character) => character.id.value.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
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
    alignItems: 'center',
  },
  content: {
    paddingTop: 16,
    gap: 12,
  },
  row: {
    justifyContent: 'center',
    gap: 12,
  },
});
