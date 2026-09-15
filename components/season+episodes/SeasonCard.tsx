import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';
import { preview } from "radon-ide";

export interface SeasonCardProps {
    season: {
        number: number;
        episodesNumber: number;
    };
    onPress?: () => void;
}

// a diferença entre 'export const' e 'export default'
// 'export const' permite exportar múltiplos componentes ou funções do mesmo arquivo, e a nomeação deve ser feita explicitamente ao importar, 
// enquanto 'export default' permite exportar apenas um componente ou função como padrão.
export const SeasonCard = ({ season, onPress }: SeasonCardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: colors.gray }]}>
            <Text style={styles.title}>Temporada {season.number}</Text>

            <View style={[styles.separator, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#eee' }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#67159C',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

preview(<SeasonCard season={{ number: 1, episodesNumber: 10 }} />);
