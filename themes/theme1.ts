import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// ── PALETTE DE COULEURS ET VARIABLES ──
export const theme1Colors = {
    gold: '#c9933a',
    goldLight: '#f0c060',
    goldDark: '#8a5f1a',
    navy: '#1a2340',
    navyDark: '#0d1520',
    parchment: '#f5e8c8',
    parchmentDark: '#d4c09a',
    wood: '#5a3820',
    woodLight: '#7a5030',
    cream: '#faf3e0',
    redLife: '#c0392b',
    greenWin: '#27ae60',
    shadow: 'rgba(0, 0, 0, 0.6)',
    goldGlow: 'rgba(201, 147, 58, 0.5)',
    panelGlow: 'rgba(201, 147, 58, 0.15)',
};

// ── STYLES CONVERTIS DEPUIS LE CSS ──
export const theme1Styles = StyleSheet.create({
    // Body Equivalent
    container: {
        flex: 1,
        backgroundColor: theme1Colors.navyDark,
    },

    // .hero-bg & .hero-overlay
    heroBg: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(10, 15, 30, 0.65)',
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
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: theme1Colors.gold,
        overflow: 'hidden',
        backgroundColor: theme1Colors.navyDark,
        marginBottom: 20,
        // Box Shadow React Native / iOS
        shadowColor: theme1Colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        // Elevation Android
        elevation: 10,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gameTitle: {
        fontSize: width < 480 ? 28 : 48,
        fontWeight: '900',
        color: theme1Colors.goldLight,
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: 'rgba(201, 147, 58, 0.6)',
        textShadowOffset: { width: 2, height: 4 },
        textShadowRadius: 8,
    },
    titleSub: {
        fontStyle: 'italic',
        fontSize: width < 480 ? 13 : 17,
        color: theme1Colors.parchmentDark,
        marginTop: 8,
        letterSpacing: 1,
        opacity: 0.85,
    },
    titleDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        height: 1,
        width: 80,
        backgroundColor: theme1Colors.gold,
    },
    fleurIcon: {
        color: theme1Colors.gold,
        fontSize: 19,
    },

    // ── MAIN PANEL ──
    panel: {
        backgroundColor: theme1Colors.navy,
        borderWidth: 2,
        borderColor: theme1Colors.goldDark,
        borderRadius: 20,
        paddingVertical: width < 480 ? 25 : 40,
        paddingHorizontal: width < 480 ? 15 : 50,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 12,
    },
    panelTopBorder: {
        position: 'absolute',
        top: -1,
        left: 30,
        right: 30,
        height: 2,
        backgroundColor: theme1Colors.goldLight,
    },

    // ── SCENE FRAME ──
    sceneFrame: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: theme1Colors.goldDark,
        marginBottom: 32,
        width: '100%',
        position: 'relative',
    },
    sceneImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    // ── LEVEL BADGE ──
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(201, 147, 58, 0.12)',
        borderWidth: 1,
        borderColor: theme1Colors.goldDark,
        borderRadius: 30,
        paddingVertical: width < 480 ? 6 : 8,
        paddingHorizontal: width < 480 ? 15 : 20,
        marginBottom: 28,
    },
    badgeText: {
        color: theme1Colors.goldLight,
        fontSize: width < 480 ? 13 : 15,
        letterSpacing: 1,
    },
    levelNum: {
        fontWeight: '700',
        fontSize: width < 480 ? 15 : 17,
        color: theme1Colors.goldLight,
    },

    // ── START BUTTON ──
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme1Colors.gold,
        borderRadius: 50,
        paddingVertical: width < 480 ? 14 : 16,
        paddingHorizontal: width < 480 ? 30 : 48,
        width: '100%',
        maxWidth: 280,
        shadowColor: theme1Colors.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    btnText: {
        fontSize: width < 480 ? 15 : 18,
        fontWeight: '700',
        letterSpacing: 2,
        color: theme1Colors.navyDark,
        textTransform: 'uppercase',
    },

    // ── DECORATIVE FOOTER ──
    panelFooter: {
        marginTop: 28,
        fontStyle: 'italic',
        fontSize: 13,
        color: 'rgba(245, 232, 200, 0.4)',
        letterSpacing: 0.8,
    },

    // ── CORNER ORNAMENTS ──
    ornament: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderColor: theme1Colors.goldDark,
        opacity: 0.6,
    },
    ornamentTL: { top: 12, left: 12, borderTopWidth: 2, borderLeftWidth: 2 },
    ornamentTR: { top: 12, right: 12, borderTopWidth: 2, borderRightWidth: 2 },
    ornamentBL: { bottom: 12, left: 12, borderBottomWidth: 2, borderLeftWidth: 2 },
    ornamentBR: { bottom: 12, right: 12, borderBottomWidth: 2, borderRightWidth: 2 },
});