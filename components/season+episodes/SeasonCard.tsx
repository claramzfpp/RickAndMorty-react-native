import Colors from '@/constants/Colors';
import { preview } from "radon-ide";
import { Pressable, StyleSheet, Text, View } from 'react-native';

// o nome desse padrão é Container/View Pattern, 
// que é uma abordagem comum no desenvolvimento de aplicativos React Native. 
//
// A ideia é separar a lógica de apresentação (View) da lógica de negócios (Container). 
// O componente Container é responsável por gerenciar o estado, buscar dados e lidar com eventos, 
// enquanto o componente View é responsável por renderizar a interface do usuário com base 
// nos dados fornecidos pelo Container. 
// Isso promove uma melhor organização do código, facilita a manutenção e 
// permite a reutilização de componentes em diferentes partes do aplicativo.
export interface SeasonCardProps {
    season: {
        number: number;
        episodesNumber: number;
    };
    onPress?: () => void;
    disabled?: boolean;
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

// a diferença entre 'export const' e 'export default'
// 'export const' permite exportar múltiplos componentes ou funções do mesmo arquivo, e a nomeação deve ser feita explicitamente ao importar, 
// enquanto 'export default' permite exportar apenas um componente ou função como padrão.
export const SeasonCard = ({ season, onPress}: SeasonCardProps) => {
    const shouldBeDisable = (season.number > 5)

    return (
        <Pressable
            onPress={onPress}
            disabled={shouldBeDisable}
            style={({ pressed }) => [
                styles.container,
                { backgroundColor: "rgb(211, 211, 211)" },
                pressed && !shouldBeDisable && styles.pressed,
                shouldBeDisable && styles.disabled,
            ]}
        >
            {headerComponent({ seasonNumber: season.number })}

            <Text style={styles.number}>{season.number}</Text>
            <Text style={styles.season}>Season </Text>
            <Text style={styles.episodesNumber}>{season.episodesNumber} episodes</Text>
        </Pressable>
    );
};

// isso promove que a view seja independente de layout, 
// e que o container seja independente de estilo, promovendo a reutilização de componentes 
// e a separação de responsabilidades.
// acredito que isso seja o modifier deles
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
        color: "rgba(95, 99, 100)",
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

preview(
    <View style={{ padding: 16, gap: 12 }}>
        <SeasonCard season={{ number: 1, episodesNumber: 10 }} />
        <SeasonCard season={{ number: 2, episodesNumber: 10 }} />
        <SeasonCard season={{ number: 6, episodesNumber: 12 }} />
    </View>
);


