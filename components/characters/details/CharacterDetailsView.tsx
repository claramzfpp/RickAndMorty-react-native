import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/characters/StatusPill';
import { SearchErrorState, SearchLoadingState } from '@/components/shared/SearchStateViews';
import Colors from '@/constants/Colors';

import { CharacterDetailsUIState } from './characterDetailsUIState';
import { InfoTile } from './InfoTile';

const HERO_HEIGHT = 440;
const SHEET_OVERLAP = 24;

export interface CharacterDetailsViewProps {
  state: CharacterDetailsUIState;
  onRetry: () => void;
}

export const CharacterDetailsView = ({ state, onRetry }: CharacterDetailsViewProps) => (
  <View style={styles.container}>
    {state.status === 'loading' && <SearchLoadingState topOffset={HERO_HEIGHT / 2} />}
    {state.status === 'error' && (
      <View style={styles.errorWrapper}>
        <SearchErrorState message={state.message} onRetry={onRetry} />
      </View>
    )}
    {state.status === 'loaded' && (
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <Image
          source={{ uri: state.character.image }}
          style={styles.hero}
          resizeMode="cover"
          accessibilityLabel={state.character.name}
        />
        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>{state.character.name}</Text>
            <StatusPill status={state.character.status} />
          </View>
          <View style={styles.tiles}>
            <InfoTile
              icon={{ ios: 'allergens', android: 'science', web: 'science' }}
              label="Species"
              value={state.character.species}
            />
            <InfoTile
              icon={{ ios: 'person', android: 'person', web: 'person' }}
              label="Gender"
              value={state.character.gender}
            />
            <InfoTile
              icon={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
              label="Origin"
              value={state.character.origin}
            />
          </View>
        </View>
      </ScrollView>
    )}
    <View style={styles.accentBar}>
      <View style={[styles.segment, { backgroundColor: Colors.light.green }]} />
      <View style={[styles.segment, { backgroundColor: Colors.light.yellow }]} />
      <View style={[styles.segment, { backgroundColor: Colors.light.pink }]} />
      <View style={[styles.segment, { backgroundColor: Colors.light.red }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.gray,
  },
  errorWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
  },
  sheet: {
    flexGrow: 1,
    marginTop: -SHEET_OVERLAP,
    backgroundColor: Colors.light.gray,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 26,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    color: Colors.light.green,
  },
  tiles: {
    flexDirection: 'row',
    gap: 12,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
  },
});
