import { LocationInfoTile } from '@/components/locationsCarousel/details/LocationInfoTile';
import { LocationDetailsUIState } from '@/components/locationsCarousel/details/locationDetailsUIState';
import { SearchErrorState, SearchLoadingState } from '@/components/shared/SearchStateViews';
import Colors from '@/constants/Colors';
import { Surfaces } from '@/constants/Surfaces';
import { AndroidSymbol, SFSymbol, SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

export interface LocationDetailsViewProps {
    state: LocationDetailsUIState;
    onRetry: () => void;
}

// Duplicated from LocationCard (which must not be edited); candidate for a shared helper.
const heroIcon = (type: string): { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol } => {
    switch (type) {
        case 'Planet':
            return { ios: 'globe.fill', android: 'public', web: 'public' };
        case 'Cluster':
            return { ios: 'star.fill', android: 'star', web: 'star' };
        case 'Space station':
            return { ios: 'antenna.radiowaves.left.and.right', android: 'rocket_launch', web: 'rocket_launch' };
        case 'TV':
            return { ios: 'tv.fill', android: 'tv', web: 'tv' };
        default:
            return { ios: 'mappin.circle.fill', android: 'place', web: 'place' };
    }
};

// The API returns empty strings for some fields; a blank tile would look broken.
const displayValue = (value: string) => (value.trim() === '' ? 'unknown' : value);

export const LocationDetailsView = ({ state, onRetry }: LocationDetailsViewProps) => {
    if (state.status === 'loading') {
        return (
            <View style={styles.centered}>
                <SearchLoadingState />
            </View>
        );
    }

    if (state.status === 'error') {
        return (
            <View style={styles.centered}>
                <SearchErrorState message={state.message} onRetry={onRetry} />
            </View>
        );
    }

    const { location } = state;

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <SymbolView name={heroIcon(location.type)} tintColor={Colors.light.pink} size={72} />
            </View>

            <View style={styles.sheet}>
                <Text style={styles.title}>{displayValue(location.name)}</Text>
                <View style={styles.tiles}>
                    <LocationInfoTile
                        icon={{ ios: 'tag.fill', android: 'sell', web: 'sell' }}
                        label="Type"
                        value={displayValue(location.type)}
                    />
                    <LocationInfoTile
                        icon={{ ios: 'circle.hexagongrid.fill', android: 'orbit', web: 'orbit' }}
                        label="Dimension"
                        value={displayValue(location.dimension)}
                    />
                </View>
            </View>

            <View style={styles.accentBar}>
                <View style={[styles.segment, { backgroundColor: Colors.light.green }]} />
                <View style={[styles.segment, { backgroundColor: Colors.light.yellow }]} />
                <View style={[styles.segment, { backgroundColor: Colors.light.pink }]} />
                <View style={[styles.segment, { backgroundColor: Colors.light.red }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.gray,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.light.gray,
    },
    hero: {
        height: 260,
        backgroundColor: Surfaces.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheet: {
        flex: 1,
        marginTop: -24,
        backgroundColor: Colors.light.gray,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.light.green,
    },
    tiles: {
        flexDirection: 'row',
        gap: 12,
    },
    accentBar: {
        flexDirection: 'row',
        height: 6,
    },
    segment: {
        flex: 1,
    },
});
