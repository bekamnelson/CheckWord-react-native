
import { ImageSourcePropType } from 'react-native';

// Dynamic import or mapping for your 8 theme styles
import { gameTheme1Styles } from './../themes/gameTheme1';
import { gameTheme2Styles } from './../themes/gameTheme2';
import { gameTheme3Styles } from './../themes/gameTheme3';
import { gameTheme4Styles } from './../themes/gameTheme4';
import { gameTheme5Styles } from './../themes/gameTheme5';
import { gameTheme6Styles } from './../themes/gameTheme6';
import { gameTheme7Styles } from './../themes/gameTheme7';
import { gameTheme8Styles } from './../themes/gameTheme8';

// Styles des thèmes d'Accueil (HomeScreen)
import { theme1Styles } from './../themes/theme1';
import { theme2Styles } from './../themes/theme2';
import { theme3Styles } from './../themes/theme3';
import { theme4Styles } from './../themes/theme4';
import { theme5Styles } from './../themes/theme5';
import { theme6Styles } from './../themes/theme6';
import { theme7Styles } from './../themes/theme7';
import { theme8Styles } from './../themes/theme8';

// Thèmes 9 à 16 : styles calculés à partir d'une palette
import { makeGameStyles, makeHomeStyles, ThemeSpec } from './../themes/themeFactory';
export interface ThemeConfig {
    id: number;
    backgroundImage: ImageSourcePropType;
    gameStyles: Record<string, any>;
    themeStyles: Record<string, any>;
}

// Déblocage des thèmes :
// - thèmes 1 à 8 : par niveau en Solo (un nouveau thème tous les 50 niveaux)
// - thèmes 9 à 16 : par le meilleur temps de survie (4:00, puis une minute de plus pour chacun)
export interface ThemeUnlock {
    id: number;
    name: string;
    reqLevel?: number;    // niveau Solo requis
    reqSurvival?: number; // meilleur temps de survie requis, en secondes
}

export const SURVIVAL_UNLOCK_START = 4 * 60;
export const SURVIVAL_UNLOCK_STEP = 60;

const SURVIVAL_THEME_NAMES: [number, string][] = [
    [9, 'ÉCHECS'],
    [10, 'HIVER'],
    [11, 'FORÊT'],
    [12, 'ÉTOILES'],
    [13, 'NOËL'],
    [14, 'FOOT'],
    [15, 'SAVANE'],
    [16, 'HALLOWEEN'],
];

export const THEME_UNLOCKS: ThemeUnlock[] = [
    { id: 1, name: 'fantasy', reqLevel: 1 },
    { id: 2, name: 'SAKURA', reqLevel: 50 },
    { id: 3, name: 'CYBERPUNK', reqLevel: 100 },
    { id: 4, name: 'CANDY', reqLevel: 150 },
    { id: 5, name: 'OCÉAN', reqLevel: 200 },
    { id: 6, name: 'CRÉPUSCULE', reqLevel: 250 },
    { id: 7, name: 'LABO', reqLevel: 300 },
    { id: 8, name: 'RUE', reqLevel: 350 },
    ...SURVIVAL_THEME_NAMES.map(([id, name], i) => ({
        id,
        name,
        reqSurvival: SURVIVAL_UNLOCK_START + i * SURVIVAL_UNLOCK_STEP,
    })),
];

export const SURVIVAL_THEMES = THEME_UNLOCKS.filter((th) => th.reqSurvival !== undefined);

// Thème (de niveau) qui se débloque exactement à ce niveau (ou undefined)
export const themeUnlockedAt = (level: number) =>
    THEME_UNLOCKS.find((th) => th.reqLevel !== undefined && th.reqLevel === level && th.reqLevel > 1);

// Thèmes de survie débloqués en passant d'un meilleur temps « before » à « after » (en secondes)
export const survivalThemesUnlockedBetween = (before: number, after: number) =>
    SURVIVAL_THEMES.filter((th) => before < th.reqSurvival! && after >= th.reqSurvival!);

export const isThemeUnlocked = (th: ThemeUnlock, progress: { level: number; bestSurvival: number }) =>
    th.reqSurvival !== undefined ? progress.bestSurvival >= th.reqSurvival : progress.level >= (th.reqLevel ?? 1);

export const THEMES: Record<number, ThemeConfig> = {
    1: {
        id: 1,
        backgroundImage: require('./../image/plan1.webp'),
        gameStyles: gameTheme1Styles,
        themeStyles: theme1Styles,
    },
    2: {
        id: 2,
        backgroundImage: require('./../image/plan2.webp'),
        gameStyles: gameTheme2Styles,
        themeStyles: theme2Styles,
    },
    3: {
        id: 3,
        backgroundImage: require('./../image/plan3.webp'),
        gameStyles: gameTheme3Styles,
        themeStyles: theme3Styles,
    },
    4: {
        id: 4,
        backgroundImage: require('./../image/plan4.webp'),
        gameStyles: gameTheme4Styles,
        themeStyles: theme4Styles,
    },
    5: {
        id: 5,
        backgroundImage: require('./../image/plan5.webp'),
        gameStyles: gameTheme5Styles,
        themeStyles: theme5Styles,
    },
    6: {
        id: 6,
        backgroundImage: require('./../image/plan6.webp'),
        gameStyles: gameTheme6Styles,
        themeStyles: theme6Styles,
    },
    7: {
        id: 7,
        backgroundImage: require('./../image/plan7.webp'),
        gameStyles: gameTheme7Styles, // À remplacer par gameTheme7Styles
        themeStyles: theme7Styles,     // À remplacer par theme7Styles
    },
    8: {
        id: 8,
        backgroundImage: require('./../image/plan8.webp'),
        gameStyles: gameTheme8Styles,
        themeStyles: theme8Styles,
    },
    ...buildSpecThemes(),
};

