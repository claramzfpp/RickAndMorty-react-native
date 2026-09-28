import { Children, Fragment, isValidElement, ReactNode } from 'react';
import { preview } from "radon-ide";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SeasonCard } from '../season+episodes/SeasonCard';
import Colors from '@/constants/Colors';
import { SymbolView } from 'expo-symbols';

export interface GenericCarouselProps {
    title: string;
    onSeeAllClick?: () => void;
    content: ReactNode;
    numRows?: 1 | 2;
}

const flattenChildren = (content: ReactNode): ReactNode[] => {
    const result: ReactNode[] = [];

    Children.forEach(content, (child) => {
        if (isValidElement(child) && child.type === Fragment) {
            result.push(...flattenChildren((child.props as { children?: ReactNode }).children));
        } else {
            result.push(child);
        }
    });

    return result;
};

const chunkIntoColumns = (content: ReactNode): ReactNode[][] => {
    const items = flattenChildren(content);
    const columns: ReactNode[][] = [];

    for (let i = 0; i < items.length; i += 2) {
        columns.push(items.slice(i, i + 2));
    }

    return columns;
};

export const GenericCarousel = ({ title, onSeeAllClick, content, numRows = 1 }: GenericCarouselProps) => {
    const isTwoRows = numRows === 2;

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
                            weight="bold"
                        />
                    </Pressable>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={isTwoRows ? styles.columnsContainer : styles.scrollContainer}
            >
                {isTwoRows
                    ? chunkIntoColumns(content).map((column, index) => (
                        <View key={index} style={styles.column}>
                            {column}
                        </View>
                    ))
                    : content}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        fontWeight: '700',
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
    columnsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        gap: 12,
    },
    column: {
        flexDirection: 'column',
        gap: 12,
    },
})


if (__DEV__) {
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
            <GenericCarousel
                title='Seasons (2 rows)'
                numRows={2}
                onSeeAllClick={() => console.log("clicado")}
                content={
                    <>
                        <SeasonCard season={{ number: 1, episodesNumber: 10 }} />
                        <SeasonCard season={{ number: 2, episodesNumber: 10 }} />
                        <SeasonCard season={{ number: 3, episodesNumber: 8 }} />
                        <SeasonCard season={{ number: 4, episodesNumber: 14 }} />
                        <SeasonCard season={{ number: 5, episodesNumber: 6 }} />
                    </>
                }
            />
        </View>
    );
}
