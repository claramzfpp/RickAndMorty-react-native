import { ReactNode } from 'react';
import { preview } from "radon-ide";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SeasonCard } from './season+episodes/SeasonCard';
import Colors from '@/constants/Colors';
import { SymbolView } from 'expo-symbols';

export interface GenericCarouselProps {
    title: string;
    onSeeAllClick?: () => void;
    content: ReactNode
}

export const GenericCarousel = ({ title, onSeeAllClick, content }: GenericCarouselProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>

                {onSeeAllClick != null && (
                    <Pressable onPress={onSeeAllClick} style={styles.seeAllContainer}>
                        <Text style={styles.seeAll}>See all</Text>
                        <SymbolView
                            name={{
                                ios: 'chevron.forward',
                                android: 'keyboard_arrow_right',
                            }}
                            tintColor={styles.seeAll.color}
                            size={styles.seeAll.fontSize}
                        />
                    </Pressable>
                )}
            </View>
            
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer} 
            >
                {content}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Remova o paddingHorizontal daqui para o ScrollView usar a tela toda
        width: '100%', 
        marginVertical: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0, // Adicionado aqui para manter o título alinhado à tela
        marginBottom: 12,     // Espaço entre o título e o carrossel
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.brown
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.brown,
    },
    seeAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    scrollContainer: {
        paddingHorizontal: 0, // Garante que o primeiro e o último card desgrudem da borda da tela
        gap: 12,              // Espaçamento uniforme entre cada SeasonCard do carrossel
    },
})


preview(
    <View style={{ padding: 16, gap: 12 }}>
        <GenericCarousel
            title='Seasons'
            onSeeAllClick={() => console.log("clicado")}
            content={
                <>
                    <SeasonCard season={{ number: 1, episodesNumber: 10 }} />
                    <SeasonCard season={{ number: 2, episodesNumber: 10 }} />
                    <SeasonCard season={{ number: 6, episodesNumber: 12 }} />
                </>
            }
        />
    </View>
);
