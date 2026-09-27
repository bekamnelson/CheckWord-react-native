import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import Icon from './Icon';

interface LifeProps {
    active?: boolean;
    size?: number;
    styles?: any; // conservé pour compatibilité, le rendu suit désormais le thème actif
}

// Une vie = le symbole du thème (cœur, fleur de sakura, éclair, poisson…).
// Vie perdue : même symbole, éteint.
export default function Life({ active = true, size = 22 }: LifeProps) {
    const { decor } = useGameTheme();
    const color = active ? decor.icons.lifeColor : decor.palette.textMuted;

    return (
        <View
            style={[
                styles.slot,
                { width: size + 8, height: size + 8 },
                active && { shadowColor: decor.icons.lifeColor },
                active ? styles.active : styles.lost,
            ]}
        >
            <Icon name={decor.icons.life} size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    slot: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    active: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
    },
    lost: {
        opacity: 0.25,
    },
});
