import { Dimensions, StyleSheet } from 'react-native';

// On récupère la largeur de l'écran pour rendre le clavier dynamique (7 colonnes)
const { width } = Dimensions.get('window');

export const colors = {
    gold: '#c9933a',
    goldLight: '#f0c060',
    goldDark: '#8a5f1a',
    navy: '#1a2340',
    navyDark: '#0d1520',
    parchment: '#f5e8c8',
    parchmentDark: '#d4c09a',
    redLife: '#c0392b',
    redGlow: 'rgba(192,57,43,0.5)',
    letterBg: 'rgba(245,232,200,0.08)',
};

export const gameTheme1Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.navyDark,
        // Le padding garantit que le contenu ne touchera jamais les bords de l'écran
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.navyDark,
        opacity: 0.8,
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(10,15,30,0.6)',
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
        color: colors.gold,
        fontSize: 14,
        letterSpacing: 1,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.goldLight,
        textShadowColor: 'rgba(201,147,58,0.4)',
        textShadowRadius: 10,
        letterSpacing: 1,
    },
    levelIndicator: {
        padding: 5,
    },
    levelIndicatorText: {
        fontSize: 14,
        color: colors.parchmentDark,
        letterSpacing: 1,
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: 'rgba(26,35,64,0.95)',
        borderColor: colors.goldDark,
        borderWidth: 2,
        borderRadius: 16,
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── ORNAMENTS (Coins dorés) ── */
    ornament: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: colors.goldDark,
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
        borderColor: 'rgba(201,147,58,0.25)',
        borderRadius: 12,
        backgroundColor: 'rgba(201,147,58,0.06)',
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
        color: colors.parchment,
        lineHeight: 22,
    },

    /* ── WORD DISPLAY (Lettres à deviner) ── */
    game: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap', // <-- MODIFICATION 1 : Autorise le passage à la ligne
        gap: 4,
        marginBottom: 30,
        width: '100%',
    },
    letterBox: {
        // <-- MODIFICATION 2 : Calcul dynamique pour 9 lettres max
        // (Largeur écran) - (32px padding gameWrap) - (32px padding bigcontainer) - (32px pour 8 espaces de 4px) / 9
        width: (width - 96) / 8,
        maxWidth: 45, // Optionnel : empêche les cases de devenir géantes sur tablette
        height: 50,
        backgroundColor: colors.letterBg,
        borderWidth: 1,
        borderColor: 'rgba(201,147,58,0.3)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.parchment,
        textTransform: 'uppercase',
    },
    baredeco: {
        position: 'absolute',
        bottom: 4,
        width: '70%',
        height: 2,
        backgroundColor: colors.gold,
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
        borderColor: 'rgba(201,147,58,0.4)',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lifeActive: {
        backgroundColor: colors.redLife,
        borderColor: colors.redLife,
        shadowColor: colors.redGlow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
    heartIcon: {
        fontSize: 12,
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
        // Calcul dynamique pour 7 colonnes parfaites
        width: (width - 32 - 32 - 40) / 7,
        height: 45,
        backgroundColor: 'rgba(245,232,200,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(201,147,58,0.2)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.parchment,
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
        backgroundColor: colors.navy,
        borderColor: colors.goldDark,
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
        color: colors.goldLight,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        color: colors.parchmentDark,
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
        backgroundColor: colors.gold,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 3,
    },
    btnPrimaryText: {
        color: colors.navyDark,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.parchmentDark,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    btnSecondaryText: {
        color: colors.parchmentDark,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});