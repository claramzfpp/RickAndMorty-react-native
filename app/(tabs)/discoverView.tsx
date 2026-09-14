import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabOneScreen() {
  // pegando o esquema de cores atual (claro ou escuro) e as cores correspondentes do arquivo Colors.ts
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.gray }]}>
      <Text style={styles.title}>Title</Text> 

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <EditScreenInfo path="app/(tabs)/index.tsx" />

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
