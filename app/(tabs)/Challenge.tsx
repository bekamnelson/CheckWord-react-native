import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';

import {
    ImageBackground,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import Boite from '../../components/Boite';
import Input from '../../components/Input';
import Keyboard from '../../components/Keyboard';
import Letter from '../../components/Letter';
import Player from '../../components/Player';
import { THEMES } from '../../components/themeRegistry';

interface PlayerData {
    nom: string;
    life: number;
    active: boolean;
}

export default function Challenge() {
    const router = useRouter();
    const [selectedTheme, setSelectedTheme] = useState<number>(1);
    const [nbPlayers, setNbPlayers] = useState<number>(2);
    const [players, setPlayers] = useState<PlayerData[]>([
        { nom: 'Joueur 1', life: 5, active: true },
        { nom: 'Joueur 2', life: 5, active: true },
    ]);
    const [step, setStep] = useState<number>(0);
    const [currentMaster, setCurrentMaster] = useState<number>(0);
    const [currentPlayer, setCurrentPlayer] = useState<number>(1);

    const [indice, setIndice] = useState<string>('');
    const [rawWord, setRawWord] = useState<string>('');
    const [checkWord, setCheckWord] = useState<string[]>([]);
    const [trouve, setTrouve] = useState<string[]>([]);

    // États pour la boîte d'alerte personnalisée
    const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const nbSurvivants = players.filter((p) => p.life > 0).length;

    // Réinitialisation complète à CHAQUE entrée dans la vue + Chargement du thème
    useFocusEffect(
        useCallback(() => {
            setStep(0);
            setNbPlayers(2);
            setPlayers([
                { nom: 'Joueur 1', life: 5, active: true },
                { nom: 'Joueur 2', life: 5, active: true },
            ]);
            setCurrentMaster(0);
            setCurrentPlayer(1);
            setIndice('');
            setRawWord('');
            setCheckWord([]);
            setTrouve([]);
            setErrorModalVisible(false);

            const loadTheme = async () => {
                try {
                    const savedPlayer = await AsyncStorage.getItem('player');
                    if (savedPlayer) {
                        const parsed = JSON.parse(savedPlayer);
                        if (parsed.selectedTheme) setSelectedTheme(parsed.selectedTheme);
                    }
                } catch (error) {
                    console.error('Erreur de chargement du thème :', error);
                }
            };
            loadTheme();
        }, [])
    );

    // Redirection automatique sur écran de fin de partie s'il ne reste qu'un survivant
    useEffect(() => {
        if (nbSurvivants === 1 && step === 3) {
            setStep(4);
        }
    }, [nbSurvivants, step]);

    // Gestion du nombre de joueurs
    const handlePlayerNbChange = (text: string) => {
        // Si l'utilisateur efface le champ, on laisse la possibilité de re-taper
        if (text === '') {
            setNbPlayers('' as unknown as number);
            return;
        }

        const val = parseInt(text, 10);

        if (!isNaN(val)) {
            // Limite strictement la valeur entre 2 et 6
            const boundedVal = Math.min(Math.max(val, 2), 6);
            setNbPlayers(boundedVal);
            setPlayers(
                Array.from({ length: boundedVal }, (_, i) => ({
                    nom: `Joueur ${i + 1}`,
                    life: 5,
                    active: true,
                }))
            );
        }
    };

    // Gestion du nom de chaque joueur
    const handlePlayerNameChange = (text: string, index: number) => {
        setPlayers((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], nom: text };
            return copy;
        });
    };

    // Formate le mot secret
    const handleWord = (text: string) => {
        setRawWord(text);
        const formatted = text
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^A-Z]/g, '');
        const letters = formatted.split('');
        setCheckWord(letters);
        setTrouve(Array(letters.length).fill(''));
    };

    // Validation avec la boîte d'alerte personnalisée
    const handleStartGame = () => {
        const errors: string[] = [];
        const wordRegex = /^[a-zA-ZÀ-ÿ]+$/;

        if (!rawWord || !wordRegex.test(rawWord)) {
            errors.push("Le mot ne doit contenir que des lettres et ne pas être vide.");
        }
        if (!indice || indice.trim().length < 5) {
            errors.push("L'indice doit comporter au moins 5 caractères.");
        }

        if (errors.length > 0) {
            setErrorMessage(errors.join('\n\n'));
            setErrorModalVisible(true);
            return;
        }

        setStep(3);
    };

    // Logique de clic sur une lettre
    const handleLetterClick = (lettre: string) => {
        let hit = false;
        const newTrouve = [...trouve];

        for (let i = 0; i < checkWord.length; i++) {
            if (checkWord[i] === lettre && newTrouve[i] === '') {
                newTrouve[i] = lettre;
                hit = true;
                break;
            }
        }

        if (hit) {
            setTrouve(newTrouve);

            // Si le mot est complètement découvert, le joueur courant devient Maître
            const wordIsComplete = newTrouve.every((l) => l !== '');
            if (wordIsComplete) {
                setCurrentMaster(currentPlayer);
            }
        } else {
            // Retrait d'une vie
            setPlayers((prev) => {
                const copy = [...prev];
                const current = copy[currentPlayer];
                const newLife = current.life - 1;
                copy[currentPlayer] = {
                    ...current,
                    life: newLife,
                    active: newLife > 0,
                };
                return copy;
            });

            // Passage au joueur suivant
            setCurrentPlayer((prev) => {
                let attempts = 0;
                let nextIndex = prev;
                do {
                    nextIndex = (nextIndex + 1) % players.length;
                    attempts++;
                } while (
                    (!players[nextIndex].active || nextIndex === currentMaster) &&
                    attempts <= players.length
                );
                return nextIndex;
            });
        }
    };

    const isGameFinished = (): boolean => {
        if (trouve.length === 0) return false;
        return trouve.every((letter) => letter !== '');
    };

    // Préparation de la manche suivante
    const handleNextRound = () => {
        setTrouve([]);
        setCheckWord([]);
        setIndice('');
        setRawWord('');

        let nextPlayer = (currentMaster + 1) % players.length;
        let attempts = 0;
        while ((!players[nextPlayer].active || nextPlayer === currentMaster) && attempts < players.length) {
            nextPlayer = (nextPlayer + 1) % players.length;
            attempts++;
        }

        setCurrentPlayer(nextPlayer);
        setStep(2);
    };

    // Réinitialisation complète depuis l'écran de fin
    const handleResetAll = () => {
        setStep(0);
        setNbPlayers(2);
        setPlayers([
            { nom: 'Joueur 1', life: 5, active: true },
            { nom: 'Joueur 2', life: 5, active: true },
        ]);
        setCurrentMaster(0);
        setCurrentPlayer(1);
        setIndice('');
        setRawWord('');
        setCheckWord([]);
        setTrouve([]);
    };

    // Styles dynamiques du thème
    const activeTheme = THEMES[selectedTheme] || THEMES[1];
    const themeStyles = activeTheme.gameStyles;
    const primaryTextColor = themeStyles?.headerTitle?.color || '#f0c040';
    const secondaryTextColor = themeStyles?.contenuedescription?.color || '#ffffff';
    const borderColor = themeStyles?.ornament?.borderColor || primaryTextColor;

    const styles2 = activeTheme.gameStyles;

    return (
        <SafeAreaView style={styles.gameWrap}>
            <ImageBackground source={activeTheme.backgroundImage} style={styles.heroBg} resizeMode="cover">
                <View style={styles.heroOverlay} />
            </ImageBackground>

            {/* En-tête */}
            <View style={styles.gameHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={[styles.backBtnText, { color: secondaryTextColor }]}>← Retour</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: primaryTextColor }]}>⚜ CheckWord</Text>
                <View style={styles.levelIndicator}>
                    <Text style={[styles.levelIndicatorText, { color: secondaryTextColor }]}>Mode Survie</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* ÉCRAN 1 : CONFIGURATION */}
                {step < 2 && (
                    <View style={styles.bigcontainer}>
                        <View style={[styles.ornament, styles.ornamentTL, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentTR, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentBL, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentBR, { borderColor }]} />

                        <Text style={[styles.title, { color: primaryTextColor }]}>Configuration</Text>

                        {step === 0 && (
                            <View style={styles.stepBoxCentered}>
                                <Text style={[styles.labelCentered, { color: secondaryTextColor }]}>
                                    Combien de joueurs participent ? (2 - 6)
                                </Text>
                                <TextInput
                                    style={[styles.inputGoldCentered, { color: primaryTextColor, borderColor }]}
                                    keyboardType="numeric"
                                    value={nbPlayers.toString()}
                                    onChangeText={handlePlayerNbChange}
                                />
                                <TouchableOpacity style={styles.btnPrimary} onPress={() => setStep(1)}>
                                    <Text style={styles.btnText}>Suivant</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {step === 1 && (
                            <View style={styles.stepBox}>
                                {players.map((item, i) => (
                                    <Input
                                        key={`input-${i}`}
                                        i={i}
                                        value={item.nom}
                                        handleplayers={(text) => handlePlayerNameChange(text, i)}
                                        styles={themeStyles}
                                    />
                                ))}
                                <TouchableOpacity
                                    style={styles.btnPrimary}
                                    onPress={() => {
                                        setCurrentMaster(0);
                                        setCurrentPlayer(1);
                                        setStep(2);
                                    }}
                                >
                                    <Text style={styles.btnText}>Valider les joueurs</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {/* ÉCRAN 2 : PHASE DU MAÎTRE */}
                {step === 2 && (
                    <View style={styles.bigcontainer}>
                        <View style={[styles.ornament, styles.ornamentTL, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentTR, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentBL, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentBR, { borderColor }]} />

                        <Text style={[styles.title, { color: primaryTextColor }]}>Phase du Maître</Text>
                        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
                            C'est au tour de <Text style={{ fontWeight: 'bold', color: primaryTextColor }}>{players[currentMaster]?.nom}</Text> de choisir un mot !
                        </Text>

                        <View style={styles.stepBox}>
                            <TextInput
                                style={[styles.inputGold, { color: primaryTextColor, borderColor }]}
                                placeholder="Mot secret"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                secureTextEntry
                                onChangeText={handleWord}
                            />
                            <TextInput
                                style={[styles.inputGold, { color: primaryTextColor, borderColor }]}
                                placeholder="Indice du mot"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={indice}
                                onChangeText={setIndice}
                            />
                            <TouchableOpacity style={styles.btnPrimary} onPress={handleStartGame}>
                                <Text style={styles.btnText}>Lancer la partie</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* ÉCRAN 3 : JEU PRINCIPAL */}
                {step === 3 && (
                    <View style={styles.gameScreen}>
                        <Text style={[styles.tourIndicator, { color: primaryTextColor }]}>
                            Tour de : {players[currentPlayer]?.nom}
                        </Text>

                        <View style={styles.bigcontainer}>
                            <View style={[styles.ornament, styles.ornamentTL, { borderColor }]} />
                            <View style={[styles.ornament, styles.ornamentTR, { borderColor }]} />
                            <View style={[styles.ornament, styles.ornamentBL, { borderColor }]} />
                            <View style={[styles.ornament, styles.ornamentBR, { borderColor }]} />

                            {/* Indice */}
                            <Text style={[styles.contenuedescription, { color: secondaryTextColor }]}>
                                {indice}
                            </Text>

                            {/* Lettres du mot : alignées sur une seule ligne sans scroll avec ajustement responsive */}
                            <View style={styles.lettersRow}>
                                {trouve.map((item, i) => (
                                    <View key={i} style={styles.letterWrapper}>
                                        <Letter letter={item} styles={styles2} />
                                    </View>
                                ))}
                            </View>

                            {/* Clavier */}
                            <Keyboard onLetterClick={handleLetterClick} styles={styles2} />
                        </View>

                        {/* Cartes des Joueurs */}
                        <View style={styles.containtplayers}>
                            {players.map((item, i) => {
                                const icone = !item.active ? '💀' : i === currentMaster ? '👑' : '👤';
                                return (
                                    <Player
                                        key={`player-${i}`}
                                        name={item.nom}
                                        icone={icone}
                                        life={item.life}
                                        styles={themeStyles}
                                        isCurrentTurn={i === currentPlayer && item.active}
                                    />
                                );
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Boîtes de victoire */}
            {isGameFinished() && step === 3 && (
                <Boite
                    styles={styles2}
                    nom={players[currentMaster]?.nom}
                    handlereset={handleNextRound}
                    word={checkWord.join('')}
                    hascompleted={true}
                />
            )}

            {step === 4 && (
                <Boite
                    styles={styles2}
                    nom={players[currentMaster]?.nom}
                    handlereset={handleResetAll}
                    word={checkWord.join('')}
                    hascompleted={true}
                    haswon={true}
                />
            )}

            {/* BOÎTE D'ALERTE PERSONNALISÉE */}
            <Modal
                visible={errorModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setErrorModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { borderColor }]}>
                        <View style={[styles.ornament, styles.ornamentTL, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentTR, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentBL, { borderColor }]} />
                        <View style={[styles.ornament, styles.ornamentBR, { borderColor }]} />

                        <Text style={[styles.modalTitle, { color: primaryTextColor }]}>⚠️ Attention</Text>
                        <Text style={[styles.modalMessage, { color: secondaryTextColor }]}>{errorMessage}</Text>

                        <TouchableOpacity
                            style={styles.btnPrimary}
                            onPress={() => setErrorModalVisible(false)}
                        >
                            <Text style={styles.btnText}>Compris</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerTitle: {
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
        fontSize: 13,
        fontWeight: '600',
    },
    scrollContainer: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    bigcontainer: {
        width: '94%',
        maxWidth: 800,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        position: 'relative',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
    },
    stepBox: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
    },
    stepBoxCentered: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
    },
    labelCentered: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputGold: {
        width: '100%',
        height: 48,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        fontWeight: '600',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    inputGoldCentered: {
        width: '50%',
        maxWidth: 200,
        height: 48,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    btnPrimary: {
        backgroundColor: '#f0c040',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    btnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    gameScreen: {
        width: '100%',
        alignItems: 'center',
    },
    tourIndicator: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    contenuedescription: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    lettersRow: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        gap: 4,
    },
    letterWrapper: {
        flexShrink: 1,
        maxWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containtplayers: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
        width: '100%',
    },
    ornament: {
        position: 'absolute',
        width: 12,
        height: 12,
    },
    ornamentTL: { top: 6, left: 6, borderTopWidth: 2, borderLeftWidth: 2 },
    ornamentTR: { top: 6, right: 6, borderTopWidth: 2, borderRightWidth: 2 },
    ornamentBL: { bottom: 6, left: 6, borderBottomWidth: 2, borderLeftWidth: 2 },
    ornamentBR: { bottom: 6, right: 6, borderBottomWidth: 2, borderRightWidth: 2 },

    /* Styles pour la boîte d'alerte personnalisée */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#1a1a1a',
        padding: 25,
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        position: 'relative',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
});