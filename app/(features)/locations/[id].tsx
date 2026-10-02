import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { headerBackButtonItem } from '@/components/shared/HeaderBackButton';
import { Text, View } from '@/components/shared/Themed';

export default function LocationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        unstable_headerLeftItems: () => [headerBackButtonItem(() => router.back())],
      }} />
      <Text>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
