import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface InputProps {
    i: number;
    handleplayers: (text: string) => void;
    value?: string;
    styles?: any; // Styles dynamiques du thème
}

export default function Input({ i, handleplayers, value, styles: themeStyles }: InputProps) {
    // Récupération des couleurs dynamiques du thème avec des replis (fallbacks)
    const textColor = themeStyles?.contenuedescription?.color || '#ffffff';
    const borderColor = themeStyles?.ornament?.borderColor || '#f0c040';
    const placeholderColor = 'rgba(255, 255, 255, 0.5)';

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.inputGold,
                    {
                        color: textColor,
                        borderColor: borderColor,
                    },
                ]}
                placeholder={`Nom du joueur ${i + 1}`}
                placeholderTextColor={placeholderColor}
                value={value}
                onChangeText={handleplayers}
                autoCorrect={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 6,
    },
    inputGold: {
        height: 48,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        fontWeight: '600',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
});