import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// ── PALETTE DE COULEURS (THÈME 2 - SAKURA) ──
export const theme2Colors = {
    sakuraLight: '#ffd1dc',
    sakuraMain: '#ff8fab',
    sakuraDark: '#d65a7e',
    plumDark: '#2a1625',
    plumPanel: '#3a1f33',
    lanternGlow: '#ffb84d',
    paper: '#fff5f8',
    paperDark: '#e8ccd5',
    redLife: '#e63946',
    shadow: 'rgba(0, 0, 0, 0.6)',
};

// ── STYLES CONVERTIS DEPUIS LE CSS ──
export const theme2Styles = StyleSheet.create({
    // Body Equivalent
    container: {
        flex: 1,
        backgroundColor: theme2Colors.plumDark,
    },

    // .hero-bg & .hero-overlay
    heroBg: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFill,
        // Remplacement du radial-gradient par une couleur unie semi-transparente
        backgroundColor: 'rgba(42, 22, 37, 0.75)',
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
        borderColor: theme2Colors.sakuraMain,
        overflow: 'hidden',
        backgroundColor: theme2Colors.plumDark,
        marginBottom: 20,
        // Box Shadow React Native / iOS
        shadowColor: theme2Colors.sakuraMain,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
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
        color: theme2Colors.sakuraLight,
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: 'rgba(255, 143, 171, 0.6)',
        textShadowOffset: { width: 2, height: 4 },
        textShadowRadius: 8,
        // fontFamily: 'Kaushan Script', // Décommente si tu as chargé la police via expo-font
    },
    titleSub: {
        fontStyle: 'italic',
        fontSize: width < 480 ? 13 : 17,
        color: theme2Colors.paperDark,
        marginTop: 8,
        letterSpacing: 1,
        opacity: 0.85,
        // fontFamily: 'Sawarabi Mincho', // Décommente si tu as chargé la police via expo-font
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
        backgroundColor: theme2Colors.sakuraMain,
    },
    fleurIcon: {
        color: theme2Colors.sakuraMain,
        fontSize: 19,
    },

    // ── MAIN PANEL ──
    panel: {
        // Remplacement du linear-gradient par une couleur unie (ou utilise expo-linear-gradient si tu préfères)
        backgroundColor: 'rgba(58, 31, 51, 0.9)',
        borderWidth: 2,
        borderColor: theme2Colors.sakuraDark,
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
        backgroundColor: theme2Colors.sakuraLight,
    },

    // ── SCENE FRAME ──
    sceneFrame: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: theme2Colors.sakuraDark,
        marginBottom: 32,
        width: '100%',
        position: 'relative',
        shadowColor: theme2Colors.sakuraMain,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
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
        backgroundColor: 'rgba(255, 143, 171, 0.12)',
        borderWidth: 1,
        borderColor: theme2Colors.sakuraDark,
        borderRadius: 30,
        paddingVertical: width < 480 ? 6 : 8,
        paddingHorizontal: width < 480 ? 15 : 20,
        marginBottom: 28,
    },
    badgeText: {
        color: theme2Colors.sakuraLight,
        fontSize: width < 480 ? 13 : 15,
        letterSpacing: 1,
        // fontFamily: 'Kaushan Script',
    },
    levelNum: {
        fontWeight: '700',
        fontSize: width < 480 ? 15 : 17,
        color: theme2Colors.sakuraLight,
        // fontFamily: 'Kaushan Script',
    },

    // ── START BUTTON ──
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme2Colors.sakuraMain, // Couleur unie au lieu du dégradé
        borderRadius: 50,
        paddingVertical: width < 480 ? 14 : 16,
        paddingHorizontal: width < 480 ? 30 : 48,
        width: '100%',
        maxWidth: 280,
        shadowColor: theme2Colors.sakuraMain,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 6,
    },
    btnText: {
        fontSize: width < 480 ? 15 : 18,
        fontWeight: '700',
        letterSpacing: 2,
        color: theme2Colors.plumDark,
        textTransform: 'uppercase',
        // fontFamily: 'Kaushan Script',
    },

    // ── DECORATIVE FOOTER ──
    panelFooter: {
        marginTop: 28,
        fontStyle: 'italic',
        fontSize: 13,
        color: 'rgba(255, 245, 248, 0.4)',
        letterSpacing: 0.8,
        // fontFamily: 'Sawarabi Mincho',
    },

    // ── CORNER ORNAMENTS ──
    ornament: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderColor: theme2Colors.sakuraDark,
        opacity: 0.6,
    },
    ornamentTL: { top: 12, left: 12, borderTopWidth: 2, borderLeftWidth: 2 },
    ornamentTR: { top: 12, right: 12, borderTopWidth: 2, borderRightWidth: 2 },
    ornamentBL: { bottom: 12, left: 12, borderBottomWidth: 2, borderLeftWidth: 2 },
    ornamentBR: { bottom: 12, right: 12, borderBottomWidth: 2, borderRightWidth: 2 },
});