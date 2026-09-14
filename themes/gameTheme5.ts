import { Dimensions, StyleSheet } from 'react-native';

// On récupère la largeur de l'écran pour le calcul du clavier
const { width } = Dimensions.get('window');

export const colors = {
    oceanDeep: '#061539',
    oceanMid: '#104b82',
    oceanLight: '#38b6ff',
    coral: '#ff6b4a',
    sand: '#e3c19b',
    woodLight: '#8c5a35',
    woodDark: '#4a2c15',
    glassBg: 'rgba(6, 21, 57, 0.75)',
};

export const gameTheme5Styles = StyleSheet.create({
    /* ── LAYOUT & BACKGROUNDS ── */
    gameWrap: {
        flex: 1,
        backgroundColor: colors.oceanDeep,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heroBg: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.oceanDeep,
        opacity: 0.8,
    },
    heroOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(6, 21, 57, 0.6)',
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
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        zIndex: 10,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backBtnText: {
        color: colors.oceanLight,
        fontSize: 16,
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        textShadowColor: colors.oceanLight,
        textShadowRadius: 10,
        letterSpacing: 1,
    },
    levelIndicator: {
        padding: 5,
    },
    levelIndicatorText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.sand,
        textTransform: 'uppercase',
    },

    /* ── MAIN PANEL (.bigcontainer) ── */
    bigcontainer: {
        width: '100%',
        backgroundColor: colors.glassBg,
        borderColor: 'rgba(56, 182, 255, 0.4)',
        borderWidth: 2,
        borderRadius: 30,
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 30,
        // On garde l'ombre mais on s'assure que le contenu interne ne déborde pas
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 8,
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── ORNAMENTS (Petites Bulles) - CORRIGÉ ── */
    // Les positions sont maintenant positives pour rester à l'intérieur du cadre
    ornament: {
        position: 'absolute',
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderColor: 'rgba(255,255,255,0.4)',
        borderWidth: 1,
        zIndex: 0,
    },
    ornamentTL: { top: 6, left: 6, width: 22, height: 22 },
    ornamentTR: { top: 8, right: 8, width: 14, height: 14 },
    ornamentBL: { bottom: 8, left: 8, width: 18, height: 18 },
    ornamentBR: { bottom: 6, right: 6, width: 26, height: 26 },

    /* ── INDICE (Panneau de bois) ── */
    description: {
        width: '100%',
        backgroundColor: colors.woodLight,
        borderWidth: 3,
        borderColor: colors.woodDark,
        borderRadius: 8,
        paddingTop: 25,
        paddingHorizontal: 16,
        paddingBottom: 20,
        marginBottom: 30,
        alignItems: 'center',
        elevation: 5,
        zIndex: 1, // S'assure qu'il passe au dessus des bulles si besoin
    },
    contenuedescription: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 22,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },

    /* ── WORD DISPLAY (Lettres) ── */
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
        flexShrink: 1,
        backgroundColor: 'rgba(56, 182, 255, 0.15)',
        borderWidth: 2,
        borderColor: 'rgba(56, 182, 255, 0.5)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    letterText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        textShadowColor: colors.oceanLight,
        textShadowRadius: 8,
    },
    baredeco: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 4,
        backgroundColor: colors.oceanLight,
    },

    /* ── LIFE BAR (Bulles d'oxygène) ── */
    lifebar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 30,
    },
    lifeSlot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lifeActive: {
        backgroundColor: colors.coral,
        borderColor: '#fff',
        shadowColor: colors.coral,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
    heartIcon: {
        display: 'none',
    },

    /* ── KEYBOARD (Clavier sur 7 colonnes) ── */
    keyboardContainer: {
        width: '100%',
        alignItems: 'center',
    },
    keyboardgrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6, // Espace entre les touches
    },
    keyButton: {
        // Calcul pour 7 colonnes : (Largeur écran - paddings globaux - 6 espaces de 6px) / 7
        width: (width - 32 - 32 - 36) / 7,
        height: 45,
        backgroundColor: 'rgba(227, 193, 155, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(227, 193, 155, 0.4)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.sand,
        textTransform: 'uppercase',
    },

    /* ── MODALS (Coffre) ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boiteModal: {
        width: '85%',
        backgroundColor: colors.woodLight,
        borderColor: colors.woodDark,
        borderWidth: 4,
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
    },
    modalIcon: {
        fontSize: 50,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.sand,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
        marginBottom: 25,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    btnPrimary: {
        backgroundColor: colors.coral,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        borderBottomWidth: 4,
        borderBottomColor: '#cc4629',
    },
    btnPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    btnSecondary: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 2,
        borderColor: colors.sand,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
    },
    btnSecondaryText: {
        color: colors.sand,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});