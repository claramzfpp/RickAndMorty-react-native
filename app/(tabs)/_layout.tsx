import { Tabs } from 'expo-router/js-tabs';
import { SymbolView } from 'expo-symbols';

import LiquidGlassTabBar from '@/components/LiquidGlassTabBar';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="discoverView"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'house.fill',
                android: 'code',
                web: 'code',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritesView"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'heart.fill',
                android: 'code',
                web: 'code',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
