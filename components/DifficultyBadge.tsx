import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import { mix, withAlpha } from '../themes/decor';
import Icon from './Icon';

// Niveaux de difficulté des listes de mots, du plus simple au plus dur.
const LEVELS: Record<string, { rank: number; color: string; icon: string }> = {
    facile: { rank: 1, color: '#4CAF50', icon: 'seedling' },
    moyen: { rank: 2, color: '#F2B632', icon: 'feather' },
    difficile: { rank: 3, color: '#F07C2A', icon: 'fire' },
    tres_difficile: { rank: 4, color: '#E0433A', icon: 'skull' },
};

const BADGE_HEIGHT = 26;
// Place à laisser en haut du cadre de l'indice pour que le texte ne passe pas sous le badge.
export const DIFFICULTY_BADGE_SPACE = BADGE_HEIGHT / 2 + 8;

// Épaisseur du trait du haut d'un style de cadre (borderTopWidth, sinon borderWidth).
export function borderTopOf(style: StyleProp<ViewStyle>): number {
    const s = StyleSheet.flatten(style) || {};
    return (s.borderTopWidth ?? s.borderWidth ?? 0) as number;
}

interface DifficultyBadgeProps {
    level?: string;
    borderTopWidth?: number; // épaisseur du trait du haut du cadre parent
}

// Badge posé à cheval sur le trait du haut du cadre de l'indice (le trait le coupe en son milieu) :
// icône, nom du niveau et jauge à 4 crans. À placer comme enfant du cadre.
export default function DifficultyBadge({ level, borderTopWidth = 0 }: DifficultyBadgeProps) {
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const info = level ? LEVELS[level] : undefined;
    if (!info) return null;

    // Fond opaque du thème (masque le trait du cadre), bordure éclaircie pour bien ressortir.
    const ink = info.color;

    return (
        <View pointerEvents="none" style={[styles.anchor, { top: -(BADGE_HEIGHT + borderTopWidth) / 2 }]}>
            <View style={[styles.badge, { backgroundColor: decor.palette.bg, borderColor: mix(info.color, '#ffffff', 0.4) }]}>
                <Icon name={info.icon} size={13} color={ink} />
                <Text style={[styles.label, { color: ink }]}>{t(`difficulte_${level}`)}</Text>
                <View style={styles.pips}>
                    {[1, 2, 3, 4].map((n) => (
                        <View
                            key={n}
                            style={[
                                styles.pip,
                                { height: 5 + n * 2 },
                                { backgroundColor: n <= info.rank ? ink : withAlpha(info.color, 0.3) },
                            ]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    anchor: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
        elevation: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: BADGE_HEIGHT,
        borderWidth: 2,
        borderRadius: BADGE_HEIGHT / 2,
        paddingHorizontal: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pips: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
    },
    pip: {
        width: 4,
        borderRadius: 1,
    },
});
