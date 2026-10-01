import { router, Stack } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterCard, CharacterCellSize } from '@/components/characters/CharacterCard';
import { useCharacterListViewModel } from '@/components/characters/charactersCarousel/characterListViewModel';
import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { HEADER_CONTENT_HEIGHT, isIOS } from '@/constants/Header';
import { getCharacterRepository } from '@/services/composition/repositories';

export default function CharactersListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const contentTopPadding = isIOS ? headerHeight + 16 : 16;
  const { state, loadMore } = useCharacterListViewModel(getCharacterRepository());

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.gray,
          paddingTop: isIOS ? 0 : insets.top + HEADER_CONTENT_HEIGHT,
        },
      ]}
    >
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />

      {state.status === 'loading' && <ActivityIndicator style={{ marginTop: contentTopPadding }} />}
      {state.status === 'error' && <Text style={{ marginTop: contentTopPadding }}>{state.message}</Text>}

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
          contentContainerStyle={[
            styles.content,
            { paddingTop: contentTopPadding, paddingBottom: insets.bottom + 16 },
          ]}
          scrollIndicatorInsets={isIOS ? { top: headerHeight } : undefined}
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
    gap: 12,
  },
  row: {
    justifyContent: 'center',
    gap: 12,
  },
});
