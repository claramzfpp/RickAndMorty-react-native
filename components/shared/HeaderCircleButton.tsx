import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View as RNView } from 'react-native';

import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';

const BUTTON_SIZE = 44;
const BUTTON_INSET = 4;

interface HeaderCircleButtonProps {
  symbol: SymbolViewProps['name'];
  accessibilityLabel: string;
  onPress: () => void;
  /** Compensates the optical center of asymmetric symbols (e.g. chevron). */
  iconPaddingRight?: number;
}

export const HeaderCircleButton = ({
  symbol,
  accessibilityLabel,
  onPress,
  iconPaddingRight = 0,
}: HeaderCircleButtonProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    // The shadow lives on the outer wrapper; the inner view clips with overflow: 'hidden',
    // which would otherwise cut the shadow off.
    <RNView style={styles.shadow}>
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
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.6 : 1, paddingRight: iconPaddingRight },
          ]}
        >
          <SymbolView name={symbol} tintColor={colors.brown} size={18} />
        </Pressable>
      </RNView>
    </RNView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    alignSelf: 'center',
    borderRadius: BUTTON_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
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
  },
});
