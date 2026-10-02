import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { Surfaces } from '@/constants/Surfaces';

export interface InfoTileProps {
  icon: SymbolViewProps['name'];
  label: string;
  value: string;
}

export const InfoTile = ({ icon, label, value }: InfoTileProps) => (
  <View style={styles.container}>
    <SymbolView name={icon} tintColor={Colors.light.green} size={18} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={2}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surfaces.surface,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgb(95, 99, 100)',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.brown,
  },
});
