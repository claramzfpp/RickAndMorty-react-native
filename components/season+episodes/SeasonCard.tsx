
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

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
    // 1. Garante que se o colorScheme for null/undefined, ele use 'light' como padrão
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: colors.gray }]}>
            {/* Você pode usar os dados da prop 'season' aqui se quiser */}
            <Text style={styles.title}>Temporada {season.number}</Text>

            {/* CORREÇÃO AQUI: Removido lightColor e darkColor que causavam erro na View padrão */}
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
