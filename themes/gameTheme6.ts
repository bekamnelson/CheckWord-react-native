import { Dimensions, StyleSheet } from 'react-native';

// On récupère la largeur de l'écran pour le calcul du clavier (7 colonnes)
const { width } = Dimensions.get('window');

// Palette de couleurs basée sur vos variables CSS (Thème Crépuscule Anime)
export const colors = {
    sunsetGold: '#ffca28',
    sunsetOrange: '#f57c00',
    duskShadow: '#2d241f',
    panelBg: 'rgba(35, 28, 25, 0.95)', // Opacité ajustée pour React Native
    signGreen: '#436644',
    textLight: '#fff8e1',
    textMuted: '#9e8e86',
    letterBg: 'rgba(255, 255, 255, 0.05)',
};

export const gameTheme6Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.duskShadow,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.duskShadow,
        opacity: 0.8,
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(20, 15, 12, 0.8)', // Filtre sombre du crépuscule
    },

    /* ── HEADER ── */
    gameHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderBottomWidth: 2,
        borderBottomColor: colors.sunsetOrange,
        zIndex: 10,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backBtnText: {
        color: colors.sunsetGold,
        fontSize: 14,
        fontWeight: 'bold',
        // fontFamily: 'M PLUS Rounded 1c',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: colors.textLight,
        textShadowColor: colors.sunsetOrange,
        textShadowRadius: 10,
        letterSpacing: 1,
        // fontFamily: 'M PLUS Rounded 1c',
    },
    levelIndicator: {
        padding: 5,
    },
    levelIndicatorText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textMuted,
        // fontFamily: 'M PLUS Rounded 1c',
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: colors.panelBg,
        borderColor: 'rgba(255, 202, 40, 0.2)',
        borderWidth: 1,
        borderTopWidth: 5,
        borderTopColor: colors.signGreen, // Rappel du panneau vert
        borderRadius: 12,
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 8,
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── ORNAMENTS ── */
    // Ce thème n'utilise pas d'ornements aux 4 coins dans votre CSS.
    // On laisse les classes vides pour éviter les erreurs si elles sont appelées dans le composant.
    ornament: { display: 'none' },
    ornamentTL: {}, ornamentTR: {}, ornamentBL: {}, ornamentBR: {},

    /* ── INDICE (Affiche murale japonaise) ── */
    description: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderLeftWidth: 4,
        borderLeftColor: colors.signGreen,
        borderRadius: 4,
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    contenuedescription: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.textLight,
        lineHeight: 22,
        // fontFamily: 'M PLUS Rounded 1c',
    },

    /* ── WORD DISPLAY (Blocs d'asphalte / Ombre) ── */
    game: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 30,
        width: '100%',
    },
    letterBox: {
        width: (width - 96) / 8,
        height: 52,
        flexShrink: 1, // PERMET AUX CASES DE RÉTRÉCIR
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    letterText: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.sunsetGold,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(245, 124, 0, 0.5)',
        textShadowRadius: 10,
        // fontFamily: 'M PLUS Rounded 1c',
    },
    baredeco: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        backgroundColor: colors.sunsetOrange,
        shadowColor: colors.sunsetOrange,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },

    /* ── LIFE BAR (Lumières du crépuscule) ── */
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 30,
    },
    lifeSlot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lifeActive: {
        backgroundColor: colors.sunsetGold,
        borderColor: '#fff',
        shadowColor: colors.sunsetOrange,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 5,
    },
    heartIcon: {
        display: 'none', // On cache le coeur, ce sont des lampadaires allumés
    },

    /* ── KEYBOARD (Pavés de la rue) ── */
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
        // Calcul dynamique pour 7 colonnes parfaites (Gaps de 6px * 6 = 36)
        width: (width - 32 - 32 - 36) / 7,
        height: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textLight,
        textTransform: 'uppercase',
        // fontFamily: 'M PLUS Rounded 1c',
    },

    /* ── MODALS (Fin de partie) ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boiteModal: {
        width: '85%',
        backgroundColor: colors.panelBg,
        borderColor: colors.sunsetOrange,
        borderWidth: 2,
        borderTopWidth: 8,
        borderTopColor: colors.sunsetGold,
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.9,
        shadowRadius: 20,
    },
    modalIcon: {
        fontSize: 50,
        marginBottom: 15,
        textShadowColor: 'rgba(255, 202, 40, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: colors.textLight,
        marginBottom: 10,
        textAlign: 'center',
        // fontFamily: 'M PLUS Rounded 1c',
    },
    modalText: {
        color: colors.textMuted,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 25,
        textAlign: 'center',
        // fontFamily: 'M PLUS Rounded 1c',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    btnPrimary: {
        backgroundColor: colors.sunsetOrange,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 6,
    },
    btnPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        // fontFamily: 'M PLUS Rounded 1c',
    },
    btnSecondary: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 6,
    },
    btnSecondaryText: {
        color: colors.textLight,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        // fontFamily: 'M PLUS Rounded 1c',
    },
});