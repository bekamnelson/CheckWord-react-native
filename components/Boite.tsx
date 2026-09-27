import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from '../themes/decor';
import Icon from './Icon';
import Ornaments from './Ornaments';

interface BoiteProps {
    visible?: boolean;
    hascompleted?: boolean;
    haswon?: boolean;
    nom?: string;
    word?: string;
    handlereset: () => void;
    styles: any;
    unlockedTheme?: string | null; // nom du thème débloqué (et appliqué) par cette victoire
}

export default function Boite({
    visible = true,
    hascompleted = false,
    haswon = false,
    nom = 'Joueur',
    word = '',
    handlereset,
    styles = {},
    unlockedTheme = null,
}: BoiteProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const unlockStyles = React.useMemo(() => makeUnlockStyles(decor.palette), [decor]);
    const iconColor = hascompleted || haswon ? decor.palette.primary : decor.palette.danger;

    const victoryPlayer = useAudioPlayer(require('./../sound/victory.mp3'));
    const defeatPlayer = useAudioPlayer(require('./../sound/defeat.mp3'));

    useEffect(() => {
        if (!hascompleted && !haswon) {
            try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                defeatPlayer.seekTo(0);
                defeatPlayer.play();
            } catch (e) {}
        } else {
            try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                victoryPlayer.seekTo(0);
                victoryPlayer.play();
            } catch (e) {}
        }
    }, [hascompleted, haswon]);

    const getContent = () => {
        if (haswon && !hascompleted) {
            return {
                annonce: t('boite_victoire'),
                message: t('boite_victoire_msg'),
                etat: t('boite_victoire_btn'),
                showWord: false,
            };
        } else if (!haswon && !hascompleted) {
            return {
                annonce: t('boite_defaite'),
                message: t('boite_defaite_msg'),
                etat: t('boite_defaite_btn'),
                showWord: true,
            };
        } else if (hascompleted && haswon) {
            return {
                annonce: t('boite_fin'),
                message: t('boite_fin_msg', { nom }),
                etat: t('boite_fin_btn'),
                showWord: false,
            };
        } else {
            return {
                annonce: t('boite_mot_trouve'),
                message: t('boite_mot_trouve_msg', { nom }),
                etat: t('boite_mot_trouve_btn'),
                showWord: false,
            };
        }
    };

    const { annonce, message, etat, showWord } = getContent();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.boiteModal}>
                    <Ornaments />
                    <Icon
                        name={hascompleted || haswon ? 'trophy' : 'skull'}
                        size={48}
                        color={iconColor}
                        style={[styles.modalIcon, { color: iconColor }]}
                    />

                    <Text style={styles.modalTitle}>{annonce}</Text>

                    <Text style={styles.modalText}>
                        {message}
                        {showWord && (
                            <>
                                {'\n'}{t('boite_mot_cache')}{'\n'}
                                <Text style={{
                                    color: '#f0c060',
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    letterSpacing: 4,
                                    textShadowColor: 'rgba(240, 192, 96, 0.5)',
                                    textShadowRadius: 10,
                                }}>
                                    {word}
                                </Text>
                            </>
                        )}
                    </Text>

                    {unlockedTheme && (
                        <View style={unlockStyles.box}>
                            <Icon name="palette" size={22} color={decor.palette.primary} />
                            <View style={{ flex: 1 }}>
                                <Text style={unlockStyles.title}>{t('boite_theme_debloque', { name: unlockedTheme })}</Text>
                                <Text style={unlockStyles.text}>{t('boite_theme_applique')}</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.modalActions}>
                        <Pressable style={styles.btnSecondary} onPress={() => router.push('/')}>
                            <Text style={styles.btnSecondaryText}>{t('boite_retour')}</Text>
                        </Pressable>

                        <Pressable style={styles.btnPrimary} onPress={handlereset}>
                            <Text style={styles.btnPrimaryText}>{etat}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const makeUnlockStyles = (p: ThemePalette) => StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        alignSelf: 'stretch',
        backgroundColor: withAlpha(p.primary, 0.12),
        borderWidth: 1,
        borderColor: withAlpha(p.primary, 0.6),
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 14,
    },
    title: {
        color: p.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
    text: {
        color: p.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
});
