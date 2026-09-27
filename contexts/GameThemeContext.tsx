import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeConfig, THEMES } from '../components/themeRegistry';
import { DECORS, ThemeDecor } from '../themes/decor';

interface GameThemeValue {
    themeId: number;
    theme: ThemeConfig;  // image de fond + styles détaillés (accueil / jeu)
    decor: ThemeDecor;   // palette, icônes, décor animé
    setThemeId: (id: number) => Promise<void>;
    // Valeur toujours à jour, pour les sauvegardes faites depuis des callbacks
    themeIdRef: React.MutableRefObject<number>;
}

const GameThemeContext = createContext<GameThemeValue | null>(null);

// Le thème choisi est stocké dans l'objet `player` (champ selectedTheme), comme avant.
// Ce contexte en est désormais la seule source de vérité : un changement de thème
// s'applique immédiatement à tous les écrans.
export function GameThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeId, setThemeIdState] = useState(1);
    const themeIdRef = useRef(1);

    useEffect(() => {
        AsyncStorage.getItem('player')
            .then((raw) => {
                const id = raw ? JSON.parse(raw).selectedTheme : undefined;
                if (id && THEMES[id]) {
                    themeIdRef.current = id;
                    setThemeIdState(id);
                }
            })
            .catch(() => {});
    }, []);

    const setThemeId = useCallback(async (id: number) => {
        if (!THEMES[id]) return;
        themeIdRef.current = id;
        setThemeIdState(id);
        try {
            const raw = await AsyncStorage.getItem('player');
            const player = raw ? JSON.parse(raw) : { level: 1, game_version: '2.1' };
            await AsyncStorage.setItem('player', JSON.stringify({ ...player, selectedTheme: id }));
        } catch (e) {
            console.error('Erreur de sauvegarde du thème :', e);
        }
    }, []);

    const value = useMemo(
        () => ({
            themeId,
            theme: THEMES[themeId] || THEMES[1],
            decor: DECORS[themeId] || DECORS[1],
            setThemeId,
            themeIdRef,
        }),
        [themeId, setThemeId]
    );

    return <GameThemeContext.Provider value={value}>{children}</GameThemeContext.Provider>;
}

export function useGameTheme() {
    const ctx = useContext(GameThemeContext);
    if (!ctx) throw new Error('useGameTheme doit être utilisé dans <GameThemeProvider>');
    return ctx;
}