// Palettes des thèmes 9 à 16 (les décors, icônes et particules sont dans themes/decor.ts)
function buildSpecThemes(): Record<number, ThemeConfig> {
    const specs: Record<number, ThemeSpec> = {
        // Échecs : salle aux chandelles, bois sombre, or et ivoire
        9: { bg: '#140f0b', panel: 'rgba(28, 20, 14, 0.93)', border: '#a67c3d', primary: '#e0b35a', primaryLight: '#f7e3b5',
            onPrimary: '#140f0b', text: '#f6ecdc', textMuted: '#c9b393', radius: 6, letterSpacing: 2,
            titleFont: 'serif', keyStyle: 'raised', keyColor: 'rgba(246, 236, 220, 0.10)', borderWidth: 3 },
        // Hiver : crépuscule violet-bleu, neige et lanternes
        10: { bg: '#141a3c', panel: 'rgba(24, 32, 78, 0.88)', border: '#9fb8ff', primary: '#bcd4ff', primaryLight: '#ffffff',
            onPrimary: '#141a3c', text: '#f4f7ff', textMuted: '#b8c2e6', radius: 20, keyStyle: 'glass', glow: true },
        // Forêt : nuit au campement, feuillage et lueur des lanternes
        11: { bg: '#0b1a12', panel: 'rgba(14, 32, 22, 0.9)', border: '#5f9c5b', primary: '#9fd46a', primaryLight: '#e2f5c8',
            onPrimary: '#0b1a12', text: '#f1f7e8', textMuted: '#b5caa8', radius: 14, italicHint: true,
            titleFont: 'serif', keyStyle: 'raised', keyColor: 'rgba(76, 52, 30, 0.55)' },
        // Étoiles : galaxie violette au cœur orangé
        12: { bg: '#07061c', panel: 'rgba(14, 10, 42, 0.86)', border: '#8e6cff', primary: '#b89cff', primaryLight: '#f0e8ff',
            onPrimary: '#07061c', text: '#f3eeff', textMuted: '#aea6d6', radius: 18, letterSpacing: 2, glow: true, keyStyle: 'glass' },
        // Noël : bois chaleureux, rouge et or, neige
        13: { bg: '#1c0b0c', panel: 'rgba(44, 14, 16, 0.92)', border: '#d6a23c', primary: '#f0c052', primaryLight: '#fff0c4',
            onPrimary: '#1c0b0c', text: '#fff7ec', textMuted: '#dcc3a8', radius: 16, italicHint: true,
            titleFont: 'serif', keyStyle: 'raised', keyColor: 'rgba(170, 30, 36, 0.45)', borderWidth: 3 },
        // Foot : soirée de match, néons bleus, pelouse et trophées dorés
        14: { bg: '#080d1e', panel: 'rgba(12, 18, 42, 0.92)', border: '#2f7bff', primary: '#3ddc84', primaryLight: '#d7ffe7',
            onPrimary: '#06140c', text: '#f2f6ff', textMuted: '#9fb0d6', radius: 10, letterSpacing: 2,
            glow: true, keyStyle: 'raised', keyColor: 'rgba(47, 123, 255, 0.18)' },
        // Savane : coucher de soleil orangé, bois et toile de safari
        15: { bg: '#2a1206', panel: 'rgba(52, 24, 10, 0.9)', border: '#d98a32', primary: '#ffb347', primaryLight: '#ffe3b0',
            onPrimary: '#2a1206', text: '#fff4e4', textMuted: '#e0bb90', radius: 12, italicHint: true,
            titleFont: 'serif', keyStyle: 'raised', keyColor: 'rgba(120, 66, 30, 0.45)' },
        // Halloween : nuit bleutée, citrouilles orange et violet
        16: { bg: '#0d0a1c', panel: 'rgba(22, 14, 38, 0.93)', border: '#e06a12', primary: '#ff8c1a', primaryLight: '#ffd6a0',
            onPrimary: '#0d0a1c', text: '#f5eeff', textMuted: '#b3a6d0', radius: 14,
            titleFont: 'serif', glow: true, keyStyle: 'raised', keyColor: 'rgba(90, 50, 140, 0.35)', borderWidth: 3 },
    };
    const images: Record<number, ImageSourcePropType> = {
        9: require('./../image/plan9.webp'),
        10: require('./../image/plan10.webp'),
        11: require('./../image/plan11.webp'),
        12: require('./../image/plan12.webp'),
        13: require('./../image/plan13.webp'),
        14: require('./../image/plan14.webp'),
        15: require('./../image/plan15.webp'),
        16: require('./../image/plan16.webp'),
    };
    return Object.fromEntries(
        Object.entries(specs).map(([id, spec]) => [
            Number(id),
            { id: Number(id), backgroundImage: images[Number(id)], gameStyles: makeGameStyles(spec), themeStyles: makeHomeStyles(spec) },
        ])
    );
}
