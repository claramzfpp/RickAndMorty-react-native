import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from './useColorScheme';

/** Faixa de blur sobre a safe area superior, para o conteúdo que rola por baixo não colidir com a status bar. Não captura toques. */
export const SafeAreaBlur = () => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      pointerEvents="none"
      intensity={70}
      tint={colorScheme === 'dark' ? 'dark' : 'light'}
      style={[styles.blur, { height: insets.top }]}
    />
  );
};

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
