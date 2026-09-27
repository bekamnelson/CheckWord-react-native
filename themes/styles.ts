import { StyleSheet } from 'react-native';

export const themeCardStyles = StyleSheet.create({
    themesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center',
        marginTop: 20,
    },
    themeCard: {
        width: 150,
        height: 200,
        borderWidth: 2,
        borderColor: '#8b7355', // Correspond à var(--gold-dark)
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    bgImage: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    locked: {
        opacity: 0.5, // Équivalent de grayscale(100%) brightness(0.5)
    },
    selected: {
        borderWidth: 4,
        borderColor: '#00ff00',
        // Les ombres sur React Native
        shadowColor: '#00ff00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 10, // Ombre sur Android
    },
    themeName: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#ffffff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        textAlign: 'center',
        width: '90%',
        fontSize: 14,
        fontWeight: 'bold',
    },
    lockIcon: {
        position: 'absolute',
        top: '40%',
        left: '35%',
        fontSize: 40,
    },
});