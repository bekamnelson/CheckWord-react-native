// Identité visuelle de chaque thème, utilisée par TOUTE l'application
// (écrans, fenêtres, cadres, vies, décor animé) en complément des styles
// détaillés de themes/themeX.ts (accueil) et themes/gameThemeX.ts (jeu).

export interface ThemePalette {
    bg: string;          // fond de secours derrière l'image
    overlay: string;     // voile posé sur l'image de fond
    panel: string;       // fond des cartes et fenêtres
    panelBorder: string; // bordure des cartes
    primary: string;     // titres, boutons principaux, accents
    onPrimary: string;   // texte posé sur la couleur principale
    accent: string;      // couleur secondaire
    text: string;
    textMuted: string;
    success: string;
    danger: string;
}

// '#ff8fab' + 0.2 → '#ff8fab33' (transparence sur une couleur hexadécimale de la palette)
export const withAlpha = (hex: string, alpha: number) =>
    `${hex}${Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0')}`;

const toRgb = (hex: string) => {
    const n = parseInt(hex.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Mélange opaque de deux couleurs hexadécimales : mix(c, '#ffffff', 0.8) → teinte pastel de c.
export const mix = (a: string, b: string, t: number) => {
    const ca = toRgb(a);
    const cb = toRgb(b);
    return '#' + ca.map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, '0')).join('');
};


export interface ThemeDecor {
    palette: ThemePalette;
    icons: {
        life: string;    // symbole des vies (cœur, fleur, éclair…)
        lifeColor: string;
        corner: string;  // motif posé dans les coins des cadres
        title: string;   // emblème du thème (titres, en-têtes)
    };
    particles: {
        icons: string[];
        colors: string[];
        count: number;
        minSize: number;
        maxSize: number;
        spin: boolean;   // rotation pendant la chute (pétales, bonbons…)
    };
}

