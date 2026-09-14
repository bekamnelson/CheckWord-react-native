import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Life from './Life';

interface PlayerProps {
    name: string;
    life: number; // Nombre de vies restantes (ex: 5)
    icone: string; // Icône ou Emoji (ex: "🤖", "👤")
    styles?: any; // Styles dynamiques du thème
    isCurrentTurn?: boolean; // Optionnel : indique si c'est au tour de ce joueur
}

export default function Player({
    name,
    life,
    icone,
    styles: themeStyles,
    isCurrentTurn = false,
}: PlayerProps) {
    const table = [1, 2, 3, 4, 5];

    // Récupération des couleurs dynamiques du thème si disponibles
    const primaryTextColor = themeStyles?.headerTitle?.color || '#f0c040';
    const secondaryTextColor = themeStyles?.contenuedescription?.color || '#ffffff';
    const borderColor = themeStyles?.ornament?.borderColor || primaryTextColor;

    return (
        <View
            style={[
                styles.playerBox,
                { borderColor },
                isCurrentTurn && styles.activeTurnBorder,
            ]}
        >
            {/* Icône du joueur */}
            <Text style={styles.icon}>{icone}</Text>

            {/* Nom du joueur */}
            <Text style={[styles.name, { color: primaryTextColor }]} numberOfLines={1}>
                {name}
            </Text>

            {/* Barre de vies */}
            <View style={styles.lifebar}>
                {table.map((item, i) => (
                    <Life key={i} active={item <= life} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    playerBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        borderWidth: 1.5,
        minWidth: 110,
    },
    activeTurnBorder: {
        borderWidth: 2.5,
        shadowColor: '#00ff00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    icon: {
        fontSize: 28,
        marginBottom: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 4,
        textAlign: 'center',
    },
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
});