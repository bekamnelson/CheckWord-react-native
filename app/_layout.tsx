import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { GameThemeProvider } from '../contexts/GameThemeContext';
import { SoundProvider } from '../contexts/SoundContext';
import '../i18n';
import i18n from '../i18n';
import LanguagePicker from './../components/LanguagePicker';
import Sound from './../components/Sound';
import { ThemeParticles } from './../components/ThemeBackdrop';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [needsLanguage, setNeedsLanguage] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // setBehaviorAsync n'existe plus dans cette version d'expo-navigation-bar :
      // une fois masquée, la barre réapparaît déjà temporairement au glissement.
      NavigationBar.setVisibilityAsync('hidden');
    }

    AsyncStorage.getItem('language')
      .then((lang) => {
        if (lang) i18n.changeLanguage(lang);
        else setNeedsLanguage(true); // Premier lancement : on demande la langue
      })
      .catch(() => setNeedsLanguage(true));
  }, []);

  return (
    <SoundProvider>
      <GameThemeProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        {/* Décor animé du thème, par-dessus tous les écrans (ne capte aucun toucher) */}
        <ThemeParticles />
        <StatusBar hidden />
        <Sound />
        <LanguagePicker visible={needsLanguage} onDone={() => setNeedsLanguage(false)} />
      </ThemeProvider>
      </GameThemeProvider>
    </SoundProvider>
  );
}
