import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, View as RNView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCharacterCarouselViewModel } from '@/components/characters/charactersCarousel/characterCarouselViewModel';
import { Text, View } from '@/components/shared/Themed';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';
import { getCharacterRepository } from '@/services/composition/repositories';

const HEADER_CONTENT_HEIGHT = 44;
const BUTTON_SIZE = 44;
const BUTTON_INSET = 4;

interface BackButtonProps {
  onPress: () => void;
}

export const HeaderBackButton = ({ onPress }: BackButtonProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    // Wrapper com o mesmo sistema de sombras e bordas arredondadas da sua barra
    <View style={styles.wrapper}>
      <RNView
        style={[
          styles.blur,
          {
            backgroundColor:
              colorScheme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(152, 149, 140, 0.83)',
          },
        ]}
      >
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <SymbolView
            name="chevron.backward"
            tintColor={colors.brown}
            size={18}
          />
        </Pressable>
      </RNView>
    </View>
  );
};

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
        unstable_headerLeftItems: () => [
          {
            type: 'custom',
            element: <HeaderBackButton onPress={() => router.back()} />,
            hidesSharedBackground: true,
          },
        ],
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
  wrapper: {
    alignSelf: 'center',
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    // Mesma sombra exata da sua CustomTabBar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginLeft: 8, 
  },
  blur: {
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    padding: BUTTON_INSET,
  },
  button: {
    width: BUTTON_SIZE - BUTTON_INSET * 2,
    height: BUTTON_SIZE - BUTTON_INSET * 2,
    borderRadius: (BUTTON_SIZE - BUTTON_INSET * 2) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Ajuste óptico leve para centralizar a seta do chevron perfeitamente
    paddingRight: 2, 
  },
});
