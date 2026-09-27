import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import Icon from './Icon';
import LifeBar from './LifeBar';

interface PlayerProps {
    name: string;
    life: number; // Nombre de vies restantes (ex: 5)
    icone: string; // Nom d'icône Font Awesome (ex: "user", "crown")
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

    // Couleurs du thème actif
    const { decor } = useGameTheme();
    const primaryTextColor = decor.palette.primary;
    const borderColor = isCurrentTurn ? decor.palette.success : decor.palette.panelBorder;

    return (
        <View
            style={[
                styles.playerBox,
                { borderColor, backgroundColor: decor.palette.panel },
                isCurrentTurn && [styles.activeTurnBorder, { shadowColor: decor.palette.success }],
            ]}
        >
            {/* Icône du joueur */}
            <Icon name={icone} size={26} color={primaryTextColor} style={styles.icon} />

            {/* Nom du joueur */}
            <Text style={[styles.name, { color: primaryTextColor }]} numberOfLines={1}>
                {name}
            </Text>

            {/* Barre de vies */}
            <LifeBar remaining={life} total={table.length} compact />
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