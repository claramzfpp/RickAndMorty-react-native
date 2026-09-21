import Colors from '@/constants/Colors';
import { Character } from '@/services/domain/model/Character';
import { mockCharacters } from '@/services/domain/model/__mocks__/Character.mock';
import { preview } from "radon-ide";
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

export const CharacterCellSize = {
  Discover: { width: 140, height: 212 },
  Grid: { width: 169, height: 215 },
} as const;

export interface CharacterCellProps {
  character: Character,
  onPress?: () => void;
  size: typeof CharacterCellSize[keyof typeof CharacterCellSize]
}

const PillStatusComponent = ({ status }: { status: string }) => {
  const getStatusColor = (currentStatus: string): string => {
    switch (currentStatus) {
      case "Alive":
        return Colors.light.green;
      case "Dead":
        return Colors.light.red;
      default:
        return Colors.light.yellow; // Fallback caso seja "Unknown"
    }
  };

  const activeColor = getStatusColor(status);

  return (
    <View
      style={pillStyles.container}
    >
      <View style={[pillStyles.circle, { backgroundColor: activeColor }]} />

      <Text style={[pillStyles.statusLabel, { color: activeColor }]}>{status}</Text>

    </View>
  );
}

const FooterContainer = ({ character, width }: { character: Character, width: number }) => {
  return (
    <View
      style={dynamicStyles.footerContainer(width)}
    >

      <Text style={styles.name}>{character.name}</Text>

      {PillStatusComponent({ status: character.status })}

    </View>
  );
}

export const CharacterCard = ({ character, onPress, size }: CharacterCellProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        size,
        { backgroundColor: "rgb(211, 211, 211)" },
        pressed && styles.pressed,
      ]}
    >
      { // aqui viria a imagem do personagem 
      }

      {FooterContainer({ character: character, width: size.width })}

    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderRadius: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "rgb(237, 242, 243, 1)",
  },
  pressed: {
    opacity: 0.7,
  },
});

const pillStyles = StyleSheet.create({
  container: {
    height: 24,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.light.gray,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    borderRadius: 100
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
  }
});

const dynamicStyles = {
  footerContainer: (width: number): ViewStyle => ({
    width: width,
    height: 72,
    backgroundColor: Colors.light.brown,
    padding: 12,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    gap: 6,
  }),
};

preview(
  <View style={{ padding: 16, gap: 12, flexDirection: 'row' }}>
    <CharacterCard character={mockCharacters[0]} size={CharacterCellSize.Discover} />
    <CharacterCard character={mockCharacters[1]} size={CharacterCellSize.Grid} />
  </View>
);
