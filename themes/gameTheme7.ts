import { Dimensions, StyleSheet } from 'react-native';

// On récupère la largeur de l'écran pour rendre le clavier dynamique (7 colonnes)
const { width } = Dimensions.get('window');

export const colors = {
    holoCyan: '#00e5ff',
    holoBlue: '#0051ff',
    labDark: '#020813',
    glassBg: 'rgba(6, 15, 30, 0.85)',
    textMain: '#e0f7fa',
    textMuted: '#80deea',
    alertRed: '#ff1744',
    letterBg: 'rgba(0, 229, 255, 0.05)',
};

export const gameTheme7Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.labDark,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.labDark,
        opacity: 0.5, // Assombrit l'image de fond
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(2, 8, 19, 0.85)', // Simule le gradient radial sombre
    },

    /* ── HEADER (HUD Top Bar) ── */
    gameHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 229, 255, 0.05)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.holoCyan,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backBtnText: {
        color: colors.holoCyan,
        fontSize: 14,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'monospace',
        color: '#fff',
        letterSpacing: 2,
        textShadowColor: colors.holoBlue,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    levelIndicator: {
        padding: 5,
    },
    levelIndicatorText: {
        fontSize: 14,
        color: colors.textMuted,
        fontFamily: 'monospace',
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: colors.glassBg,
        borderColor: 'rgba(0, 229, 255, 0.3)',
        borderWidth: 1,
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 30,
        // Effet de lueur (Glow)
        shadowColor: colors.holoBlue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── ORNAMENTS (Coins HUD) ── */
    ornament: {
        position: 'absolute',
        width: 15,
        height: 15,
        borderColor: colors.holoCyan,
    },
    ornamentTL: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
    ornamentTR: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
    ornamentBL: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
    ornamentBR: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },

    /* ── INDICE (Console Data) ── */
    description: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderLeftWidth: 3,
        borderLeftColor: colors.holoCyan,
        paddingTop: 15,
        paddingHorizontal: 20,
        paddingBottom: 15,
        marginBottom: 28,
    },
    contenuedescription: {
        textAlign: 'left',
        fontSize: 15,
        fontFamily: 'monospace',
        color: '#fff',
        lineHeight: 22,
    },

    /* ── WORD DISPLAY (Composant Letter) ── */
    game: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 35,
        width: '100%',
    },
    letterBox: {
        width: (width - 96) / 9,
        height: 50,
        flexShrink: 1,
        backgroundColor: 'rgba(0, 81, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    letterText: {
        fontSize: 22,
        fontFamily: 'monospace',
        color: '#fff',
        textTransform: 'uppercase',
        textShadowColor: colors.holoCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    baredeco: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 2,
        backgroundColor: colors.holoCyan,
        shadowColor: colors.holoCyan,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 3,
    },

    /* ── LIFE BAR (Composant Life - Cellules d'Énergie) ── */
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
    },
    lifeSlot: {
        width: 20,
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        transform: [{ skewX: '-15deg' }], // Inclinaison Tech
    },
    lifeActive: {
        backgroundColor: colors.holoCyan,
        borderColor: '#fff',
        shadowColor: colors.holoCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    heartIcon: {
        display: 'none', // On cache le cœur pour faire un effet "Batterie"
    },

    /* ── KEYBOARD (Composant Keyboard - Terminal Tactile) ── */
    keyboardContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
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
        backgroundColor: colors.letterBg,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 16,
        fontFamily: 'monospace',
        color: colors.holoCyan,
        textTransform: 'uppercase',
    },

    /* ── MODALS (Composant Boite - Alerte Système) ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boiteModal: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgba(2, 8, 19, 0.95)',
        borderColor: colors.holoCyan,
        borderWidth: 1,
        borderTopWidth: 4,
        padding: 30,
        alignItems: 'center',
        shadowColor: colors.holoCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    modalIcon: {
        fontSize: 45,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'monospace',
        color: colors.holoCyan,
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    modalText: {
        color: colors.textMain,
        fontSize: 16,
        marginBottom: 25,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    btnPrimary: {
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderWidth: 1,
        borderColor: colors.holoCyan,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btnPrimaryText: {
        color: colors.holoCyan,
        fontSize: 14,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.textMuted,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btnSecondaryText: {
        color: colors.textMuted,
        fontSize: 14,
        fontFamily: 'monospace',
        textTransform: 'uppercase',
    },
});