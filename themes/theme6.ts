import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// ── PALETTE DE COULEURS (THÈME 6 - CRÉPUSCULE ANIME) ──
export const theme6Colors = {
    sunsetGold: '#ffca28',
    sunsetOrange: '#f57c00',
    duskShadow: '#2d241f',
    panelBg: 'rgba(35, 28, 25, 0.9)', // Légèrement plus opaque pour compenser l'absence de backdrop-filter
    signGreen: '#436644',
    textLight: '#fff8e1',
    textMuted: '#bcaaa4',
};

// ── STYLES CONVERTIS DEPUIS LE CSS ──
export const theme6Styles = StyleSheet.create({
    // Body Equivalent
    container: {
        flex: 1,
        backgroundColor: theme6Colors.duskShadow,
    },

    // .hero-bg & .hero-overlay
    heroBg: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFill,
        // Remplacement du dégradé par une couleur unie sombre et chaude
        backgroundColor: 'rgba(45, 36, 31, 0.75)',
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
        borderRadius: 20, // Forme de panneau japonais (carré arrondi)
        borderWidth: 3,
        borderColor: theme6Colors.sunsetGold,
        backgroundColor: theme6Colors.duskShadow,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: theme6Colors.sunsetGold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gameTitle: {
        fontSize: width < 480 ? 35 : 50,
        fontWeight: '900',
        color: theme6Colors.textLight,
        letterSpacing: 1,
        textAlign: 'center',
        // Lueur dorée comme le soleil couchant
        textShadowColor: theme6Colors.sunsetOrange,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        // fontFamily: 'M PLUS Rounded 1c', // À décommenter si police chargée
    },
    titleSub: {
        fontSize: width < 480 ? 13 : 16,
        fontWeight: '700',
        color: theme6Colors.sunsetGold,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 10,
        letterSpacing: 1.5,
        overflow: 'hidden',
    },
    // On cache le séparateur classique pour ce thème
    titleDivider: {
        display: 'none',
    },
    dividerLine: {},
    fleurIcon: {},

    // ── MAIN PANEL (Mur en bois / Panneau d'affichage) ──
    panel: {
        backgroundColor: theme6Colors.panelBg,
        borderWidth: 2,
        borderColor: theme6Colors.sunsetOrange,
        borderTopWidth: 6, // Rappel du toit vert du local poubelle
        borderTopColor: theme6Colors.signGreen,
        borderRadius: 12,
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

    // ── SCENE FRAME ──
    sceneFrame: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 25,
        width: '100%',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 6,
    },
    sceneImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    // ── LEVEL BADGE (Style Panneau de rue) ──
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme6Colors.signGreen,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 5,
        paddingVertical: width < 480 ? 8 : 10,
        paddingHorizontal: width < 480 ? 20 : 25,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 4,
    },
    badgeText: {
        color: theme6Colors.textLight,
        fontSize: width < 480 ? 15 : 17,
        fontWeight: '700',
        letterSpacing: 1,
    },
    levelNum: {
        fontWeight: '700',
        fontSize: width < 480 ? 18 : 20,
        color: theme6Colors.sunsetGold,
    },

    // ── START BUTTON (Lumière de lampadaire) ──
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme6Colors.sunsetOrange, // Remplacement du dégradé par la couleur unie
        borderRadius: 8,
        paddingVertical: width < 480 ? 14 : 15,
        paddingHorizontal: width < 480 ? 20 : 40,
        width: '100%',
        maxWidth: 280,
        shadowColor: theme6Colors.sunsetOrange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 6,
    },
    btnText: {
        fontSize: width < 480 ? 16 : 19,
        fontWeight: '900',
        color: '#3e2723',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        // fontFamily: 'M PLUS Rounded 1c',
    },

    // ── DECORATIVE FOOTER ──
    panelFooter: {
        marginTop: 25,
        fontSize: width < 480 ? 12 : 14,
        color: theme6Colors.textMuted,
    },

    // ── ORNAMENTS (Cachés pour ce thème) ──
    // Dans ton CSS, tu n'as pas stylisé les ornements pour ce thème.
    // On les cache donc pour éviter qu'ils n'apparaissent sous forme de carrés vides.
    ornament: { display: 'none' },
    ornamentTL: {},
    ornamentTR: {},
    ornamentBL: {},
    ornamentBR: {},
});