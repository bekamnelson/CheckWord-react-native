import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import { mix, withAlpha } from '../themes/decor';
import Life from './Life';

interface LifeBarProps {
    remaining: number;  // vies restantes
    total?: number;
    compact?: boolean;  // version réduite (cartes joueurs du multijoueur)
}

// Barre de vies bien identifiable : libellé « Vies », symboles du thème et compteur « 3/5 ».
export default function LifeBar({ remaining, total = 5, compact = false }: LifeBarProps) {
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const p = decor.palette;
    const low = remaining <= 1;
    const count = Math.max(0, remaining);
    // Bordure éclaircie (couleur des vies tirée vers le blanc) pour bien délimiter la barre.
    const border = mix(low ? p.danger : decor.icons.lifeColor, '#ffffff', 0.4);

    return (
        <View
            style={[
                styles.bar,
                compact && styles.barCompact,
                {
                    backgroundColor: withAlpha(p.bg, 0.75),
                    borderColor: border,
                },
            ]}
        >
            {!compact && <Text style={[styles.label, { color: p.textMuted }]}>{t('vies')}</Text>}

            <View style={[styles.icons, compact && styles.iconsCompact]}>
                {Array.from({ length: total }, (_, i) => (
                    <Life key={i} active={i < count} size={compact ? 11 : 18} />
                ))}
            </View>

            <Text style={[styles.count, compact && styles.countCompact, { color: low ? p.danger : p.text }]}>
                {count}/{total}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        gap: 10,
        borderWidth: 2,
        borderRadius: 22,
        paddingVertical: 4,
        paddingHorizontal: 14,
        marginVertical: 10,
    },
    barCompact: {
        gap: 4,
        borderRadius: 12,
        paddingVertical: 2,
        paddingHorizontal: 6,
        marginVertical: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    iconsCompact: {
        gap: 0,
    },
    count: {
        fontSize: 14,
        fontWeight: 'bold',
        minWidth: 28,
        textAlign: 'right',
    },
    countCompact: {
        fontSize: 11,
        minWidth: 0,
    },
});
