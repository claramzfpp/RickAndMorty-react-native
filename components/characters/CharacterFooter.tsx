import Colors from '@/constants/Colors';
import { Character } from '@/services/domain/model/Character';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { StatusPill } from './StatusPill';

export interface CharacterFooterProps {
  character: Character;
  width: number;
}

export const CharacterFooter = ({ character, width }: CharacterFooterProps) => {
  return (
    <View style={dynamicStyles.container(width)}>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {character.name}
      </Text>
      <StatusPill status={character.status} />
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "rgb(237, 242, 243, 1)",
  },
});

const dynamicStyles = {
  container: (width: number): ViewStyle => ({
    width,
    height: 72,
    backgroundColor: Colors.light.brown,
    padding: 12,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    gap: 6,
  }),
};
