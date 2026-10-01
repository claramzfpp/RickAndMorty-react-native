import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from './useColorScheme';

/** Blur strip over the top safe area so content scrolling underneath doesn't collide with the status bar. Doesn't capture touches. */
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
