import { Dimensions, StyleSheet } from 'react-native';

// Fabrique de styles pour les thèmes 9 à 16 : même structure que themeX.ts (accueil) et
// gameThemeX.ts (jeu), calculée à partir d'une palette au lieu d'être écrite à la main.

const { width } = Dimensions.get('window');
const small = width < 480;

export interface ThemeSpec {
    bg: string;          // fond de l'écran
    panel: string;       // fond des cadres
    border: string;      // bordure des cadres
    primary: string;     // boutons, titres, accents
    primaryLight: string; // titres lumineux
    onPrimary: string;   // texte posé sur la couleur principale
    text: string;
    textMuted: string;
    radius: number;      // arrondi des cadres (0 = anguleux, ex. pixel)
    italicHint?: boolean; // indice en italique
    letterSpacing?: number;
    titleFont?: 'serif' | 'monospace'; // police des titres (polices système Android / iOS)
    glow?: boolean;       // lueur néon autour des titres, touches et lettres
    keyStyle?: 'flat' | 'raised' | 'glass'; // touches plates, en relief (3D) ou en verre
    keyColor?: string;    // fond des touches (sinon teinte légère du texte)
    borderWidth?: number; // épaisseur des cadres principaux
}

// Effets communs dérivés des options du thème
function effects(s: ThemeSpec) {
    const glow = s.glow
        ? { textShadowColor: s.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 }
        : { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 4 };
    const titleFont = s.titleFont ? { fontFamily: s.titleFont } : {};
    const keyBg = s.keyColor ?? (s.keyStyle === 'glass' ? rgba(s.text, 0.12) : rgba(s.text, 0.08));
    const key = s.keyStyle === 'raised'
        ? { backgroundColor: keyBg, borderWidth: 1, borderBottomWidth: 4, borderColor: rgba(s.primary, 0.5), borderBottomColor: rgba('#000000', 0.45) }
        : s.keyStyle === 'glass'
            ? { backgroundColor: keyBg, borderWidth: 1, borderColor: rgba(s.text, 0.35), borderTopColor: rgba(s.text, 0.6) }
            : { backgroundColor: keyBg, borderWidth: 1, borderColor: rgba(s.primary, 0.35) };
    const keyGlow = s.glow
        ? { shadowColor: s.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 3 }
        : {};
    return { glow, titleFont, key, keyGlow, bw: s.borderWidth ?? 2 };
}

// '#rrggbb' + opacité → 'rgba(r, g, b, a)'
const rgba = (hex: string, a: number) => {
    const n = parseInt(hex.slice(1, 7), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export function makeGameStyles(s: ThemeSpec) {
    const r = s.radius;
    const ls = s.letterSpacing ?? 1;
    const fx = effects(s);
    return StyleSheet.create({
        gameWrap: { flex: 1, backgroundColor: s.bg, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
        heroBg: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: s.bg, opacity: 0.8 },
        heroOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: rgba(s.bg, 0.6) },

        gameHeader: {
            width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, zIndex: 10,
        },
        backBtn: { flexDirection: 'row', alignItems: 'center', padding: 5 },
        backBtnText: { color: s.primary, fontSize: 14, letterSpacing: ls, fontWeight: '600' },
        headerTitle: { fontSize: 20, fontWeight: '900', color: s.primaryLight, letterSpacing: ls, ...fx.titleFont, ...fx.glow },
        levelIndicator: { padding: 5 },
        levelIndicatorText: { fontSize: 14, color: s.textMuted, letterSpacing: ls },

        bigcontainer: {
            width: '100%', backgroundColor: s.panel, borderColor: s.border, borderWidth: fx.bw,
            borderRadius: r + 4, paddingTop: 30, paddingHorizontal: 16, paddingBottom: 30,
            shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8,
        },
        container: { alignItems: 'center', width: '100%' },

        ornament: { position: 'absolute', width: 20, height: 20, borderColor: s.border, opacity: 0.6 },
        ornamentTL: { top: 10, left: 10, borderTopWidth: 2, borderLeftWidth: 2 },
        ornamentTR: { top: 10, right: 10, borderTopWidth: 2, borderRightWidth: 2 },
        ornamentBL: { bottom: 10, left: 10, borderBottomWidth: 2, borderLeftWidth: 2 },
        ornamentBR: { bottom: 10, right: 10, borderBottomWidth: 2, borderRightWidth: 2 },

        description: {
            width: '100%', borderWidth: 1, borderColor: rgba(s.primary, 0.35), borderRadius: r,
            backgroundColor: rgba(s.primary, 0.07), paddingTop: 20, paddingHorizontal: 16, paddingBottom: 20,
            marginBottom: 30, alignItems: 'center',
        },
        contenuedescription: {
            textAlign: 'center', fontSize: 15, fontStyle: s.italicHint ? 'italic' : 'normal',
            color: s.text, lineHeight: 22, ...fx.titleFont,
        },

        game: {
            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap',
            gap: 4, marginBottom: 30, width: '100%',
        },
        letterBox: {
            width: (width - 96) / 8, maxWidth: 45, height: 50, ...fx.key,
            borderRadius: Math.min(r, 8), alignItems: 'center', justifyContent: 'center',
        },
        letterText: { fontSize: 22, fontWeight: 'bold', color: s.primaryLight, textTransform: 'uppercase', ...fx.glow },
        baredeco: { position: 'absolute', bottom: 4, width: '70%', height: 2, backgroundColor: s.primary },

        lifebar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 30 },
        lifeSlot: {
            width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: rgba(s.primary, 0.4),
            backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center',
        },
        lifeActive: { backgroundColor: s.primary, borderColor: s.primary },
        heartIcon: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: -1 },

        keyboardContainer: { width: '100%', alignItems: 'center' },
        keyboardgrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
        keyButton: {
            width: (width - 32 - 32 - 40) / 7, height: 45, ...fx.key, ...fx.keyGlow,
            borderRadius: Math.min(r, 10), alignItems: 'center', justifyContent: 'center',
        },
        keyButtonText: { fontSize: 16, fontWeight: 'bold', color: s.text, ...fx.titleFont },

        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
        boiteModal: {
            width: '85%', backgroundColor: s.bg, borderColor: s.border, borderWidth: fx.bw, borderRadius: r + 8,
            padding: 30, alignItems: 'center', elevation: 10,
        },
        modalIcon: { fontSize: 45, marginBottom: 15 },
        modalTitle: { fontSize: 22, fontWeight: 'bold', color: s.primaryLight, marginBottom: 10, textAlign: 'center', ...fx.titleFont, ...fx.glow },
        modalText: { color: s.textMuted, fontSize: 16, lineHeight: 24, marginBottom: 25, textAlign: 'center' },
        modalActions: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10 },
        btnPrimary: {
            backgroundColor: s.primary, paddingVertical: 12, paddingHorizontal: 20,
            borderRadius: r >= 8 ? 25 : r, elevation: 3,
        },
        btnPrimaryText: { color: s.onPrimary, fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
        btnSecondary: {
            backgroundColor: 'transparent', borderWidth: 1, borderColor: s.textMuted,
            paddingVertical: 12, paddingHorizontal: 20, borderRadius: r >= 8 ? 25 : r,
        },
        btnSecondaryText: { color: s.textMuted, fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
    });
}

