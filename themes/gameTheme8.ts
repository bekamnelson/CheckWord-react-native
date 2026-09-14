import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
    sunGold: '#ffb74d',
    sunDeep: '#e65100',
    concreteDark: '#1e2226',
    concretePanel: 'rgba(38, 44, 51, 0.95)',
    posterGreen: '#385c45',
    posterPaper: '#f4f1ea',
    textLight: '#f5f5f5',
    textMuted: '#9aa0a6',
    redBin: '#d32f2f',
    letterBg: 'rgba(255, 255, 255, 0.05)',
};

export const gameTheme8Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.concreteDark,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.concreteDark,
        opacity: 0.6, // Assombrit l'image de fond
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(30, 34, 38, 0.85)', // Ombre urbaine
    },

    /* ── HEADER ── */
    gameHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: colors.sunGold, // Rappel urbain doré
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backBtnText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.textLight,
        letterSpacing: 1,
    },
    levelIndicator: {
        backgroundColor: 'rgba(255, 183, 77, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4,
    },
    levelIndicatorText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.sunGold,
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: colors.concretePanel,
        borderColor: '#454d55',
        borderWidth: 1,
        borderTopWidth: 6,
        borderTopColor: colors.posterGreen,
        borderRadius: 4,
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

    /* ── ORNAMENTS (Désactivés pour ce thème) ── */
    ornament: {
        display: 'none', // Pas de coins dorés dans le thème urbain
    },
    ornamentTL: {}, ornamentTR: {}, ornamentBL: {}, ornamentBR: {},

    /* ── INDICE (Affiche municipale en papier) ── */
    description: {
        width: '100%',
        backgroundColor: colors.posterPaper,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 2,
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 20,
        marginBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    contenuedescription: {
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '600',
        color: '#333', // Texte sombre sur papier clair
        lineHeight: 24,
    },

    /* ── WORD DISPLAY (Blocs d'Asphalte Mouillé) ── */
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
        height: 55,
        flexShrink: 1,
        backgroundColor: '#1e2226', // Noir asphalte
        borderColor: '#454d55',
        borderWidth: 1,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    letterText: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.textLight,
        textTransform: 'uppercase',
    },
    baredeco: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 4,
        backgroundColor: colors.sunGold, // Reflet du soleil couchant
        shadowColor: colors.sunGold,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 3,
    },

    /* ── LIFE BAR (Lumières Rouges style poubelle) ── */
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 30,
    },
    lifeSlot: {
        width: 16,
        height: 16,
        borderRadius: 2, // Carré
        backgroundColor: '#333',
        borderColor: '#555',
        borderWidth: 1,
    },
    lifeActive: {
        backgroundColor: colors.redBin,
        borderColor: '#ff5252',
        shadowColor: colors.redBin,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    heartIcon: {
        display: 'none', // On cache le cœur pour garder l'aspect "voyant lumineux"
    },

    /* ── KEYBOARD (Pavés urbains 3D) ── */
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
        backgroundColor: '#2a3036',
        borderColor: '#454d55',
        borderWidth: 1,
        borderBottomWidth: 4, // Crée l'effet 3D de la touche physique
        borderBottomColor: '#15181b',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textLight,
        textTransform: 'uppercase',
    },

    /* ── MODALS (Affiches d'Alerte) ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boiteModal: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: colors.posterPaper, // Fond papier clair
        borderColor: '#ccc',
        borderWidth: 2,
        borderTopWidth: 10,
        borderTopColor: colors.redBin, // Grosse barre rouge en haut
        borderRadius: 2,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.9,
        shadowRadius: 30,
        elevation: 15,
    },
    modalIcon: {
        fontSize: 45,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#212121',
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    modalText: {
        color: '#424242',
        fontSize: 16,
        fontWeight: '600',
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
        backgroundColor: '#212121',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 2,
    },
    btnPrimaryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    btnSecondary: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 2,
    },
    btnSecondaryText: {
        color: '#424242',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});