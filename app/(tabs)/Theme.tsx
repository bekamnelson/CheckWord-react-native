import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Card from './../../components/Card';
import { IconText } from './../../components/Icon';
import Ornaments from './../../components/Ornaments';
import ThemeBackdrop from './../../components/ThemeBackdrop';
import { THEME_UNLOCKS } from './../../components/themeRegistry';
import { useGameTheme } from './../../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from './../../themes/decor';

interface PlayerInfo {
    level: number;
    selectedTheme: number;
    game_version: string;
}

const themesList = THEME_UNLOCKS;

export default function Theme() {
    const router = useRouter();
    const { t } = useTranslation();
    const { themeId, decor, setThemeId } = useGameTheme();
    const pal = decor.palette;
    const styles = useMemo(() => makeStyles(pal), [pal]);
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
            // Appliqué instantanément à toute l'application (contexte partagé)
            await setThemeId(planId);
        } else {
            Alert.alert(
                t('theme_verrouille_titre'),
                t('theme_verrouille_msg', { reqLevel })
            );
        }
    };

    return (
        <SafeAreaView style={styles.gameWrap}>
            <ThemeBackdrop />

            {/* En-tête */}
            <View style={styles.gameHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <IconText icon="arrow-left" textStyle={styles.backBtnText}>{t('retour')}</IconText>
                </TouchableOpacity>
                <IconText icon="palette" textStyle={styles.headerTitle}>{t('theme_titre')}</IconText>
                <View style={styles.levelIndicator}>
                    <Text style={styles.levelIndicatorText}>{t('theme_niveau', { level: player.level })}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.bigcontainer}>
                    <Ornaments />

                    <Text style={styles.title}>{t('theme_choisir')}</Text>
                    <Text style={styles.subtitle}>{t('theme_deblocage')}</Text>

                    {/* Grille 2 cartes par ligne */}
                    <View style={styles.themesGrid}>
                        {themesList.map((item) => (
                            <Card
                                key={item.id}
                                reqLevel={item.reqLevel}
                                plan={item.id}
                                isUnlocked={player.level >= item.reqLevel}
                                isSelected={item.id === themeId}
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

// Styles calculés à partir de la palette du thème actif
const makeStyles = (p: ThemePalette) => StyleSheet.create({
    gameWrap: {
        flex: 1,
        backgroundColor: p.bg,
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
        color: p.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: p.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    levelIndicator: {
        backgroundColor: withAlpha(p.primary, 0.12),
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    levelIndicatorText: {
        color: p.text,
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
        backgroundColor: p.panel,
        position: 'relative',
    },
    title: {
        color: p.primary,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle: {
        color: p.text,
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 13,
    },

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
        borderColor: p.panelBorder,
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
        borderColor: p.success,
        shadowColor: p.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 8,
    },
    themeName: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#ffffff', // bandeau toujours sombre : texte toujours blanc
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