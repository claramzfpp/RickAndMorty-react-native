import Colors from '@/constants/Colors';
import { CharacterStatus } from '@/services/domain/model/Character';
import { StyleSheet, Text, View } from 'react-native';

export interface StatusPillProps {
  status: CharacterStatus;
}

const getStatusColor = (status: CharacterStatus): string => {
  switch (status) {
    case "Alive":
      return Colors.light.green;
    case "Dead":
      return Colors.light.red;
    default:
      return Colors.light.yellow; // Fallback caso seja "Unknown"
  }
};

export const StatusPill = ({ status }: StatusPillProps) => {
  const activeColor = getStatusColor(status);

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: activeColor }]} />
      <Text style={[styles.statusLabel, { color: activeColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 24,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.light.gray,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    borderRadius: 100,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
    includeFontPadding: false,
    color: "rgb(95, 99, 100, 1)",
  },
  circle: {
    height: 7,
    width: 7,
    borderRadius: 7 / 2,
  },
});
