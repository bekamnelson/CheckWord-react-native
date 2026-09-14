import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// ── PALETTE DE COULEURS (THÈME 8 - URBAIN JAPONAIS) ──
export const theme8Colors = {
    sunGold: '#ffb74d',
    sunDeep: '#e65100',
    concreteDark: '#1e2226',
    concretePanel: 'rgba(38, 44, 51, 0.95)', // Béton du mur d'affichage
    posterGreen: '#385c45',
    posterPaper: '#e8e6e1',
    textLight: '#f5f5f5',
    textMuted: '#9aa0a6',
    metalGrey: '#78909c', // Pour les vis et le cadre du logo
};

// ── STYLES CONVERTIS DEPUIS LE CSS ──
export const theme8Styles = StyleSheet.create({
    // Body Equivalent
    container: {
        flex: 1,
        backgroundColor: theme8Colors.concreteDark,
    },

    // .hero-bg & .hero-overlay
    heroBg: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        // Remplacement du dégradé par une couleur unie sombre (Asphalte)
        backgroundColor: 'rgba(30, 34, 38, 0.8)',
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
        marginBottom: 30,
    },
    logoEmblem: {
        width: 120,
        height: 120,
        borderRadius: 10, // Style panneau métallique
        borderWidth: 3,
        borderColor: theme8Colors.metalGrey,
        backgroundColor: theme8Colors.concreteDark,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gameTitle: {
        fontSize: width < 480 ? 35 : 50,
        fontWeight: '900',
        color: theme8Colors.textLight,
        letterSpacing: 1,
        textAlign: 'center',
        // Lueur dorée asymétrique
        textShadowColor: theme8Colors.sunDeep,
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 15,
        // fontFamily: 'Sawarabi Gothic', // À décommenter si police chargée
    },
    titleSub: {
        fontSize: width < 480 ? 13 : 16,
        fontWeight: '700',
        color: theme8Colors.sunGold,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginTop: 10,
        letterSpacing: 2,
        // Style signalétique urbaine (Bordure gauche uniquement)
        borderLeftWidth: 4,
        borderLeftColor: theme8Colors.sunGold,
        // fontFamily: 'Sawarabi Gothic',
    },
    // On cache le séparateur classique pour ce thème
    titleDivider: {
        display: 'none',
    },
    dividerLine: {},
    fleurIcon: {},

    // ── MAIN PANEL (Mur d'affichage municipal) ──
    panel: {
        backgroundColor: theme8Colors.concretePanel,
        borderWidth: 1,
        borderColor: '#454d55',
        borderTopWidth: 6, // Le toit du local poubelle
        borderTopColor: theme8Colors.posterGreen,
        borderRadius: 4, // Très carré, très urbain
        paddingVertical: width < 480 ? 30 : 40,
        paddingHorizontal: width < 480 ? 20 : 50,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 15,
    },

    // ── SCENE FRAME ──
    sceneFrame: {
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#546e7a',
        marginBottom: 25,
        width: '100%',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.7,
        shadowRadius: 15,
        elevation: 8,
    },
    sceneImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    // ── LEVEL BADGE (Plaque signalétique) ──
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#e0e0e0', // Plaque de métal clair
        borderWidth: 2,
        borderColor: '#9e9e9e',
        borderRadius: 2,
        paddingVertical: width < 480 ? 8 : 10,
        paddingHorizontal: width < 480 ? 20 : 25,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    badgeText: {
        color: '#212121',
        fontSize: width < 480 ? 15 : 17,
        fontWeight: '700',
        letterSpacing: 1,
        // fontFamily: 'Sawarabi Gothic',
    },
    levelNum: {
        fontWeight: '900',
        fontSize: width < 480 ? 18 : 20,
        color: theme8Colors.sunDeep,
        // fontFamily: 'Sawarabi Gothic',
    },

    // ── START BUTTON (Reflet du soleil couchant) ──
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme8Colors.sunDeep, // Remplacement du dégradé par la couleur unie
        borderRadius: 4,
        paddingVertical: width < 480 ? 14 : 15,
        paddingHorizontal: width < 480 ? 20 : 40,
        width: '100%',
        maxWidth: 280,
        shadowColor: theme8Colors.sunDeep,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 6,
    },
    btnText: {
        fontSize: width < 480 ? 16 : 19,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        // fontFamily: 'Sawarabi Gothic',
    },

    // ── DECORATIVE FOOTER ──
    panelFooter: {
        marginTop: 25,
        fontSize: width < 480 ? 12 : 14,
        color: theme8Colors.textMuted,
    },

    // ── CORNER BOLTS (Vis métalliques) ──
    ornament: {
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: theme8Colors.metalGrey,
        borderRadius: 6, // 50% de 12 pour faire un rond parfait
        borderWidth: 0, // On annule les bordures des autres thèmes
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
    },
    ornamentTL: { top: 15, left: 15 },
    ornamentTR: { top: 15, right: 15 },
    ornamentBL: { bottom: 15, left: 15 },
    ornamentBR: { bottom: 15, right: 15 },
});