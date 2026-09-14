import { Dimensions, StyleSheet } from 'react-native';

// On récupère la largeur de l'écran pour rendre le clavier dynamique
const { width } = Dimensions.get('window');

export const colors = {
    candyPink: '#ff6b9e',
    candyLight: '#ffb6c1',
    frosting: '#fff9fa',
    chocolate: '#5c3a21',
    chocoDark: '#3a2211',
    blueberry: '#4db8ff',
    lemon: '#ffcf40',
    redCherry: '#ff3366',
    textMain: '#5c3a21',
};

export const gameTheme4Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.candyLight,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.candyLight,
        opacity: 0.85,
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(255, 107, 158, 0.4)', // Simule le radial-gradient rose/blanc
    },

    /* ── HEADER (Panneau de direction) ── */
    gameHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: colors.chocolate,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backBtnText: {
        color: colors.lemon,
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: colors.frosting,
        textShadowColor: colors.candyPink,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        letterSpacing: 1,
    },
    levelIndicator: {
        backgroundColor: colors.frosting,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    levelIndicatorText: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.blueberry,
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: colors.frosting,
        borderColor: colors.candyPink,
        borderWidth: 6,
        borderRadius: 35,
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 30,
        shadowColor: colors.chocolate,
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 10,
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── ORNAMENTS (Confettis) ── */
    ornament: {
        position: 'absolute',
        width: 18,
        height: 18,
        borderRadius: 9, // Cercle parfait
    },
    ornamentTL: { top: 12, left: 12, backgroundColor: colors.blueberry },
    ornamentTR: { top: 12, right: 12, backgroundColor: colors.lemon },
    ornamentBL: { bottom: 12, left: 12, backgroundColor: colors.candyPink },
    ornamentBR: { bottom: 12, right: 12, backgroundColor: colors.blueberry },

    /* ── INDICE (Emballage Bonbon) ── */
    description: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: colors.candyPink,
        borderStyle: 'dashed', // Bordure en pointillés
        borderRadius: 20,
        paddingTop: 25,
        paddingHorizontal: 16,
        paddingBottom: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    contenuedescription: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.chocolate,
        lineHeight: 22,
    },

    /* ── WORD DISPLAY (Cubes de Marshmallow) ── */
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
        width: (width - 96) / 8,
        height: 55,
        flexShrink: 1,
        backgroundColor: '#fff',
        borderColor: colors.chocolate,
        borderWidth: 3,
        borderBottomWidth: 7, // Crée l'effet 3D (box-shadow: 0 4px 0)
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    letterText: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.candyPink,
        textTransform: 'uppercase',
        marginBottom: 2, // Compense visuellement le borderBottom plus épais
    },
    baredeco: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 6,
        backgroundColor: colors.blueberry,
    },

    /* ── LIFE BAR (Cerises / Bonbons) ── */
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 30,
    },
    lifeSlot: {
        width: 25,
        height: 25,
        borderRadius: 12.5, // Cercle parfait
        backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    lifeActive: {
        backgroundColor: colors.redCherry,
        borderColor: colors.redCherry,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    heartIcon: {
        display: 'none', // On cache le coeur, la forme ronde et rouge suffit pour faire "bonbon"
    },

    /* ── KEYBOARD (Pastilles de chocolat) ── */
    keyboardContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    keyboardgrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6, // Gap de 6px pour laisser respirer les touches
    },
    keyButton: {
        // Calcul ultra-précis pour 7 colonnes :
        // width (largeur écran) - 64 (paddings totaux) - 36 (6 espaces de 6px)
        // On utilise Math.floor pour éviter les bugs d'arrondi des pixels
        width: Math.floor((width - 64 - 36) / 7),
        height: 48,
        backgroundColor: colors.chocolate,
        borderRadius: 10,
        borderBottomWidth: 4, // Effet 3D bouton
        borderBottomColor: colors.chocoDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 18,
        fontWeight: '900',
        color: colors.frosting,
        textTransform: 'uppercase',
    },

    /* ── MODALS (Boite de Pâtisserie) ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boiteModal: {
        width: '90%',
        maxWidth: 420,
        backgroundColor: colors.frosting,
        borderColor: colors.candyPink,
        borderWidth: 8,
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    modalIcon: {
        fontSize: 50,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: colors.chocolate,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        color: colors.candyPink,
        fontSize: 18,
        fontWeight: 'bold',
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
        backgroundColor: colors.candyPink,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        borderBottomWidth: 5, // Effet 3D
        borderBottomColor: colors.chocoDark,
    },
    btnPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    btnSecondary: {
        backgroundColor: colors.lemon,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        borderBottomWidth: 5, // Effet 3D
        borderBottomColor: colors.chocoDark,
    },
    btnSecondaryText: {
        color: colors.chocolate,
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
});