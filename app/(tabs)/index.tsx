import { StyleSheet } from 'react-native';

import '@/components/season+episodes/SeasonCard';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// TODO: when repositories are wired back into this view, do NOT import *RepositoryImpl
// classes directly — depend on the domain repository interfaces and inject them via a
// composition-root (factory module or Context provider), not decided yet.
export default function DiscoverView() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>
      <Text style={styles.title}>Discover</Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#67159C',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
