import Colors from '@/constants/Colors';
import { Surfaces } from '@/constants/Surfaces';
import { Episode } from '@/services/domain/model/Episode';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

export interface EpisodeRowProps {
    episode: Episode;
}

export const EpisodeRow = ({ episode }: EpisodeRowProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.badge}>
                <SymbolView
                    name={{ ios: 'tv.fill', android: 'tv', web: 'tv' }}
                    tintColor={Colors.light.green}
                    size={18}
                />
            </View>
            <View style={styles.texts}>
                <Text style={styles.title}>{episode.name}</Text>
                <Text style={styles.subtitle}>{episode.airDate}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Surfaces.border,
    },
    badge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Surfaces.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    texts: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.light.brown,
    },
    subtitle: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgb(40, 42, 43)',
    },
});
