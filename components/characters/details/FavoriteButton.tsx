import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View as RNView } from 'react-native';

import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';

const BUTTON_SIZE = 44;
const BUTTON_INSET = 4;

export interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
}

export const FavoriteButton = ({ isFavorite, onPress }: FavoriteButtonProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    // Same wrapper split as HeaderCircleButton: the shadow can't live on the clipping view.
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
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}
        >
          <SymbolView
            name={isFavorite
              ? { ios: 'heart.fill', android: 'favorite', web: 'favorite' }
              : { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
            tintColor={isFavorite ? colors.pink : colors.brown}
            size={18}
          />
        </Pressable>
      </RNView>
    </RNView>
  );
};

/** Item for `unstable_headerRightItems`; same style as `headerSearchButtonItem`. */
export const headerFavoriteButtonItem = (isFavorite: boolean, onPress: () => void) => ({
  type: 'custom' as const,
  element: <FavoriteButton isFavorite={isFavorite} onPress={onPress} />,
  hidesSharedBackground: true,
});

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
