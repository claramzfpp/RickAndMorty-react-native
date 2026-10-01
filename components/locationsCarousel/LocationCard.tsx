import Colors from '@/constants/Colors';
import { Location } from '@/services/domain/model/Location';
import { mockLocations } from '@/services/domain/model/__mocks__/Location.mock';
import { AndroidSymbol, SFSymbol, SymbolView } from 'expo-symbols';
import { preview } from "radon-ide";
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const LocationCellSize = {
    Discover: { width: 160, height: 98 },
    Grid: { width: 189, height: 110 }, 
} as const;

export interface LocationCardProps {
    location: Location;
    index: number,
    size: typeof LocationCellSize[keyof typeof LocationCellSize];
    onPress?: () => void;
}

const headerComponent = ({ type, index }: { type: string, index: number }) => {
    const colorArray = [Colors.light.pink, Colors.light.green, Colors.light.yellow];
    const componentColor = colorArray[index % colorArray.length]

    return (
        <SymbolView
            name={headerIcon({ type })}
            tintColor={componentColor}
            size={28}
        />
    );
}

const headerIcon = ({ type }: { type: string }): { ios: SFSymbol, android: AndroidSymbol, web: AndroidSymbol } => {
    switch (type) {
        case "Planet":
            return {
                ios: 'globe.fill',
                android: 'public',
                web: 'public',
            };

        case "Cluster":
            return {
                ios: 'star.fill',
                android: 'star',
                web: 'star',
            };

        case "Space station":
            return {
                ios: 'antenna.radiowaves.left.and.right',
                android: 'rocket_launch',
                web: 'rocket_launch',
            };

        case "TV":
            return {
                ios: 'tv.fill',
                android: 'tv',
                web: 'tv',
            };

        default:
            return {
                ios: 'mappin.circle.fill',
                android: 'place',
                web: 'place',
            };
    }
}

export const LocationCard = ({ location, index, onPress, size }: LocationCardProps) => {
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
            {headerComponent({ type: location.type, index: index })}

            <Text style={styles.name}>{location.name}</Text>
            <Text style={styles.subtitle}>{location.dimension} </Text>

        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        padding: 15,
        borderRadius: 15,
        justifyContent: 'center',
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.light.brown,
        paddingTop: 5,
    },
    subtitle: {
        fontSize: 11,
        fontWeight: '500',
        color: "rgb(95, 99, 100)",
    },
    pressed: {
        opacity: 0.7,
    },
});

if (__DEV__) {
    preview(
        <View style={{ padding: 16, gap: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
            {mockLocations.map((location, index) => (
                <LocationCard key={location.id.toString()} location={location} index={index} size={LocationCellSize.Discover} />
            ))}
        </View>
    );
}
