import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Card from './../../components/Card';
import { THEMES } from './../../components/themeRegistry';

interface PlayerInfo {
    level: number;
    selectedTheme: number;
    game_version: string;
}

const themesList = [
    { id: 1, name: 'fantasy', reqLevel: 1 },
    { id: 2, name: 'SAKURA', reqLevel: 50 },
    { id: 3, name: 'CYBERPUNK', reqLevel: 100 },
    { id: 4, name: 'CANDY', reqLevel: 150 },
    { id: 5, name: 'OCÉAN', reqLevel: 200 },
    { id: 6, name: 'CRÉPUSCULE', reqLevel: 250 },
    { id: 7, name: 'LABO', reqLevel: 300 },
    { id: 8, name: 'RUE', reqLevel: 350 },
];

export default function Theme() {
    const router = useRouter();
    const [player, setPlayer] = useState<PlayerInfo>({
        level: 1,
        selectedTheme: 1,
        game_version: '2.1',
    });

    // Utilisation de useFocusEffect pour s'assurer que le niveau et le thème actif 
    // sont actualisés instantanément dès qu'on arrive sur cette page.
    useFocusEffect(
        useCallback(() => {
            const loadPlayerData = async () => {
                try {
                    const savedPlayer = await AsyncStorage.getItem('player');
                    if (savedPlayer) {
                        setPlayer(JSON.parse(savedPlayer));
                    } else {
                        const initialPlayer: PlayerInfo = {
                            level: 1,
                            selectedTheme: 1,
                            game_version: '2.1',
                        };
                        await AsyncStorage.setItem('player', JSON.stringify(initialPlayer));
                        setPlayer(initialPlayer);
                    }
                } catch (error) {
                    console.error('Erreur de chargement du joueur :', error);
                }
            };
            loadPlayerData();
        }, [])
    );

    const handleClick = async (planId: number, reqLevel: number) => {
        if (player.level >= reqLevel) {
            const newPlayer = { ...player, selectedTheme: planId };
            setPlayer(newPlayer);
            try {
                await AsyncStorage.setItem('player', JSON.stringify(newPlayer));
            } catch (error) {
                console.error('Erreur de sauvegarde :', error);
            }
        } else {
            Alert.alert(
                'Thème Verrouillé',
                `Il faut atteindre le niveau ${reqLevel} pour débloquer ce thème !`
            );
        }
    };

    const activeTheme = THEMES[player.selectedTheme] || THEMES[1];

    return (
        <SafeAreaView style={styles.gameWrap}>
            {/* Background dynamique mis à jour selon le thème sélectionné */}
            <ImageBackground
                source={activeTheme.backgroundImage}
                style={styles.heroBg}
                resizeMode="cover"
            >
                <View style={styles.heroOverlay} />
            </ImageBackground>

            {/* En-tête */}
            <View style={styles.gameHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>⚜ Boutique de Thèmes</Text>
                <View style={styles.levelIndicator}>
                    <Text style={styles.levelIndicatorText}>Niveau : {player.level}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.bigcontainer}>
                    {/* Ornements d'angle */}
                    <View style={[styles.ornament, styles.ornamentTL]} />
                    <View style={[styles.ornament, styles.ornamentTR]} />
                    <View style={[styles.ornament, styles.ornamentBL]} />
                    <View style={[styles.ornament, styles.ornamentBR]} />

                    <Text style={styles.title}>Choisissez votre Décor</Text>
                    <Text style={styles.subtitle}>
                        Un nouveau thème se débloque tous les 50 niveaux !
                    </Text>

                    {/* Grille 2 cartes par ligne */}
                    <View style={styles.themesGrid}>
                        {themesList.map((item) => (
                            <Card
                                key={item.id}
                                reqLevel={item.reqLevel}
                                plan={item.id}
                                isUnlocked={player.level >= item.reqLevel}
                                isSelected={item.id === player.selectedTheme}
                                name={item.name}
                                styles={styles}
                                handleClick={() => handleClick(item.id, item.reqLevel)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    gameWrap: {
        flex: 1,
        backgroundColor: '#121212',
    },
    heroBg: {
        ...StyleSheet.absoluteFillObject,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        zIndex: 10,
    },
    backBtn: {
        padding: 8,
    },
    backBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#f0c040',
        fontSize: 18,
        fontWeight: 'bold',
    },
    levelIndicator: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    levelIndicatorText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
    scrollContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    bigcontainer: {
        width: '94%',
        maxWidth: 800,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        position: 'relative',
    },
    title: {
        color: '#f0c040',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle: {
        color: '#ffffff',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 13,
    },
    ornament: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderColor: '#f0c040',
    },
    ornamentTL: { top: 6, left: 6, borderTopWidth: 2, borderLeftWidth: 2 },
    ornamentTR: { top: 6, right: 6, borderTopWidth: 2, borderRightWidth: 2 },
    ornamentBL: { bottom: 6, left: 6, borderBottomWidth: 2, borderLeftWidth: 2 },
    ornamentBR: { bottom: 6, right: 6, borderBottomWidth: 2, borderRightWidth: 2 },

    // --- Layout 2 cartes par ligne ---
    themesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 14,
        marginTop: 15,
    },
    themeCard: {
        width: '48%',
        aspectRatio: 0.75,
        borderWidth: 2,
        borderColor: '#8b7355',
        borderRadius: 10,
        overflow: 'hidden',
    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    locked: {
        opacity: 0.5,
    },
    selected: {
        borderWidth: 3,
        borderColor: '#00ff00',
        shadowColor: '#00ff00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 8,
    },
    themeName: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: '#ffffff',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 5,
        textAlign: 'center',
        width: '88%',
        fontSize: 12,
        fontWeight: 'bold',
    },
    lockIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
});