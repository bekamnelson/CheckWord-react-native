import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// ── PALETTE DE COULEURS (THÈME 4 - CANDY) ──
export const theme4Colors = {
    candyPink: '#ff6b9e',
    candyLight: '#ffb6c1',
    frosting: '#fff5f8',
    chocolate: '#5c3a21',
    chocoDark: '#3a2211',
    blueberry: '#4db8ff',
    lemon: '#ffcf40',
    textMain: '#5c3a21',
};

// ── STYLES CONVERTIS DEPUIS LE CSS ──
export const theme4Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme4Colors.candyLight,
    },
    heroBg: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(255, 107, 158, 0.35)',
    },
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
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 8,
        borderColor: theme4Colors.frosting,
        backgroundColor: theme4Colors.candyPink,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: theme4Colors.candyPink,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8, // Réduit pour éviter les bugs graphiques
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gameTitle: {
        fontSize: width < 480 ? 40 : 65,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 1,
        textAlign: 'center',
        textShadowColor: theme4Colors.candyPink,
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 1,
        transform: [{ rotate: '-2deg' }],
    },
    titleSub: {
        fontSize: width < 480 ? 14 : 18,
        fontWeight: '800',
        color: theme4Colors.chocolate,
        backgroundColor: theme4Colors.frosting,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
        // ❌ SUPPRESSION de overflow: 'hidden' et elevation qui cachaient le texte sous un carré noir sur Android
        elevation: 0,
    },
    titleDivider: {
        display: 'none',
    },
    dividerLine: {},
    fleurIcon: {},

    // ── MAIN PANEL (Plaque de Chocolat / Biscuit) ──
    panel: {
        backgroundColor: theme4Colors.frosting,
        borderWidth: 6,
        borderColor: theme4Colors.candyPink,
        borderRadius: 40,
        paddingVertical: width < 480 ? 30 : 40,
        paddingHorizontal: width < 480 ? 20 : 50,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        position: 'relative',
        shadowColor: theme4Colors.chocolate,
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },

    // ── SCENE FRAME ──
    sceneFrame: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: theme4Colors.chocolate,
        marginBottom: 25,
        width: '100%',
        position: 'relative',
        shadowColor: theme4Colors.chocolate,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    sceneImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    // ── LEVEL BADGE (Style Pastille) ──
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme4Colors.lemon,
        borderWidth: 3,
        borderColor: theme4Colors.chocolate,
        borderRadius: 50,
        paddingVertical: width < 480 ? 8 : 10,
        paddingHorizontal: width < 480 ? 20 : 25,
        marginBottom: 25,
        shadowColor: theme4Colors.chocolate,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2, // Réduit pour éviter le carré noir
    },
    badgeText: {
        color: theme4Colors.chocolate,
        fontSize: width < 480 ? 16 : 20,
        letterSpacing: 1,
    },
    levelNum: {
        fontWeight: '900',
        fontSize: width < 480 ? 18 : 22,
        color: theme4Colors.candyPink,
    },

    // ── START BUTTON (Style Jelly Bean / Bonbon brillant) ──
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme4Colors.candyPink,
        borderWidth: 4,
        borderColor: theme4Colors.frosting,
        borderRadius: 50,
        paddingVertical: width < 480 ? 14 : 16,
        paddingHorizontal: width < 480 ? 30 : 40,
        width: '100%',
        maxWidth: 280,
        shadowColor: theme4Colors.chocoDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4, // Réduit pour éviter le carré noir
    },
    btnText: {
        fontSize: width < 480 ? 18 : 22,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'uppercase',
    },

    // ── DECORATIVE FOOTER ──
    panelFooter: {
        marginTop: 25,
        fontSize: width < 480 ? 13 : 15,
        fontWeight: '700',
        color: theme4Colors.candyPink,
    },

    // ── CORNER SPRINKLES (Confettis) ──
    ornament: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 0,
        // ❌ SUPPRESSION de l'ombre sur Android pour garantir qu'ils restent ronds
        elevation: 0,
    },
    ornamentTL: { top: 15, left: 15, backgroundColor: theme4Colors.blueberry },
    ornamentTR: { top: 15, right: 15, backgroundColor: theme4Colors.lemon },
    ornamentBL: { bottom: 15, left: 15, backgroundColor: theme4Colors.candyPink },
    ornamentBR: { bottom: 15, right: 15, backgroundColor: theme4Colors.blueberry },
});