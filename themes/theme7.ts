import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// ── PALETTE DE COULEURS (THÈME 7 - HOLOGRAMME LABO) ──
export const theme7Colors = {
    holoCyan: '#00e5ff',
    holoBlue: '#0051ff',
    labDark: '#020813',
    glassBg: 'rgba(6, 15, 30, 0.85)', // Légèrement plus opaque pour compenser le backdrop-filter
    textMain: '#e0f7fa',
    textMuted: '#80deea',
    alertRed: '#ff1744',
};

// ── STYLES CONVERTIS DEPUIS LE CSS ──
export const theme7Styles = StyleSheet.create({
    // Body Equivalent
    container: {
        flex: 1,
        backgroundColor: theme7Colors.labDark,
    },

    // .hero-bg & .hero-overlay
    heroBg: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        // Remplacement du radial-gradient par un voile bleu nuit profond
        backgroundColor: 'rgba(2, 8, 19, 0.85)',
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
        marginBottom: 35,
    },
    logoEmblem: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: theme7Colors.holoCyan,
        // Remplacement du motif atome par un fond bleuté semi-transparent
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: theme7Colors.holoCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.9,
    },
    gameTitle: {
        fontSize: width < 480 ? 35 : 55,
        fontWeight: '400',
        color: '#ffffff',
        letterSpacing: 3,
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadowColor: theme7Colors.holoCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        // fontFamily: 'Share Tech Mono', // À décommenter si police chargée
    },
    titleSub: {
        fontSize: width < 480 ? 12 : 16,
        fontWeight: '600',
        color: theme7Colors.holoCyan,
        marginTop: 5,
        letterSpacing: 4,
        textTransform: 'uppercase',
        textShadowColor: theme7Colors.holoCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        // fontFamily: 'Exo 2',
    },
    // On cache le séparateur classique pour ce thème
    titleDivider: {
        display: 'none',
    },
    dividerLine: {},
    fleurIcon: {},

    // ── MAIN PANEL (Interface HUD) ──
    panel: {
        backgroundColor: theme7Colors.glassBg,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
        borderRadius: 4, // Formes droites / Tech
        paddingVertical: width < 480 ? 30 : 40,
        paddingHorizontal: width < 480 ? 20 : 50,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },

    // ── SCENE FRAME (Écran d'analyse) ──
    sceneFrame: {
        borderRadius: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme7Colors.holoCyan,
        marginBottom: 25,
        width: '100%',
        position: 'relative',
        shadowColor: theme7Colors.holoCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    sceneImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    // Overlay pour simuler le filtre CSS (sepia/hue-rotate) et donner l'effet Hologramme
    sceneOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 229, 255, 0.25)',
    },
    // Ligne de scan radar (statique ici, à animer avec Animated API si besoin)
    scanline: {
        position: 'absolute',
        top: '50%', // Position fixe au milieu par défaut
        left: 0,
        width: '100%',
        height: 3,
        backgroundColor: 'rgba(0, 229, 255, 0.6)',
        shadowColor: theme7Colors.holoCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },

    // ── LEVEL BADGE (Identifiant Système) ──
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0, 81, 255, 0.2)',
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: theme7Colors.holoCyan,
        paddingVertical: width < 480 ? 6 : 8,
        paddingHorizontal: width < 480 ? 15 : 20,
        marginBottom: 25,
    },
    badgeText: {
        color: theme7Colors.textMuted,
        fontSize: width < 480 ? 14 : 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
        // fontFamily: 'Share Tech Mono',
    },
    levelNum: {
        fontWeight: '700',
        fontSize: width < 480 ? 16 : 19,
        color: '#fff',
        textShadowColor: theme7Colors.holoCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
        // fontFamily: 'Share Tech Mono',
    },

    // ── START BUTTON (Initialisation Séquence) ──
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderWidth: 1,
        borderColor: theme7Colors.holoCyan,
        borderRadius: 0, // Tech blocky (pas d'arrondi)
        paddingVertical: width < 480 ? 14 : 15,
        paddingHorizontal: width < 480 ? 20 : 40,
        width: '100%',
        maxWidth: 280,
    },
    btnText: {
        fontSize: width < 480 ? 16 : 19,
        fontWeight: '400',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 2,
        // fontFamily: 'Share Tech Mono',
    },

    // ── DECORATIVE FOOTER ──
    panelFooter: {
        marginTop: 25,
        fontSize: width < 480 ? 11 : 13,
        color: theme7Colors.textMuted,
        // fontFamily: 'Share Tech Mono',
    },

    // ── CORNER HUD ORNAMENTS ──
    ornament: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: theme7Colors.holoCyan,
    },
    ornamentTL: { top: -2, left: -2, borderTopWidth: 2, borderLeftWidth: 2 },
    ornamentTR: { top: -2, right: -2, borderTopWidth: 2, borderRightWidth: 2 },
    ornamentBL: { bottom: -2, left: -2, borderBottomWidth: 2, borderLeftWidth: 2 },
    ornamentBR: { bottom: -2, right: -2, borderBottomWidth: 2, borderRightWidth: 2 },
});