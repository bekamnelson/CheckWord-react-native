import { Dimensions, StyleSheet } from 'react-native';

// On récupère la largeur de l'écran pour rendre le clavier dynamique (7 colonnes)
const { width } = Dimensions.get('window');

// Palette de couleurs basée sur vos variables CSS (Thème Cyberpunk)
export const colors = {
    neonCyan: '#00f3ff',
    neonPurple: '#b026ff',
    neonPink: '#ff007f',
    darkBg: '#050510',
    panelBg: 'rgba(10, 12, 25, 0.95)',
    textMain: '#e0eaff',
    textMuted: '#6b7b9e',
    redAlert: '#ff003c',
    letterBg: 'rgba(0, 243, 255, 0.05)',
};

export const gameTheme3Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.darkBg,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.darkBg,
        opacity: 0.9,
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(5, 2, 10, 0.7)',
    },

    /* ── HEADER (HUD TOP) ── */
    gameHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 243, 255, 0.3)',
        paddingBottom: 10,
        zIndex: 10,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backBtnText: {
        color: colors.neonCyan,
        fontSize: 14,
        letterSpacing: 1.5,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        // fontFamily: 'Orbitron',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        textShadowColor: colors.neonCyan,
        textShadowRadius: 15,
        letterSpacing: 2,
        textTransform: 'uppercase',
        // fontFamily: 'Orbitron',
    },
    levelIndicator: {
        padding: 5,
    },
    levelIndicatorText: {
        fontSize: 14,
        color: colors.neonPink,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        // fontFamily: 'Orbitron',
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: colors.panelBg,
        borderColor: 'rgba(0, 243, 255, 0.3)',
        borderWidth: 1,
        borderTopWidth: 3,
        borderTopColor: colors.neonCyan,
        borderRadius: 8, // Plus carré pour le style tech
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.9,
        shadowRadius: 20,
        elevation: 10,
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── ORNAMENTS (Tech Corners) ── */
    ornament: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: colors.neonCyan,
    },
    ornamentTL: { top: -3, left: -3, borderTopWidth: 3, borderLeftWidth: 3 },
    ornamentTR: { top: -3, right: -3, borderTopWidth: 3, borderRightWidth: 3 },
    ornamentBL: { bottom: -3, left: -3, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: colors.neonPurple },
    ornamentBR: { bottom: -3, right: -3, borderBottomWidth: 3, borderRightWidth: 3, borderColor: colors.neonPurple },

    /* ── INDICE (DATA LOG) ── */
    description: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderLeftWidth: 4,
        borderLeftColor: colors.neonCyan,
        borderRightWidth: 4,
        borderRightColor: colors.neonPurple,
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    contenuedescription: {
        textAlign: 'center',
        fontSize: 15,
        color: colors.neonCyan,
        lineHeight: 22,
        textTransform: 'uppercase',
        letterSpacing: 1,
        // fontFamily: 'Rajdhani',
    },

    /* ── WORD DISPLAY (DECRYPTION SLOTS) ── */
    game: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 30,
        width: '100%',
    },
    letterBox: {
        width: (width - 96) / 8,
        height: 50,
        flexShrink: 1, // PERMET AUX CASES DE RÉTRÉCIR
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(0, 243, 255, 0.4)',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        textShadowColor: colors.neonCyan,
        textShadowRadius: 10,
        // fontFamily: 'Orbitron',
    },
    baredeco: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        backgroundColor: colors.neonPurple,
        shadowColor: colors.neonPurple,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
    },

    /* ── LIFE BAR (CORE STATUS) ── */
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 30,
    },
    lifeSlot: {
        width: 24,
        height: 8, // Barre plate au lieu d'un cercle
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 60, 0.3)',
        transform: [{ skewX: '-20deg' }], // Inclinaison Cyberpunk
        alignItems: 'center',
        justifyContent: 'center',
    },
    lifeActive: {
        backgroundColor: colors.redAlert,
        borderColor: '#fff',
        shadowColor: colors.redAlert,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    heartIcon: {
        display: 'none', // On cache le coeur pour ce thème (barre d'énergie)
    },

    /* ── KEYBOARD (INPUT TERMINAL) ── */
    keyboardContainer: {
        width: '100%',
        alignItems: 'center',
    },
    keyboardgrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
    },
    keyButton: {
        width: (width - 32 - 32 - 40) / 7,
        height: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(176, 38, 255, 0.4)',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.neonCyan,
        textTransform: 'uppercase',
        // fontFamily: 'Orbitron',
    },

    /* ── MODALS (SYSTEM ALERTS) ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boiteModal: {
        width: '85%',
        backgroundColor: 'rgba(10, 5, 20, 0.95)',
        borderColor: colors.neonCyan,
        borderWidth: 2,
        borderRadius: 0, // Carré parfait
        padding: 30,
        alignItems: 'center',
        elevation: 10,
        shadowColor: colors.neonCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    modalIcon: {
        fontSize: 45,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: colors.neonCyan,
        textShadowColor: colors.neonCyan,
        textShadowRadius: 10,
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
        // fontFamily: 'Orbitron',
    },
    modalText: {
        color: colors.textMain,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 25,
        textAlign: 'center',
        // fontFamily: 'Rajdhani',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    btnPrimary: {
        backgroundColor: 'rgba(0, 243, 255, 0.1)',
        borderWidth: 1,
        borderColor: colors.neonCyan,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    btnPrimaryText: {
        color: colors.neonCyan,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        // fontFamily: 'Orbitron',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.textMuted,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    btnSecondaryText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        // fontFamily: 'Orbitron',
    },
});