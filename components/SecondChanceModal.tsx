import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from '../themes/decor';
import Icon from './Icon';
import Ornaments from './Ornaments';

export const SECOND_CHANCE_SECONDS = 10;

export interface ChanceReward {
    icon: string;   // icône Font Awesome
    color?: string; // couleur de l'icône (sinon couleur principale du thème)
    label: string;  // texte déjà traduit (« +2 vies », « +30 s »…)
}

interface SecondChanceModalProps {
    visible: boolean;
    paused: boolean;        // la vidéo est en cours : le compte à rebours s'arrête
    message?: string;       // texte d'explication (sinon message générique)
    rewards: ChanceReward[];
    onWatch: () => void;
    onGiveUp: () => void;   // refus ou temps écoulé
}

// « Dernière chance » : juste avant la défaite, une vidéo contre des vies et des lettres.
export default function SecondChanceModal({ visible, paused, message, rewards, onWatch, onGiveUp }: SecondChanceModalProps) {
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const pal = decor.palette;
    const styles = useMemo(() => makeStyles(pal), [pal]);
    const [left, setLeft] = useState(SECOND_CHANCE_SECONDS);
    const pulse = useRef(new Animated.Value(0)).current;
    const giveUpRef = useRef(onGiveUp);
    giveUpRef.current = onGiveUp;

    // Nouveau compte à rebours à chaque ouverture
    useEffect(() => {
        if (visible) setLeft(SECOND_CHANCE_SECONDS);
    }, [visible]);

    useEffect(() => {
        if (!visible || paused) return;
        if (left <= 0) {
            giveUpRef.current();
            return;
        }
        const id = setTimeout(() => setLeft((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [visible, paused, left]);

    // Le bouton principal bat doucement pour attirer l'œil
    useEffect(() => {
        if (!visible) return;
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 550, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0, duration: 550, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [visible, pulse]);

    const ratio = left / SECOND_CHANCE_SECONDS;
    const urgent = left <= 3;

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onGiveUp}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Ornaments />

                    <View style={[styles.timer, urgent && { borderColor: pal.danger }]}>
                        <Text style={[styles.timerText, urgent && { color: pal.danger }]}>{left}</Text>
                    </View>

                    <Text style={styles.title}>{t('chance_titre')}</Text>
                    <Text style={styles.message}>{message ?? t('chance_msg')}</Text>

                    <View style={styles.rewards}>
                        {rewards.map((r) => (
                            <View key={r.label} style={styles.reward}>
                                <Icon name={r.icon} size={22} color={r.color ?? pal.primary} />
                                <Text style={styles.rewardText}>{r.label}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.track}>
                        <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: urgent ? pal.danger : pal.primary }]} />
                    </View>

                    <Animated.View style={{ alignSelf: 'stretch', transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) }] }}>
                        <TouchableOpacity style={styles.watchBtn} onPress={onWatch} activeOpacity={0.85} disabled={paused}>
                            <Icon name="circle-play" size={18} color={pal.onPrimary} />
                            <Text style={styles.watchText}>{t('chance_regarder')}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity style={styles.giveUpBtn} onPress={onGiveUp} activeOpacity={0.7} disabled={paused}>
                        <Text style={styles.giveUpText}>{t('chance_abandonner')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const makeStyles = (p: ThemePalette) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 26,
    },
    card: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: p.bg,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: p.primary,
        paddingTop: 26,
        paddingBottom: 18,
        paddingHorizontal: 22,
        alignItems: 'center',
        elevation: 14,
    },
    timer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: p.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        backgroundColor: withAlpha(p.primary, 0.12),
    },
    timerText: {
        color: p.primary,
        fontSize: 28,
        fontWeight: '900',
    },
    title: {
        color: p.text,
        fontSize: 22,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        color: p.textMuted,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 14,
    },
    rewards: {
        flexDirection: 'row',
        gap: 10,
        alignSelf: 'stretch',
        marginBottom: 14,
    },
    reward: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: withAlpha(p.primary, 0.5),
        backgroundColor: withAlpha(p.primary, 0.1),
    },
    rewardText: {
        color: p.text,
        fontSize: 14,
        fontWeight: '700',
    },
    track: {
        alignSelf: 'stretch',
        height: 6,
        borderRadius: 3,
        backgroundColor: withAlpha(p.textMuted, 0.25),
        overflow: 'hidden',
        marginBottom: 16,
    },
    fill: {
        height: '100%',
        borderRadius: 3,
    },
    watchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: p.primary,
        borderRadius: 14,
        paddingVertical: 14,
    },
    watchText: {
        color: p.onPrimary,
        fontSize: 16,
        fontWeight: '800',
    },
    giveUpBtn: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 6,
    },
    giveUpText: {
        color: p.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
});
