import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExitOnDoubleBackPress } from '../../hooks/useExitOnDoubleBackPress';

import { useAudioPlayer } from 'expo-audio'; // 1. Import de expo-audio
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';

// Importation dynamique des thèmes
import { THEMES } from './../../components/themeRegistry';

// Mappage des images de fond / thèmes
const themeImages: Record<number, any> = {
  1: require('./../../image/plan1.png'),
  2: require('./../../image/plan2.png'),
  3: require('./../../image/plan3.png'),
  4: require('./../../image/plan4.png'),
  5: require('./../../image/plan5.png'),
  6: require('./../../image/plan6.png'),
  7: require('./../../image/plan7.png'),
  8: require('./../../image/plan8.png'),
};

interface PlayerInfo {
  level: number;
  selectedTheme: number;
  game_version: string;
}

export default function Acceuil() {
  useExitOnDoubleBackPress();
  const router = useRouter();
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    level: 1,
    selectedTheme: 1,
    game_version: '2.1',
  });

  // 2. Initialisation du lecteur audio pour le clic des boutons
  // (Vérifie que le chemin correspond bien à ton fichier son)
  const clickPlayer = useAudioPlayer(require('./../../sound/start.mp3'));

  // 3. Fonction qui joue le son PUIS navigue vers la page demandée
  const handleNavigation = (path: any) => {
    clickPlayer.seekTo(0);
    clickPlayer.play();
    router.push(path);
  };

  // 🔹 Utilisation de useFocusEffect pour recharger le thème à CHAQUE retour sur cet écran
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

  // 🔹 Récupération dynamique du thème sélectionné (fallback sur le thème 1)
  const activeTheme = THEMES[playerInfo.selectedTheme] || THEMES[1];
  const currentThemeImage = activeTheme.backgroundImage;
  const styles = activeTheme.themeStyles;

  return (
    <View style={styles.container}>
      {/* Musique de fond */}

      {/* Background Image & Overlay */}
      <ImageBackground
        source={currentThemeImage}
        style={styles.heroBg}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />

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
              <Text style={styles.fleurIcon}>⚜</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.titleSub}>Le Défi des Mots Cachés</Text>
          </View>

          {/* MAIN PANEL */}
          <View style={styles.panel}>
            {styles.woodStripes && (
              <View style={styles.woodStripes}>
                {/* On génère 150 petites lignes pour simuler le repeating-linear-gradient */}
                {Array.from({ length: 150 }).map((_, i) => (
                  <View key={i} style={styles.stripeLine} />
                ))}
              </View>
            )}
            {/* Ornements de coins */}
            <View style={[styles.ornament, styles.ornamentTL]} />
            <View style={[styles.ornament, styles.ornamentTR]} />
            <View style={[styles.ornament, styles.ornamentBL]} />
            <View style={[styles.ornament, styles.ornamentBR]} />

            {/* Scène du jeu */}
            <View style={styles.sceneFrame}>
              <Image source={currentThemeImage} style={styles.sceneImage} />
              {styles.sceneOverlay && <View style={styles.sceneOverlay} />}
              {styles.scanline && <View style={styles.scanline} />}
            </View>

            {/* Badge de Niveau */}
            <View style={styles.levelBadge}>
              <Text style={styles.badgeText}>🏆 Niveau </Text>
              <Text style={styles.levelNum}>{playerInfo.level}</Text>
            </View>

            {/* CONTENEUR DES BOUTONS DE NAVIGATION */}
            <View style={{ gap: 15, width: '100%', alignItems: 'center' }}>
              {/* Bouton Solo */}
              <Pressable
                style={({ pressed }) => [
                  styles.btnStart,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleNavigation('/Game')} // 4. Utilisation de la nouvelle fonction
              >
                <Text style={styles.btnText}>⚔️ Solo</Text>
              </Pressable>

              {/* Bouton Multijoueur */}
              <Pressable
                style={({ pressed }) => [
                  styles.btnStart,
                  { backgroundColor: '#8b0000', borderColor: '#ff4444', borderWidth: 1 },
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleNavigation('/Challenge')} // 4. Utilisation de la nouvelle fonction
              >
                <Text style={[styles.btnText, { color: '#ffffff' }]}>👑 Multijoueur</Text>
              </Pressable>

              {/* Bouton Thèmes */}
              <Pressable
                style={({ pressed }) => [
                  styles.btnStart,
                  { backgroundColor: '#004b8b', borderColor: '#44aaff', borderWidth: 1 },
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleNavigation('/Theme')} // 4. Utilisation de la nouvelle fonction
              >
                <Text style={[styles.btnText, { color: '#ffffff' }]}>🎨 Thèmes</Text>
              </Pressable>
            </View>

            <Text style={[styles.panelFooter, { marginTop: 20 }]}>
              « Chaque mot révélé, une victoire de plus »
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}