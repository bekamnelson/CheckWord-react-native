import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

/**
 * À utiliser UNIQUEMENT sur l'écran racine (ex: l'onglet "Home").
 * Premier appui sur le bouton retour matériel/geste Android : affiche un toast.
 * Second appui dans les `delayMs` millisecondes suivantes : quitte l'application.
 */
export function useExitOnDoubleBackPress(delayMs = 2000) {
    const lastPressRef = useRef<number>(0);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                const now = Date.now();

                if (now - lastPressRef.current < delayMs) {
                    BackHandler.exitApp();
                    return true;
                }

                lastPressRef.current = now;

                if (Platform.OS === 'android') {
                    ToastAndroid.show('Appuyez à nouveau pour quitter', ToastAndroid.SHORT);
                }

                // On intercepte l'événement pour empêcher le comportement par
                // défaut (fermeture immédiate / retour à l'écran précédent).
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [delayMs])
    );
}