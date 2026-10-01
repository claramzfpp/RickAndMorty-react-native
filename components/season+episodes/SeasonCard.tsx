import Colors from '@/constants/Colors';
import { preview } from "radon-ide";
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface SeasonCardProps {
    season: {
        number: number;
        episodesNumber: number;
    };
    onPress?: () => void;
}

const headerComponent = ({ seasonNumber }: { seasonNumber: number }) => {
    const colorArray = [Colors.light.pink, Colors.light.green, Colors.light.yellow];
    const componentColor = colorArray[(seasonNumber - 1) % colorArray.length]

    if (seasonNumber > 5) {
        return <Text style={styles.noDetails}>No details available</Text>;
    }

    return (
        <View style={[styles.pill, { backgroundColor: componentColor }]} />
    );
}

export const SeasonCard = ({ season, onPress }: SeasonCardProps) => {
    const noDetailsAvailable = (season.number > 5)

    return (
        <Pressable
            onPress={onPress}
            disabled={noDetailsAvailable}
            style={({ pressed }) => [
                styles.container,
                { backgroundColor: "rgb(211, 211, 211)" },
                pressed && !noDetailsAvailable && styles.pressed,
                noDetailsAvailable && styles.disabled,
            ]}
        >
            {headerComponent({ seasonNumber: season.number })}

            <Text style={styles.number}>{season.number}</Text>
            <Text style={styles.season}>Season </Text>

            {!noDetailsAvailable && (
                <Text style={styles.episodesNumber}>{season.episodesNumber} episodes</Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        width: 130,
        height: 129,
    },
    number: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.brown,
        paddingTop: 5,
    },
    season: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.brown,
    },
    episodesNumber: {
        fontSize: 11,
        fontWeight: '500',
        color: "rgb(95, 99, 100)",
    },
    noDetails: {
        fontSize: 11,
        fontWeight: '500',
        color: Colors.light.red,
    },
    pill: {
        width: 47,
        height: 7,
        borderRadius: 12,

    },
    pressed: {
        opacity: 0.7,
    },
    disabled: {
        opacity: 0.4,
    },
});

if (__DEV__) {
    preview(
        <View style={{ padding: 16, gap: 12 }}>
            <SeasonCard season={{ number: 1, episodesNumber: 10 }} />
            <SeasonCard season={{ number: 2, episodesNumber: 10 }} />
            <SeasonCard season={{ number: 6, episodesNumber: 12 }} />
        </View>
    );
}