export function makeHomeStyles(s: ThemeSpec) {
    const r = s.radius;
    const ls = s.letterSpacing ?? 1;
    const fx = effects(s);
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: s.bg },
        heroBg: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
        heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: rgba(s.bg, 0.55) },
        pageWrap: { flexGrow: 1, zIndex: 2, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 },

        titleCard: { alignItems: 'center', marginBottom: 40 },
        logoEmblem: {
            width: 120, height: 120, borderRadius: r >= 8 ? 60 : r, borderWidth: 4, borderColor: s.primary,
            overflow: 'hidden', backgroundColor: s.bg, marginBottom: 20,
            shadowColor: s.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
        },
        logoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
        gameTitle: {
            fontSize: small ? 30 : 48, fontWeight: '900', color: s.primaryLight, letterSpacing: ls + 1, textAlign: 'center',
            ...fx.titleFont, ...fx.glow,
        },
        titleSub: {
            fontStyle: s.italicHint ? 'italic' : 'normal', fontSize: small ? 13 : 17, color: s.textMuted,
            marginTop: 8, letterSpacing: ls, opacity: 0.9, ...fx.titleFont,
            textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
        },
        titleDivider: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center', marginVertical: 16 },
        dividerLine: { height: 1, width: 80, backgroundColor: s.primary },
        fleurIcon: { color: s.primary, fontSize: 19 },

        panel: {
            backgroundColor: s.panel, borderWidth: fx.bw, borderColor: s.border, borderRadius: r + 8,
            paddingVertical: small ? 25 : 40, paddingHorizontal: small ? 15 : 50, width: '100%', maxWidth: 500,
            alignItems: 'center', position: 'relative',
            shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.7, shadowRadius: 20, elevation: 12,
        },
        panelTopBorder: { position: 'absolute', top: -1, left: 30, right: 30, height: 2, backgroundColor: s.primaryLight },

        sceneFrame: {
            borderRadius: r, overflow: 'hidden', borderWidth: 2, borderColor: s.border,
            marginBottom: 32, width: '100%', position: 'relative',
        },
        sceneImage: { width: '100%', height: 200, resizeMode: 'cover' },

        levelBadge: {
            flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: rgba(s.primary, 0.12),
            borderWidth: 1, borderColor: s.border, borderRadius: r >= 8 ? 30 : r,
            paddingVertical: small ? 6 : 8, paddingHorizontal: small ? 15 : 20, marginBottom: 28,
        },
        badgeText: { color: s.primaryLight, fontSize: small ? 13 : 15, letterSpacing: ls },
        levelNum: { fontWeight: '700', fontSize: small ? 15 : 17, color: s.primaryLight },

        btnStart: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: s.primary,
            borderRadius: r >= 8 ? 50 : r, paddingVertical: small ? 14 : 16, paddingHorizontal: small ? 30 : 48,
            width: '100%', maxWidth: 280,
            shadowColor: s.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
        },
        btnText: {
            fontSize: small ? 15 : 18, fontWeight: '700', letterSpacing: ls + 1, color: s.onPrimary, textTransform: 'uppercase',
            ...fx.titleFont,
        },

        panelFooter: {
            marginTop: 28, fontStyle: s.italicHint ? 'italic' : 'normal', fontSize: 13,
            color: rgba(s.text, 0.45), letterSpacing: 0.8,
        },

        ornament: { position: 'absolute', width: 28, height: 28, borderColor: s.border, opacity: 0.6 },
        ornamentTL: { top: 12, left: 12, borderTopWidth: 2, borderLeftWidth: 2 },
        ornamentTR: { top: 12, right: 12, borderTopWidth: 2, borderRightWidth: 2 },
        ornamentBL: { bottom: 12, left: 12, borderBottomWidth: 2, borderLeftWidth: 2 },
        ornamentBR: { bottom: 12, right: 12, borderBottomWidth: 2, borderRightWidth: 2 },
    });
}
