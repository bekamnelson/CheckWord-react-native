import { useAudioPlayer } from 'expo-audio'; // 1. Import de expo-audio
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface BoiteProps {
    visible?: boolean;
    hascompleted?: boolean;
    haswon?: boolean;
    nom?: string;
    word?: string;
    handlereset: () => void;
    styles: any;
}

export default function Boite({
    visible = true,
    hascompleted = false,
    haswon = false,
    nom = 'Joueur',
    word = '',
    handlereset,
    styles = {},
}: BoiteProps) {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [annonce, setAnnonce] = useState('');
    const [etat, setEtat] = useState('');

    // 2. Initialisation des deux lecteurs audio
    // N'oublie pas de modifier les chemins pour qu'ils correspondent à tes fichiers !
    const victoryPlayer = useAudioPlayer(require('./../sound/victory.mp3'));
    const defeatPlayer = useAudioPlayer(require('./../sound/defeat.mp3'));

    useEffect(() => {
        if (!hascompleted && !haswon) {
            genererEffetDefaite();
        } else {
            genererEffetVictoire();
        }

        if (haswon && !hascompleted) {
            setAnnonce('Victoire !');
            setMessage('Félicitations, vous avez trouvé le mot caché !');
            setEtat('Niveau suivant');
        } else if (!haswon && !hascompleted) {
            setAnnonce('Défaite !');
            setMessage("Désolé, vous avez atteint le nombre d'essais maximal.");
            setEtat('Réessayer');
        } else if (hascompleted && haswon) {
            setAnnonce('Fin de la Partie !');
            setMessage(`Le survivant ultime est ${nom} !`);
            setEtat('Rejouer');
        } else if (hascompleted && !haswon) {
            setAnnonce('Mot Trouvé !');
            setMessage(`${nom} a trouvé la dernière lettre et devient le nouveau Maître du Jeu !`);
            setEtat('Manche Suivante');
        }
    }, [hascompleted, haswon, nom]);

    const genererEffetVictoire = () => {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // 3. Jouer le son de victoire
            victoryPlayer.seekTo(0);
            victoryPlayer.play();
        } catch (e) {
            // Ignoré si non supporté
        }
    };

    const genererEffetDefaite = () => {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            // 4. Jouer le son de défaite
            defeatPlayer.seekTo(0);
            defeatPlayer.play();
        } catch (e) {
            // Ignoré si non supporté
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.boiteModal}>
                    <Text style={styles.modalIcon}>
                        {hascompleted || haswon ? '🏆' : '💀'}
                    </Text>

                    <Text style={styles.modalTitle}>{annonce}</Text>

                    <Text style={styles.modalText}>
                        {message}
                        {'\n'}
                        {annonce === 'Défaite !' && 'Le mot caché était :\n'}
                        <Text
                            style={{
                                color: '#f0c060',
                                fontSize: 22,
                                fontWeight: 'bold',
                                letterSpacing: 4,
                                textShadowColor: 'rgba(240, 192, 96, 0.5)',
                                textShadowRadius: 10,
                            }}
                        >
                            {word}
                        </Text>
                    </Text>

                    <View style={styles.modalActions}>
                        <Pressable
                            style={styles.btnSecondary}
                            onPress={() => router.push('/')}
                        >
                            <Text style={styles.btnSecondaryText}>Retour</Text>
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