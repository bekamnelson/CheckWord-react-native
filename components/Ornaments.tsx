import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import Icon from './Icon';

interface OrnamentsProps {
    size?: number;   // taille des équerres
    inset?: number;  // distance au bord du cadre
    color?: string;
    showIcons?: boolean;
}

// Décoration des 4 coins d'un cadre : équerres + motif du thème (fleur, ancre, puce…).
export default function Ornaments({ size = 16, inset = 7, color, showIcons = true }: OrnamentsProps) {
    const { decor } = useGameTheme();
    const c = color ?? decor.palette.primary;
    const b = { borderColor: c, width: size, height: size };
    const iconSize = Math.round(size * 0.6);
    const iconOffset = inset + size - iconSize / 2;

    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <View style={[styles.corner, b, { top: inset, left: inset, borderTopWidth: 2, borderLeftWidth: 2 }]} />
            <View style={[styles.corner, b, { top: inset, right: inset, borderTopWidth: 2, borderRightWidth: 2 }]} />
            <View style={[styles.corner, b, { bottom: inset, left: inset, borderBottomWidth: 2, borderLeftWidth: 2 }]} />
            <View style={[styles.corner, b, { bottom: inset, right: inset, borderBottomWidth: 2, borderRightWidth: 2 }]} />
            {showIcons && (
                <>
                    <View style={[styles.icon, { top: iconOffset - 2, left: iconOffset - 2 }]}>
                        <Icon name={decor.icons.corner} size={iconSize} color={c} />
                    </View>
                    <View style={[styles.icon, { top: iconOffset - 2, right: iconOffset - 2 }]}>
                        <Icon name={decor.icons.corner} size={iconSize} color={c} />
                    </View>
                    <View style={[styles.icon, { bottom: iconOffset - 2, left: iconOffset - 2 }]}>
                        <Icon name={decor.icons.corner} size={iconSize} color={c} />
                    </View>
                    <View style={[styles.icon, { bottom: iconOffset - 2, right: iconOffset - 2 }]}>
                        <Icon name={decor.icons.corner} size={iconSize} color={c} />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    corner: {
        position: 'absolute',
        opacity: 0.85,
    },
    icon: {
        position: 'absolute',
        opacity: 0.55,
    },
});
