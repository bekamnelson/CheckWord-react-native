import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExitOnDoubleBackPress } from '../../hooks/useExitOnDoubleBackPress';

import { useAudioPlayer } from 'expo-audio';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next'; // 🆕 1. Import de l'outil de traduction
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Icon, { IconText } from './../../components/Icon';
import Ornaments from './../../components/Ornaments';
import { ThemeParticles } from './../../components/ThemeBackdrop';
import { useGameTheme } from './../../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from './../../themes/decor';

interface PlayerInfo {
  level: number;
  selectedTheme: number;
  game_version: string;
}

export default function Acceuil() {
  useExitOnDoubleBackPress();
  const router = useRouter();

  // 🆕 2. Initialisation de la fonction de traduction "t"
  const { t } = useTranslation();
  const { theme: activeTheme, decor } = useGameTheme();
  const pal = decor.palette;
  const ui = useMemo(() => makeUi(pal), [pal]);

  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    level: 1,
    selectedTheme: 1,
    game_version: '2.1',
  });

  const clickPlayer = useAudioPlayer(require('./../../sound/start.mp3'));

  const handleNavigation = (path: any) => {
    clickPlayer.seekTo(0);
    clickPlayer.play();
    router.push(path);
  };

  useFocusEffect(
    useCallback(() => {
      const loadPlayerData = async () => {
        try {
          const savedPlayer = await AsyncStorage.getItem('player');
          if (savedPlayer) {
            setPlayerInfo(JSON.parse(savedPlayer));
          }
        } catch (error) {
          console.error('Erreur de chargement du joueur:', error);
        }
      };
      loadPlayerData();
    }, [])
  );

  const currentThemeImage = activeTheme.backgroundImage;
  const styles = activeTheme.themeStyles;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={currentThemeImage}
        style={styles.heroBg}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />
        <ThemeParticles layer="back" />

        {/* BOUTON AIDE (COMMENT JOUER) */}
        <Pressable
          style={({ pressed }) => [
            universalStyles.settingsBtn,
            universalStyles.infoBtn,
            ui.roundBtn,
            pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
          ]}
          onPress={() => handleNavigation('/HowToPlay')}
          accessibilityLabel={t('aide_titre')}
        >
          <Icon name="info" size={20} color={pal.primary} />
        </Pressable>

        {/* BOUTON PARAMÈTRES (ENGRENAGE) */}
        <Pressable
          style={({ pressed }) => [
            universalStyles.settingsBtn,
            ui.roundBtn,
            pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
          ]}
          onPress={() => handleNavigation('/Settings')}
        >
          <Icon name="gear" size={22} color={pal.primary} />
        </Pressable>

        <ScrollView contentContainerStyle={styles.pageWrap}>
          {/* TITLE CARD */}
          <View style={styles.titleCard}>
            <View style={styles.logoEmblem}>
              <Image
                source={require('./../../image/logo.png')}
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.gameTitle}>CheckWord</Text>

            <View style={styles.titleDivider}>
              <View style={styles.dividerLine} />
              <Icon name={decor.icons.title} size={16} style={styles.fleurIcon} />
              <View style={styles.dividerLine} />
            </View>

            {/* 🆕 3. Utilisation de la traduction pour le sous-titre */}
            <Text style={styles.titleSub}>{t('sous_titre')}</Text>
          </View>

          {/* MAIN PANEL */}
          <View style={styles.panel}>
            {styles.woodStripes && (
              <View style={styles.woodStripes}>
                {Array.from({ length: 150 }).map((_, i) => (
                  <View key={i} style={styles.stripeLine} />
                ))}
              </View>
            )}

            <Ornaments size={18} inset={8} />

            <View style={styles.sceneFrame}>
              <Image source={currentThemeImage} style={styles.sceneImage} />
              {styles.sceneOverlay && <View style={styles.sceneOverlay} />}
              {styles.scanline && <View style={styles.scanline} />}
            </View>

            <View style={styles.levelBadge}>
              {/* 🆕 Traduction du mot Niveau */}
              <IconText icon="trophy" textStyle={styles.badgeText} gap={6}>{t('niveau')} </IconText>
              <Text style={styles.levelNum}>{playerInfo.level}</Text>
            </View>

            <View style={{ gap: 15, width: '100%', alignItems: 'center' }}>

              {/* 🆕 Traduction Bouton Solo */}
              <Pressable
                style={({ pressed }) => [
                  styles.btnStart,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleNavigation('/Game')}
              >
                <IconText icon="chess-knight" textStyle={styles.btnText}>{t('bouton_solo')}</IconText>
              </Pressable>

              {/* Mode survie (contre la montre) + accès direct au classement */}
              <View style={{ flexDirection: 'row', gap: 10, width: '100%', maxWidth: 280 }}>
                <Pressable
                  style={({ pressed }) => [
                    styles.btnStart,
                    ui.altBtn(pal.success),
                    { flex: 1, width: 'auto', paddingHorizontal: 12 },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => handleNavigation('/Survival')}
                >
                  <IconText icon="stopwatch" iconColor={pal.success} textStyle={[styles.btnText, ui.altText]}>{t('bouton_survie')}</IconText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.btnStart,
                    ui.altBtn(pal.primary),
                    { width: 64, paddingHorizontal: 0 },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => handleNavigation('/Leaderboard')}
                  accessibilityLabel={t('bouton_classement')}
                >
                  <Icon name="ranking-star" size={20} color={pal.primary} />
                </Pressable>
              </View>

              {/* 🆕 Traduction Bouton Multijoueur */}
              <Pressable
                style={({ pressed }) => [
                  styles.btnStart,
                  ui.altBtn(pal.accent),
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleNavigation('/Challenge')}
              >
                <IconText icon="crown" iconColor={pal.accent} textStyle={[styles.btnText, ui.altText]}>{t('bouton_multi')}</IconText>
              </Pressable>

              {/* 🆕 Traduction Bouton Thèmes */}
              <Pressable
                style={({ pressed }) => [
                  styles.btnStart,
                  ui.altBtn(pal.primary),
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleNavigation('/Theme')}
              >
                <IconText icon="palette" iconColor={pal.primary} textStyle={[styles.btnText, ui.altText]}>{t('bouton_themes')}</IconText>
              </Pressable>
            </View>

            {/* 🆕 Traduction de la citation en bas */}
            <Text style={[styles.panelFooter, { marginTop: 20 }]}>
              {t('citation')}
            </Text>

          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const universalStyles = StyleSheet.create({
  settingsBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  // Même bouton rond que les paramètres, mais en haut à gauche
  infoBtn: {
    right: undefined,
    left: 20,
  },
});
// Boutons secondaires et boutons ronds, aux couleurs du thème actif
const makeUi = (p: ThemePalette) => ({
  roundBtn: {
    backgroundColor: withAlpha(p.bg, 0.7),
    borderColor: p.panelBorder,
  },
  altBtn: (color: string) => ({
    backgroundColor: p.panel,
    borderColor: color,
    borderWidth: 1.5,
    shadowColor: color,
  }),
  altText: {
    color: p.text,
  },
});
