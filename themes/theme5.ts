import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const theme5Colors = {
    oceanDeep: '#061539',
    oceanMid: '#104b82',
    oceanLight: '#38b6ff',
    coral: '#ff6b4a',
    coralDark: '#cc4629',
    sand: '#e3c19b',
    woodLight: '#8c5a35',
    woodDark: '#4a2c15',
};

export const theme5Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme5Colors.oceanDeep,
    },
    heroBg: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 21, 57, 0.65)',
    },
    pageWrap: {
        flexGrow: 1,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    titleCard: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoEmblem: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.4)',
        backgroundColor: 'rgba(16, 75, 130, 0.75)',
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: theme5Colors.oceanLight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gameTitle: {
        fontSize: width < 480 ? 40 : 60,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: theme5Colors.oceanLight,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    titleSub: {
        fontSize: width < 480 ? 14 : 18,
        fontWeight: '700',
        color: theme5Colors.sand,
        marginTop: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    titleDivider: { display: 'none' },
    dividerLine: {},
    fleurIcon: {},

    // ── MAIN PANEL (Panneau de Bois) ──
    panel: {
        backgroundColor: theme5Colors.woodLight,
        borderWidth: 4,
        borderColor: theme5Colors.woodDark,
        borderRadius: 15,
        paddingVertical: width < 480 ? 30 : 40,
        paddingHorizontal: width < 480 ? 20 : 50,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 12,
    },

    // ── NOUVEAU : RAYURES DU BOIS ──
    woodStripes: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 11, // Légèrement moins que le panel pour ne pas déborder
        overflow: 'hidden',
        flexDirection: 'column',
    },
    stripeLine: {
        height: 2,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.08)', // La ligne sombre
        marginBottom: 2, // L'espace transparent
    },

    sceneFrame: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: theme5Colors.sand,
        marginBottom: 25,
        width: '100%',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 6,
    },
    sceneImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 2,
        borderColor: theme5Colors.sand,
        borderRadius: 30,
        paddingVertical: width < 480 ? 8 : 10,
        paddingHorizontal: width < 480 ? 20 : 25,
        marginBottom: 25,
    },
    badgeText: {
        color: theme5Colors.sand,
        fontSize: width < 480 ? 16 : 20,
        letterSpacing: 1,
    },
    levelNum: {
        fontWeight: '900',
        fontSize: width < 480 ? 18 : 22,
        color: '#fff',
    },
    btnStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme5Colors.coral,
        borderWidth: 2,
        borderColor: '#ffb2a0',
        borderRadius: 40,
        paddingVertical: width < 480 ? 12 : 14,
        paddingHorizontal: width < 480 ? 20 : 40,
        width: '100%',
        maxWidth: 280,
        shadowColor: theme5Colors.coralDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    btnText: {
        fontSize: width < 480 ? 18 : 22,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    panelFooter: {
        marginTop: 25,
        fontSize: width < 480 ? 12 : 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
    },

    // ── CORNER BUBBLES (Bulles d'eau corrigées) ──
    ornament: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        // On garde l'ombre pour iOS qui gère bien la transparence
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        // ❌ SUPPRESSION DE L'ELEVATION POUR ÉVITER LE CARRÉ NOIR SUR ANDROID
        elevation: 0,
    },
    ornamentTL: { top: -10, left: -10, width: 30, height: 30, borderRadius: 15 },
    ornamentTR: { top: -5, right: -10, width: 20, height: 20, borderRadius: 10 },
    ornamentBL: { bottom: -10, left: -5, width: 25, height: 25, borderRadius: 12.5 },
    ornamentBR: { bottom: -5, right: -15, width: 15, height: 15, borderRadius: 7.5 },
});