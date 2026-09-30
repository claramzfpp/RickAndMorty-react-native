import { router, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        title: 'Characters',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />

      {state.status === 'loading' && <ActivityIndicator />}
      {state.status === 'error' && <Text>{state.message}</Text>}

      {state.status === 'loaded' && (
        <Text>dasdasdasdf</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
