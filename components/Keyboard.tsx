import { useAudioPlayer } from 'expo-audio'; // 1. Import de la nouvelle librairie
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface KeyboardProps {
    onLetterClick: (letter: string) => void;
    styles: any;
}

const ALPHABET = 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split('');

export default function Keyboard({ onLetterClick, styles = {} }: KeyboardProps) {
    // 2. Initialisation du lecteur audio (le hook gère la mémoire automatiquement)
    // N'oublie pas de vérifier que le chemin correspond bien à ton fichier
    const player = useAudioPlayer(require('./../sound/tap.mp3'));

    // 3. Fonction pour jouer le son et valider la lettre
    const handlePress = (item: string) => {
        // Avec expo-audio, le son reste à la fin quand il a fini de jouer.
        // Il faut donc le remettre à 0 (en millisecondes) avant de le rejouer.
        player.seekTo(0);
        player.play();

        onLetterClick(item); // Envoie la lettre au jeu
    };

    return (
        <View style={styles.keyboardContainer}>
            <View style={styles.keyboardgrid}>
                {ALPHABET.map((item) => (
                    <Pressable
                        key={item}
                        style={({ pressed }) => [
                            styles.keyButton,
                            pressed && { opacity: 0.5, transform: [{ scale: 0.95 }] },
                        ]}
                        onPress={() => handlePress(item)} // Appel de la nouvelle fonction
                    >
                        <Text style={styles.keyButtonText}>{item}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}