export const DECORS: Record<number, ThemeDecor> = {
    // 1 — Fantasy : or et nuit, étincelles magiques qui s'élèvent
    1: {
        palette: {
            bg: '#0d1520',
            overlay: 'rgba(13, 21, 32, 0.68)',
            panel: 'rgba(26, 35, 64, 0.9)',
            panelBorder: 'rgba(201, 147, 58, 0.6)',
            primary: '#f0c060',
            onPrimary: '#1a2340',
            accent: '#c9933a',
            text: '#f5e8c8',
            textMuted: '#d4c09a',
            success: '#6fcf97',
            danger: '#e05a4a',
        },
        icons: { life: 'heart', lifeColor: '#e05a4a', corner: 'crown', title: 'dragon' },
        particles: {
            icons: ['star', 'wand-magic-sparkles'],
            colors: ['#f0c060', '#f5e8c8'],
            count: 12,
            minSize: 6,
            maxSize: 12,
            spin: false,
        },
    },
    // 2 — Sakura : vies en fleurs, pétales roses qui tombent
    2: {
        palette: {
            bg: '#2a1625',
            overlay: 'rgba(42, 22, 37, 0.66)',
            panel: 'rgba(58, 31, 51, 0.92)',
            panelBorder: 'rgba(255, 143, 171, 0.55)',
            primary: '#ff8fab',
            onPrimary: '#2a1625',
            accent: '#ffd1dc',
            text: '#fff5f8',
            textMuted: '#e8ccd5',
            success: '#9be7a1',
            danger: '#e63946',
        },
        icons: { life: 'spa', lifeColor: '#ff8fab', corner: 'spa', title: 'fan' },
        particles: {
            icons: ['spa', 'leaf'],
            colors: ['#ffb7c9', '#ffd1dc', '#ff8fab'],
            count: 14,
            minSize: 10,
            maxSize: 18,
            spin: true,
        },
    },
    // 3 — Cyberpunk : néons cyan/rose, fragments de code qui pleuvent
    3: {
        palette: {
            bg: '#050510',
            overlay: 'rgba(5, 5, 16, 0.7)',
            panel: 'rgba(10, 12, 25, 0.92)',
            panelBorder: 'rgba(0, 243, 255, 0.55)',
            primary: '#00f3ff',
            onPrimary: '#050510',
            accent: '#ff007f',
            text: '#e0eaff',
            textMuted: '#8a9abf',
            success: '#39ff14',
            danger: '#ff003c',
        },
        icons: { life: 'bolt', lifeColor: '#00f3ff', corner: 'microchip', title: 'robot' },
        particles: {
            icons: ['code', 'bolt', 'microchip'],
            colors: ['#00f3ff', '#ff007f', '#b026ff'],
            count: 12,
            minSize: 8,
            maxSize: 14,
            spin: false,
        },
    },
    // 4 — Candy : fond clair, sucreries qui tombent
    4: {
        palette: {
            bg: '#ffe4ec',
            overlay: 'rgba(255, 236, 242, 0.35)',
            panel: 'rgba(255, 249, 250, 0.96)',
            panelBorder: 'rgba(255, 107, 158, 0.6)',
            primary: '#ff6b9e',
            onPrimary: '#ffffff',
            accent: '#4db8ff',
            text: '#5c3a21',
            textMuted: '#8a6a55',
            success: '#2eb872',
            danger: '#ff3366',
        },
        icons: { life: 'candy-cane', lifeColor: '#ff3366', corner: 'ice-cream', title: 'cake-candles' },
        particles: {
            icons: ['candy-cane', 'cookie', 'ice-cream'],
            colors: ['#ff6b9e', '#4db8ff', '#ffcf40'],
            count: 12,
            minSize: 12,
            maxSize: 18,
            spin: true,
        },
    },
    // 5 — Océan : poissons, ancres, bulles qui remontent
    5: {
        palette: {
            bg: '#061539',
            overlay: 'rgba(6, 21, 57, 0.62)',
            panel: 'rgba(6, 21, 57, 0.86)',
            panelBorder: 'rgba(56, 182, 255, 0.55)',
            primary: '#38b6ff',
            onPrimary: '#061539',
            accent: '#ff6b4a',
            text: '#e8f6ff',
            textMuted: '#e3c19b',
            success: '#4cd9a0',
            danger: '#ff6b4a',
        },
        icons: { life: 'fish', lifeColor: '#ff6b4a', corner: 'anchor', title: 'water' },
        particles: {
            icons: ['circle'],
            colors: ['rgba(120, 210, 255, 0.7)', 'rgba(255, 255, 255, 0.55)'],
            count: 16,
            minSize: 5,
            maxSize: 13,
            spin: false,
        },
    },
    // 6 — Crépuscule : soleil couchant, lucioles dorées
    6: {
        palette: {
            bg: '#2d241f',
            overlay: 'rgba(45, 36, 31, 0.66)',
            panel: 'rgba(35, 28, 25, 0.92)',
            panelBorder: 'rgba(255, 202, 40, 0.55)',
            primary: '#ffca28',
            onPrimary: '#2d241f',
            accent: '#f57c00',
            text: '#fff8e1',
            textMuted: '#b3a399',
            success: '#8bc34a',
            danger: '#e5533d',
        },
        icons: { life: 'sun', lifeColor: '#ffca28', corner: 'moon', title: 'feather' },
        particles: {
            icons: ['circle', 'star'],
            colors: ['#ffca28', '#ffe082', '#f57c00'],
            count: 14,
            minSize: 4,
            maxSize: 8,
            spin: false,
        },
    },
    // 7 — Labo : hologrammes, atomes et fioles en suspension
    7: {
        palette: {
            bg: '#020813',
            overlay: 'rgba(2, 8, 19, 0.7)',
            panel: 'rgba(6, 15, 30, 0.9)',
            panelBorder: 'rgba(0, 229, 255, 0.55)',
            primary: '#00e5ff',
            onPrimary: '#020813',
            accent: '#0051ff',
            text: '#e0f7fa',
            textMuted: '#80deea',
            success: '#69f0ae',
            danger: '#ff1744',
        },
        icons: { life: 'flask', lifeColor: '#69f0ae', corner: 'atom', title: 'dna' },
        particles: {
            icons: ['atom', 'vial', 'dna'],
            colors: ['#00e5ff', '#69f0ae', '#4f8bff'],
            count: 10,
            minSize: 10,
            maxSize: 16,
            spin: true,
        },
    },
    // 8 — Rue : béton, graffitis et musique urbaine
    8: {
        palette: {
            bg: '#1e2226',
            overlay: 'rgba(30, 34, 38, 0.66)',
            panel: 'rgba(38, 44, 51, 0.92)',
            panelBorder: 'rgba(255, 183, 77, 0.55)',
            primary: '#ffb74d',
            onPrimary: '#1e2226',
            accent: '#e65100',
            text: '#f5f5f5',
            textMuted: '#a7adb3',
            success: '#66bb6a',
            danger: '#e53935',
        },
        icons: { life: 'spray-can', lifeColor: '#ffb74d', corner: 'city', title: 'spray-can-sparkles' },
        particles: {
            icons: ['music', 'spray-can-sparkles', 'compact-disc'],
            colors: ['#ffb74d', '#e65100', '#9ccc65'],
            count: 10,
            minSize: 10,
            maxSize: 16,
            spin: true,
        },
    },

    // ── Thèmes 9 à 16 : débloqués en mode Survie (fonds dans image/plan9 à plan16) ──

    // 9 — Échecs : salle aux chandelles, pièces qui tombent
    9: {
        palette: {
            bg: '#140f0b', overlay: 'rgba(20, 15, 11, 0.55)', panel: 'rgba(28, 20, 14, 0.93)',
            panelBorder: 'rgba(224, 179, 90, 0.6)', primary: '#e0b35a', onPrimary: '#140f0b', accent: '#f6ecdc',
            text: '#f6ecdc', textMuted: '#c9b393', success: '#8fce8a', danger: '#e0584a',
        },
        icons: { life: 'chess-pawn', lifeColor: '#f6ecdc', corner: 'chess-rook', title: 'chess-knight' },
        particles: { icons: ['chess-pawn', 'chess-knight', 'chess-queen'], colors: ['#f6ecdc', '#e0b35a'], count: 9, minSize: 10, maxSize: 16, spin: true },
    },
    // 10 — Hiver : village enneigé au crépuscule, flocons
    10: {
        palette: {
            bg: '#141a3c', overlay: 'rgba(20, 26, 60, 0.45)', panel: 'rgba(24, 32, 78, 0.88)',
            panelBorder: 'rgba(188, 212, 255, 0.6)', primary: '#bcd4ff', onPrimary: '#141a3c', accent: '#ffd28a',
            text: '#f4f7ff', textMuted: '#b8c2e6', success: '#7ee0b0', danger: '#ff6b7a',
        },
        icons: { life: 'snowflake', lifeColor: '#e6f0ff', corner: 'snowflake', title: 'mountain' },
        particles: { icons: ['snowflake'], colors: ['#ffffff', '#e6f0ff', '#bcd4ff'], count: 20, minSize: 8, maxSize: 16, spin: true },
    },
    // 11 — Forêt : campement de nuit, lucioles et feuilles
    11: {
        palette: {
            bg: '#0b1a12', overlay: 'rgba(11, 26, 18, 0.5)', panel: 'rgba(14, 32, 22, 0.9)',
            panelBorder: 'rgba(159, 212, 106, 0.55)', primary: '#9fd46a', onPrimary: '#0b1a12', accent: '#ffc861',
            text: '#f1f7e8', textMuted: '#b5caa8', success: '#9be07f', danger: '#e8705a',
        },
        icons: { life: 'leaf', lifeColor: '#9fd46a', corner: 'tree', title: 'tree' },
        particles: { icons: ['circle', 'leaf'], colors: ['#fff27a', '#ffc861', '#9fd46a'], count: 14, minSize: 4, maxSize: 12, spin: true },
    },
    // 12 — Étoiles : galaxie, planètes et étoiles filantes
    12: {
        palette: {
            bg: '#07061c', overlay: 'rgba(7, 6, 28, 0.4)', panel: 'rgba(14, 10, 42, 0.86)',
            panelBorder: 'rgba(184, 156, 255, 0.6)', primary: '#b89cff', onPrimary: '#07061c', accent: '#ffb86b',
            text: '#f3eeff', textMuted: '#aea6d6', success: '#7de3c0', danger: '#ff6f91',
        },
        icons: { life: 'star', lifeColor: '#ffd98a', corner: 'star', title: 'user-astronaut' },
        particles: { icons: ['star', 'meteor', 'circle'], colors: ['#ffffff', '#ffd98a', '#b89cff'], count: 16, minSize: 4, maxSize: 12, spin: false },
    },
    // 13 — Noël : marché de Noël, cadeaux et neige
    13: {
        palette: {
            bg: '#1c0b0c', overlay: 'rgba(28, 11, 12, 0.45)', panel: 'rgba(44, 14, 16, 0.92)',
            panelBorder: 'rgba(240, 192, 82, 0.6)', primary: '#f0c052', onPrimary: '#1c0b0c', accent: '#d8323a',
            text: '#fff7ec', textMuted: '#dcc3a8', success: '#6fd08c', danger: '#ff5a5a',
        },
        icons: { life: 'gift', lifeColor: '#e0443e', corner: 'candy-cane', title: 'sleigh' },
        particles: { icons: ['snowflake', 'star', 'gift'], colors: ['#ffffff', '#f0c052', '#e0443e'], count: 14, minSize: 8, maxSize: 14, spin: true },
    },
    // 14 — Foot : soirée de match, ballons et trophées
    14: {
        palette: {
            bg: '#080d1e', overlay: 'rgba(8, 13, 30, 0.5)', panel: 'rgba(12, 18, 42, 0.92)',
            panelBorder: 'rgba(47, 123, 255, 0.7)', primary: '#3ddc84', onPrimary: '#06140c', accent: '#f5c542',
            text: '#f2f6ff', textMuted: '#9fb0d6', success: '#3ddc84', danger: '#ff4f5e',
        },
        icons: { life: 'futbol', lifeColor: '#f2f6ff', corner: 'trophy', title: 'futbol' },
        particles: { icons: ['futbol', 'star', 'trophy'], colors: ['#f2f6ff', '#3ddc84', '#f5c542'], count: 10, minSize: 10, maxSize: 16, spin: true },
    },
    // 15 — Savane : safari au coucher de soleil
    15: {
        palette: {
            bg: '#2a1206', overlay: 'rgba(42, 18, 6, 0.45)', panel: 'rgba(52, 24, 10, 0.9)',
            panelBorder: 'rgba(255, 179, 71, 0.6)', primary: '#ffb347', onPrimary: '#2a1206', accent: '#e0703a',
            text: '#fff4e4', textMuted: '#e0bb90', success: '#a7d65c', danger: '#ff6a4a',
        },
        icons: { life: 'paw', lifeColor: '#ffb347', corner: 'sun', title: 'hippo' },
        particles: { icons: ['feather', 'leaf'], colors: ['#ffb347', '#e0703a', '#fff4e4'], count: 10, minSize: 10, maxSize: 16, spin: true },
    },
    // 16 — Halloween : manoir hanté, fantômes et araignées
    16: {
        palette: {
            bg: '#0d0a1c', overlay: 'rgba(13, 10, 28, 0.5)', panel: 'rgba(22, 14, 38, 0.93)',
            panelBorder: 'rgba(255, 140, 26, 0.6)', primary: '#ff8c1a', onPrimary: '#0d0a1c', accent: '#9b5cff',
            text: '#f5eeff', textMuted: '#b3a6d0', success: '#8fe06f', danger: '#ff4d6d',
        },
        icons: { life: 'ghost', lifeColor: '#efe6ff', corner: 'spider', title: 'hat-wizard' },
        particles: { icons: ['ghost', 'spider', 'moon'], colors: ['#efe6ff', '#ff8c1a', '#9b5cff'], count: 10, minSize: 10, maxSize: 16, spin: false },
    },
};
