import { Character } from '@/services/domain/model/Character';
import { mockCharacters } from '@/services/domain/model/__mocks__/Character.mock';
import { preview } from "radon-ide";
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { CharacterFooter } from './CharacterFooter';

export const CharacterCellSize = {
  Discover: { width: 140, height: 212 },
  Grid: { width: 189, height: 235 },
} as const;

export interface CharacterCellProps {
  character: Character;
  onPress?: () => void;
  size: typeof CharacterCellSize[keyof typeof CharacterCellSize];
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
      <Image
        source={{ uri: character.image }}
        style={{ flex: 1, width: size.width, resizeMode: 'cover' }}
      />

      <CharacterFooter character={character} width={size.width} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderRadius: 16,
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: "rgb(211, 211, 211)",
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});

if (__DEV__) {
  preview(
    <View style={{ padding: 16, gap: 12, flexDirection: 'row' }}>
      <CharacterCard character={mockCharacters[0]} size={CharacterCellSize.Discover} />
      <CharacterCard character={mockCharacters[1]} size={CharacterCellSize.Grid} />
    </View>
  );
}
