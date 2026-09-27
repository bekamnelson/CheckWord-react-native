import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, ImageBackground, StyleSheet, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import Icon from './Icon';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Particle {
    icon: string;
    color: string;
    size: number;
    left: number;
    duration: number;
    phase: number;   // position de départ dans le cycle (0-1) : l'écran est rempli dès l'ouverture
    sway: number;
    opacity: number;
}

type Layer = 'back' | 'front';

// Deux plans de profondeur : derrière l'interface (plus petits, plus lents, plus pâles)
// et devant (plus grands, plus rapides, plus nets).
const LAYERS: Record<Layer, { share: number; scale: number; speed: number; opacity: number }> = {
    back: { share: 0.6, scale: 0.8, speed: 1.3, opacity: 0.45 },
    front: { share: 0.4, scale: 1.15, speed: 0.85, opacity: 0.75 },
};

// Toutes les particules tombent de haut en bas en diagonale (vers la droite) :
// décalage horizontal total parcouru pendant une traversée de l'écran.
const DRIFT = SCREEN_H * 0.4;

function ParticleView({ p, spin }: { p: Particle; spin: boolean }) {
    const progress = useRef(new Animated.Value(p.phase)).current;

    useEffect(() => {
        const cycle = Animated.timing(progress, {
            toValue: 1,
            duration: p.duration,
            easing: Easing.linear,
            useNativeDriver: true,
            isInteraction: false, // décor : ne retarde jamais le reste de l'app
        });
        // Fin du premier passage (depuis la phase de départ), puis boucle sans aucune pause.
        const first = Animated.timing(progress, {
            toValue: 1,
            duration: p.duration * (1 - p.phase),
            easing: Easing.linear,
            useNativeDriver: true,
            isInteraction: false, // décor : ne retarde jamais le reste de l'app
        });
        const loop = Animated.loop(cycle, { resetBeforeIteration: true });
        let stopped = false;
        progress.setValue(p.phase);
        first.start(({ finished }) => {
            if (!finished || stopped) return;
            progress.setValue(0);
            loop.start();
        });
        return () => {
            stopped = true;
            first.stop();
            loop.stop();
        };
    }, [p, progress]);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: p.left,
                top: 0,
                // Départ et arrivée hors écran : l'opacité reste constante, le flux paraît continu.
                opacity: p.opacity,
                transform: [
                    { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-40, SCREEN_H + 40] }) },
                    {
                        // Glissement oblique régulier + léger balancement
                        translateX: progress.interpolate({
                            inputRange: [0, 0.25, 0.5, 0.75, 1],
                            outputRange: [0, DRIFT * 0.25 + p.sway, DRIFT * 0.5, DRIFT * 0.75 - p.sway, DRIFT],
                        }),
                    },
                    {
                        rotate: spin
                            ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
                            : '0deg',
                    },
                ],
            }}
        >
            <Icon name={p.icon} size={p.size} color={p.color} />
        </Animated.View>
    );
}

// Décor animé propre au thème (pétales, bulles, étincelles…).
// layer="front" : par-dessus l'interface (app/_layout.tsx) ; layer="back" : derrière (ThemeBackdrop).
// pointerEvents="none" : il ne bloque jamais les boutons ni le clavier.
export function ThemeParticles({ layer = 'front' }: { layer?: Layer }) {
    const { themeId, decor } = useGameTheme();
    const cfg = decor.particles;
    const L = LAYERS[layer];

    const particles = useMemo<Particle[]>(
        () =>
            Array.from({ length: Math.max(1, Math.round(cfg.count * L.share)) }, (_, i) => ({
                icon: cfg.icons[i % cfg.icons.length],
                color: cfg.colors[i % cfg.colors.length],
                size: (cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize)) * L.scale,
                // Départ possible à gauche de l'écran : avec la diagonale, tout l'écran est couvert
                left: -DRIFT + Math.random() * (SCREEN_W + DRIFT - 20),
                duration: (9000 + Math.random() * 9000) * L.speed,
                phase: Math.random(),
                sway: 6 + Math.random() * 12,
                opacity: L.opacity * (0.8 + Math.random() * 0.2),
            })),
        // Nouveau tirage à chaque changement de thème
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [themeId, layer]
    );

    return (
        <View
            pointerEvents="none"
            // zIndex + elevation : le plan avant reste au-dessus des cartes à ombre (elevation) sur Android
            style={[StyleSheet.absoluteFill, layer === 'front' && { zIndex: 1000, elevation: 1000 }]}
        >
            {particles.map((p, i) => (
                <ParticleView key={`${themeId}-${layer}-${i}`} p={p} spin={cfg.spin} />
            ))}
        </View>
    );
}

// Fond complet d'un écran : image du thème + voile + plan arrière du décor animé.
// (Le plan avant est affiché une seule fois, au-dessus de toute l'interface, dans app/_layout.tsx.)
export default function ThemeBackdrop({ overlay }: { overlay?: string }) {
    const { theme, decor } = useGameTheme();
    return (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: decor.palette.bg }]}>
            <ImageBackground source={theme.backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: overlay ?? decor.palette.overlay }]} />
            <ThemeParticles layer="back" />
        </View>
    );
}
