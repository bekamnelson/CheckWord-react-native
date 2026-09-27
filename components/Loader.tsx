import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import { withAlpha } from '../themes/decor';
import Icon from './Icon';
import ThemeBackdrop from './ThemeBackdrop';

interface LoaderProps {
    // false tant que la page n'a pas ses données ; le voile ne disparaît qu'une fois
    // ready = true ET la page réellement affichée (transition terminée + une image dessinée).
    ready?: boolean;
}

const FADE_MS = 250;

// Écran de chargement aux couleurs du thème, posé par-dessus une page pendant qu'elle se prépare.
export default function Loader({ ready = true }: LoaderProps) {
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const pal = decor.palette;
    const [hidden, setHidden] = useState(false);
    const opacity = useRef(new Animated.Value(1)).current;
    const spin = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anims = Animated.parallel([
            Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                    Animated.timing(pulse, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                ])
            ),
        ]);
        anims.start();
        return () => anims.stop();
    }, [spin, pulse]);

    useEffect(() => {
        if (!ready) return;
        let frame = 0;
        // Attend que la page soit réellement dessinée (deux images affichées), puis s'efface.
        // (Pas d'InteractionManager : déprécié, et il attendrait la fin des particules en boucle.)
        frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
                Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true }).start(({ finished }) => {
                    if (finished) setHidden(true);
                });
            });
        });
        return () => cancelAnimationFrame(frame);
    }, [ready, opacity]);

    if (hidden) return null;

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.wrap, { opacity }]} pointerEvents={ready ? 'none' : 'auto'}>
            <ThemeBackdrop />

            <View style={styles.center}>
                <View style={styles.ringBox}>
                    <Animated.View
                        style={[
                            styles.ring,
                            {
                                borderColor: withAlpha(pal.primary, 0.2),
                                borderTopColor: pal.primary,
                                transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
                            },
                        ]}
                    />
                    <Animated.View
                        style={{
                            position: 'absolute',
                            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.1] }) }],
                        }}
                    >
                        <Icon name={decor.icons.title} size={30} color={pal.primary} />
                    </Animated.View>
                </View>

                <Text style={[styles.label, { color: pal.text }]}>{t('chargement')}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        zIndex: 500,
        elevation: 500,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringBox: {
        width: 84,
        height: 84,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        position: 'absolute',
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 4,
    },
    label: {
        marginTop: 22,
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
});
