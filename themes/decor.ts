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
};
