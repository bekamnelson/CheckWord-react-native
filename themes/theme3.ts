import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// ── PALETTE DE COULEURS (THÈME 3 - CYBERPUNK) ──
export const theme3Colors = {
    neonCyan: '#00f3ff',
    neonPurple: '#b026ff',
    neonPink: '#ff007f',
    darkBg: '#050510',
    panelBg: 'rgba(13, 10, 30, 0.85)', // Légèrement plus opaque pour compenser l'absence de backdrop-filter
    textMain: '#e0eaff',
    textMuted: '#8a99c0',
};

// ── STYLES CONVERTIS DEPUIS LE CSS ──
export const theme3Styles = StyleSheet.create({
    // Body Equivalent
    container: {
        flex: 1,
        backgroundColor: theme3Colors.darkBg,
    },

    // .hero-bg & .hero-overlay
    heroBg: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFill,
        // Remplacement du radial-gradient par une couleur sombre unie
        backgroundColor: 'rgba(5, 2, 15, 0.75)',
    },

    // .page-wrap
    pageWrap: {
        flexGrow: 1,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },

    // ── TITLE CARD ──
    titleCard: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoEmblem: {
        width: 100, // Légèrement réduit car la rotation prend plus de place
        height: 100,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: theme3Colors.neonCyan,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        marginBottom: 30,
        overflow: 'hidden',
        // Rotation pour créer le losange futuriste
        transform: [{ rotate: '45deg' }],
        // Effet Néon
        shadowColor: theme3Colors.neonCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        // On redresse l'image et on la zoome pour remplir les coins du losange
        transform: [{ rotate: '-45deg' }, { scale: 1.45 }],
    },
    gameTitle: {
        fontSize: width < 480 ? 28 : 45,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 3,
        textAlign: 'center',
        textTransform: 'uppercase',
        // React Native ne supporte qu'une seule ombre, on prend la plus marquante (Cyan)
        textShadowColor: theme3Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        // fontFamily: 'Orbitron', // À décommenter si police chargée
    },
    titleSub: {
        fontSize: width < 480 ? 12 : 16,
        color: theme3Colors.neonCyan,
        marginTop: 8,
        letterSpacing: 3,
        textTransform: 'uppercase',
        textShadowColor: theme3Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        // fontFamily: 'Rajdhani',
    },
    titleDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        justifyContent: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        height: 2,
        width: 80,
        backgroundColor: theme3Colors.neonPurple,
    },
    fleurIcon: {
        color: theme3Colors.neonCyan,
        fontSize: 16,
        textShadowColor: theme3Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },

    // ── MAIN PANEL (Interface HUD) ──
    panel: {
        backgroundColor: theme3Colors.panelBg,
        borderWidth: 1,
        borderColor: 'rgba(176, 38, 255, 0.5)',
        borderTopWidth: 3,
        borderTopColor: theme3Colors.neonCyan,
        borderBottomWidth: 3,
        borderBottomColor: theme3Colors.neonPurple,
        borderRadius: 8,
        paddingVertical: width < 480 ? 30 : 40,
        paddingHorizontal: width < 480 ? 20 : 50,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },

    // ── SCENE FRAME ──
    sceneFrame: {
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme3Colors.neonCyan,
        marginBottom: 32,
        width: '100%',
        position: 'relative',
        shadowColor: theme3Colors.neonCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    sceneImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    // Overlay pour simuler le filtre CSS (sepia/hue-rotate)
    sceneOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 243, 255, 0.15)', // Teinte bleutée cyber
    },

    // ── LEVEL BADGE (HUD STATS) ──
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0, 243, 255, 0.1)',
        borderWidth: 1,
        borderColor: theme3Colors.neonCyan,
        borderRadius: 4,
        paddingVertical: width < 480 ? 6 : 8,
        paddingHorizontal: width < 480 ? 18 : 24,
        marginBottom: 28,
    },
    badgeText: {
        color: theme3Colors.neonCyan,
        fontSize: width < 480 ? 12 : 14,
        letterSpacing: 2,
        textTransform: 'uppercase',
        // fontFamily: 'Orbitron',
    },
    levelNum: {
        fontWeight: '900',
        fontSize: width < 480 ? 16 : 19,
        color: '#fff',
        textShadowColor: theme3Colors.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        // fontFamily: 'Orbitron',
    },

    // ── START BUTTON (SYSTEM BOOT) ──
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        // Remplacement du dégradé par une couleur unie (Violet Néon)
        backgroundColor: 'rgba(176, 38, 255, 0.7)',
        borderWidth: 2,
        borderColor: theme3Colors.neonCyan,
        borderRadius: 4,
        paddingVertical: width < 480 ? 14 : 16,
        paddingHorizontal: width < 480 ? 30 : 48,
        width: '100%',
        maxWidth: 280,
        shadowColor: theme3Colors.neonCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
    btnText: {
        fontSize: width < 480 ? 14 : 16,
        fontWeight: '700',
        letterSpacing: 3,
        color: '#fff',
        textTransform: 'uppercase',
        // fontFamily: 'Orbitron',
    },

    // ── DECORATIVE FOOTER ──
    panelFooter: {
        marginTop: 28,
        fontSize: width < 480 ? 11 : 13,
        color: theme3Colors.textMuted,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        // fontFamily: 'Rajdhani',
    },

    // ── CORNER TECH ORNAMENTS ──
    ornament: {
        position: 'absolute',
        width: 20,
        height: 20,
    },
    ornamentTL: {
        top: -2, left: -2,
        borderTopWidth: 2, borderLeftWidth: 2,
        borderColor: theme3Colors.neonCyan
    },
    ornamentTR: {
        top: -2, right: -2,
        borderTopWidth: 2, borderRightWidth: 2,
        borderColor: theme3Colors.neonCyan
    },
    ornamentBL: {
        bottom: -2, left: -2,
        borderBottomWidth: 2, borderLeftWidth: 2,
        borderColor: theme3Colors.neonPurple
    },
    ornamentBR: {
        bottom: -2, right: -2,
        borderBottomWidth: 2, borderRightWidth: 2,
        borderColor: theme3Colors.neonPurple
    },
});