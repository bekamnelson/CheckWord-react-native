import { Dimensions, StyleSheet } from 'react-native';

// On récupère la largeur de l'écran pour rendre le clavier dynamique (7 colonnes)
const { width } = Dimensions.get('window');

// Palette de couleurs basée sur vos variables CSS (Thème Sakura)
export const colors = {
    sakuraLight: '#ffd1dc',
    sakuraMain: '#ff8fab',
    sakuraDark: '#d65a7e',
    plumDark: '#2a1625',
    plumPanel: 'rgba(58, 31, 51, 0.95)',
    lanternGlow: '#ffb84d',
    paper: '#fff5f8',
    paperDark: '#e8ccd5',
    redLife: '#e63946',
    redGlow: 'rgba(230, 57, 70, 0.6)',
    letterBg: 'rgba(255, 245, 248, 0.06)',
};

export const gameTheme2Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.plumDark,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.plumDark,
        opacity: 0.8,
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(42, 22, 37, 0.7)',
    },

    /* ── HEADER ── */
    gameHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        zIndex: 10,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backBtnText: {
        color: colors.sakuraMain,
        fontSize: 14,
        letterSpacing: 1,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.sakuraLight,
        textShadowColor: 'rgba(255, 143, 171, 0.6)',
        textShadowRadius: 10,
        letterSpacing: 1,
    },
    levelIndicator: {
        padding: 5,
    },
    levelIndicatorText: {
        fontSize: 14,
        color: colors.paperDark,
        letterSpacing: 1,
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: colors.plumPanel,
        borderColor: colors.sakuraDark,
        borderWidth: 2,
        borderRadius: 16,
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8,
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── ORNAMENTS (Coins Sakura) ── */
    ornament: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: colors.sakuraDark,
        opacity: 0.6,
    },
    ornamentTL: { top: 10, left: 10, borderTopWidth: 2, borderLeftWidth: 2 },
    ornamentTR: { top: 10, right: 10, borderTopWidth: 2, borderRightWidth: 2 },
    ornamentBL: { bottom: 10, left: 10, borderBottomWidth: 2, borderLeftWidth: 2 },
    ornamentBR: { bottom: 10, right: 10, borderBottomWidth: 2, borderRightWidth: 2 },

    /* ── INDICE ── */
    description: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 143, 171, 0.3)',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 143, 171, 0.08)',
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    contenuedescription: {
        textAlign: 'center',
        fontSize: 15,
        fontStyle: 'italic',
        color: colors.paper,
        lineHeight: 22,
    },

    /* ── WORD DISPLAY (Lettres à deviner) ── */
    game: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap', // FORCÉ SUR UNE SEULE LIGNE
        gap: 4, // Espace réduit pour aider les mots longs à tenir
        marginBottom: 30,
        width: '100%',
    },
    letterBox: {
        width: (width - 96) / 8,
        height: 50,
        flexShrink: 1, // PERMET AUX CASES DE RÉTRÉCIR SI LE MOT EST TROP LONG
        backgroundColor: colors.letterBg,
        borderWidth: 1,
        borderColor: 'rgba(255, 143, 171, 0.3)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.paper,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(255, 209, 220, 0.6)',
        textShadowRadius: 8,
    },
    baredeco: {
        position: 'absolute',
        bottom: 4,
        width: '70%',
        height: 2,
        backgroundColor: colors.lanternGlow,
    },

    /* ── LIFE BAR (Vies) ── */
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
    },
    lifeSlot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 143, 171, 0.4)',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lifeActive: {
        backgroundColor: colors.redLife,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        shadowColor: colors.redGlow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
    heartIcon: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.9)',
        marginTop: -1,
    },

    /* ── KEYBOARD (Clavier) ── */
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
        backgroundColor: 'rgba(255, 245, 248, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 143, 171, 0.25)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.paper,
    },

    /* ── MODALS (Boite de fin de partie) ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boiteModal: {
        width: '85%',
        backgroundColor: colors.plumDark,
        borderColor: colors.sakuraDark,
        borderWidth: 2,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
    },
    modalIcon: {
        fontSize: 45,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.sakuraLight,
        textShadowColor: colors.sakuraMain,
        textShadowRadius: 8,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        color: colors.paperDark,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 25,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    btnPrimary: {
        backgroundColor: colors.sakuraMain,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 3,
        shadowColor: 'rgba(255, 143, 171, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    btnPrimaryText: {
        color: colors.plumDark,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    btnSecondary: {
        backgroundColor: 'rgba(255, 245, 248, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 245, 248, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    btnSecondaryText: {
        color: colors.paperDark,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});