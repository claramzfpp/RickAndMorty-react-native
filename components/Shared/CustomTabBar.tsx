import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// definindo constantes para o tamanho da barra, margens e espaçamento do "pill" (indicador de seleção)
const BAR_HEIGHT = 54;
const BAR_HORIZONTAL_MARGIN = 54;
const BAR_BOTTOM_MARGIN = 24;
const PILL_INSET = 6;

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  //pegando o esquema de cores atual (claro ou escuro) e as cores correspondentes do arquivo Colors.ts
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();

  // calculando a largura da barra e a largura de cada item (aba) com base no número de rotas
  const barWidth = width - BAR_HORIZONTAL_MARGIN * 5;
  const itemWidth = (barWidth - PILL_INSET * 2) / state.routes.length;

  // usando o hook useSharedValue do Reanimated para criar 
  // uma variável animada que representa a posição do "pill" (indicador de seleção) com 
  // base no índice da aba selecionada
  const pillOffset = useSharedValue(state.index * itemWidth);

  useEffect(() => {
    pillOffset.value = withSpring(state.index * itemWidth, {
      damping: 25,
      stiffness: 250,
      mass: 1,
    });
  }, [state.index, itemWidth, pillOffset]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillOffset.value }],
  }));

  return (
    <View style={[styles.wrapper, { width: barWidth }]} pointerEvents="box-none">
      <BlurView
        intensity={70}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.blur}>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.pill,
              {
                width: itemWidth,
                backgroundColor: colors.tabBarSelectedBackground,
              },
              pillStyle,
            ]}
          />
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const color = isFocused ? colors.background : colors.tabIconDefault;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={[styles.item, { width: itemWidth }]}>
                {options.tabBarIcon?.({ focused: isFocused, color, size: 26 })}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: BAR_BOTTOM_MARGIN,
    alignSelf: 'center',
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  blur: {
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
    paddingHorizontal: PILL_INSET,
  },
  pill: {
    position: 'absolute',
    left: PILL_INSET,
    height: BAR_HEIGHT - PILL_INSET * 2,
    borderRadius: (BAR_HEIGHT - PILL_INSET * 2) / 2,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
