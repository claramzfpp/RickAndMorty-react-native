import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';

export const SearchEmptyState = ({ query }: { query: string }) => (
    <View style={styles.container}>
        <Text style={styles.message}>{`Nenhum resultado para “${query}”`}</Text>
    </View>
);

export interface SearchErrorStateProps {
    message: string;
    onRetry: () => void;
}

export const SearchErrorState = ({ message, onRetry }: SearchErrorStateProps) => (
    <View style={styles.container}>
        <Text style={styles.message}>{message}</Text>
        <Pressable onPress={onRetry} style={({ pressed }) => [styles.retry, pressed && styles.pressed]}>
            <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
    </View>
);

export const SearchLoadingState = ({ topOffset = 0 }: { topOffset?: number }) => (
    <View style={[styles.container, { paddingTop: topOffset }]}>
        <ActivityIndicator color={Colors.light.gray} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 12,
    },
    message: {
        fontSize: 15,
        color: Colors.light.gray,
        textAlign: 'center',
    },
    retry: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: Colors.light.green,
    },
    retryText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.brown,
    },
    pressed: {
        opacity: 0.7,
    },
});
