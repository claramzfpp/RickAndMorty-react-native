import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/components/shared/useColorScheme';
import Colors from '@/constants/Colors';

// These views render on the screens' gray background (the same in light and dark),
// so the text uses the dark brown for contrast instead of the theme's text color.
const useStateColors = () => Colors[useColorScheme()];

export interface SearchEmptyStateProps {
    query: string;
    /** Plural noun for what was searched (e.g. "Characters"); omitted yields a generic message. */
    subject?: string;
}

export const SearchEmptyState = ({ query, subject }: SearchEmptyStateProps) => {
    const colors = useStateColors();
    const message = subject !== undefined
        ? `No ${subject.toLowerCase()} found for “${query}”`
        : `No results for “${query}”`;

    return (
        <View style={styles.container}>
            <Text style={[styles.message, { color: colors.brown }]} accessibilityRole="alert">{message}</Text>
        </View>
    );
};

export interface SearchErrorStateProps {
    message: string;
    onRetry: () => void;
}

export const SearchErrorState = ({ message, onRetry }: SearchErrorStateProps) => {
    const colors = useStateColors();

    return (
        <View style={styles.container}>
            <Text style={[styles.message, { color: colors.brown }]} accessibilityRole="alert">{message}</Text>
            <Pressable
                onPress={onRetry}
                accessibilityRole="button"
                accessibilityLabel="Try again"
                style={({ pressed }) => [styles.retry, { backgroundColor: colors.green }, pressed && styles.pressed]}
            >
                <Text style={[styles.retryText, { color: colors.brown }]}>Try again</Text>
            </Pressable>
        </View>
    );
};

export const SearchLoadingState = ({ topOffset = 0 }: { topOffset?: number }) => {
    const colors = useStateColors();

    return (
        <View style={[styles.container, { paddingTop: topOffset }]}>
            <ActivityIndicator color={colors.brown} accessibilityRole="progressbar" accessibilityLabel="Loading results" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 12,
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
    },
    retry: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    retryText: {
        fontSize: 14,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.7,
    },
});
