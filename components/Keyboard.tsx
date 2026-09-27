import { useAudioPlayer } from 'expo-audio';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

interface KeyboardProps {
    onLetterClick: (letter: string) => void;
    styles: any;
}

// Disposition des touches par langue : les lettres propres à une langue
// (Ñ en espagnol, Ä Ö Ü en allemand) n'apparaissent que pour cette langue
const LAYOUTS: Record<string, string[]> = {
    fr: 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split(''),
    en: 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split(''),
    es: 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split(''),
    de: 'QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM'.split(''),
};

// 6 touches par ligne, assez grandes pour ne pas appuyer à côté
const KEYS_PER_ROW = 6;
const KEY_GAP = 7;
// Hauteur adaptée à l'écran, bornée pour rester confortable
const KEY_HEIGHT = Math.round(Math.min(56, Math.max(46, Dimensions.get('window').height * 0.062)));

export default function Keyboard({ onLetterClick, styles = {} }: KeyboardProps) {
    const player = useAudioPlayer(require('./../sound/tap.mp3'));
    const { i18n } = useTranslation();
    const ALPHABET = LAYOUTS[i18n.language?.slice(0, 2)] ?? LAYOUTS.fr;
    const [rowWidth, setRowWidth] = useState(0);

    const handlePress = (item: string) => {
        // Avec expo-audio, le son reste à la fin quand il a fini de jouer : on le rembobine.
        player.seekTo(0);
        player.play();
        onLetterClick(item);
    };

    // Largeur d'une touche calculée d'après la largeur réellement disponible
    const keyWidth = rowWidth > 0 ? Math.floor((rowWidth - KEY_GAP * (KEYS_PER_ROW - 1)) / KEYS_PER_ROW) : 0;

    return (
        <View
            style={[styles.keyboardContainer, local.container]}
            onLayout={(e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width)}
        >
            {keyWidth > 0 && (
                <View style={local.grid}>
                    {ALPHABET.map((item) => (
                        <Pressable
                            key={item}
                            hitSlop={2}
                            style={({ pressed }) => [
                                styles.keyButton, // couleurs et bordures du thème
                                local.key,
                                { width: keyWidth, height: KEY_HEIGHT },
                                pressed && { opacity: 0.5, transform: [{ scale: 0.94 }] },
                            ]}
                            onPress={() => handlePress(item)}
                        >
                            <Text style={[styles.keyButtonText, local.keyText]}>{item}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const local = StyleSheet.create({
    container: {
        width: '100%',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // la dernière ligne (2 lettres) reste centrée
        gap: KEY_GAP,
    },
    key: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    keyText: {
        fontSize: 22,
    },
});
