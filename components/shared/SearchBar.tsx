import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { preview } from "radon-ide";
import Colors from '@/constants/Colors';
import { useThemeColor } from './Themed';

export interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    onClear?: () => void;
}

export const SearchBar = ({ value, onChangeText, placeholder, onClear }: SearchBarProps) => {
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({ light: 'rgb(235, 235, 235)', dark: 'rgb(38, 38, 38)' }, 'background');
    const iconColor = useThemeColor({}, 'gray');

    const handleClear = () => {
        onChangeText('');
        onClear?.();
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <SymbolView
                name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                tintColor={iconColor}
                size={18}
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={iconColor}
                style={[styles.input, { color: textColor }]}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
            />
            {value.length > 0 && (
                <Pressable onPress={handleClear} hitSlop={8} accessibilityLabel="Clear search">
                    <SymbolView
                        name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                        tintColor={iconColor}
                        size={18}
                    />
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 14,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
});

if (__DEV__) {
    const SearchBarPreview = () => {
        const [text, setText] = useState('Rick');
        return (
            <View style={{ padding: 16, backgroundColor: Colors.light.background }}>
                <SearchBar value={text} onChangeText={setText} placeholder="Search" />
            </View>
        );
    };
    preview(<SearchBarPreview />);
}
