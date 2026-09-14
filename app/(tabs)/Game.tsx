import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    AdEventType,
    InterstitialAd,
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

import AdConfirmModal from './../../components/AdConfirmModal';
import Boite from './../../components/Boite';
import Keyboard from './../../components/Keyboard';
import Letter from './../../components/Letter';
import Life from './../../components/Life';
import { THEMES } from './../../components/themeRegistry';

import listWord from './../../JSON/liste_mot.json';

const IS_CLOSED_TESTING = true;

const interstitialAdUnitId = (__DEV__ || IS_CLOSED_TESTING)
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-5542646175321041/9569611051';

const rewardedAdUnitId = (__DEV__ || IS_CLOSED_TESTING)
    ? TestIds.REWARDED
    : 'ca-app-pub-5542646175321041/1438900243';

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId);
const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId);

interface BoostersData {
    revealLetter: number;
    extraLife: number;
    revealWord: number;
}

interface PlayerData {
    level: number;
    selectedTheme: number;
    game_version: string;
    coins: number;
    boosters: BoostersData;
    gamesPlayedCount: number;
}

type BoosterType = 'revealLetter' | 'extraLife' | 'revealWord';

interface AdPromptState {
    visible: boolean;
    boosterType: BoosterType | null;
    boosterName: string;
    watched: number;
    required: number;
}

const BOOSTER_ICONS: Record<BoosterType, string> = {
    revealLetter: '💡',
    extraLife: '🔴',
    revealWord: '👁️',
};

const ADS_REQUIRED: Record<BoosterType, number> = {
    revealLetter: 1,
    extraLife: 1,
    revealWord: 2,
};

const EMPTY_AD_PROMPT: AdPromptState = {
    visible: false,
    boosterType: null,
    boosterName: '',
    watched: 0,
    required: 1,
};

export default function GameScreen() {
    const router = useRouter();

    const [indice, setIndice] = useState<number>(0);
    const [checkWord, setCheckWord] = useState<string[]>([]);
    const [trouve, setTrouve] = useState<string[]>([]);
    const [life, setLife] = useState<number[]>([1, 1, 1, 1, 1]);
    const [countLife, setCountLife] = useState<number>(4);
    const [player, setPlayer] = useState<PlayerData>({
        level: 1,
        selectedTheme: 1,
        game_version: '2.1',
        coins: 0,
        boosters: { revealLetter: 3, extraLife: 3, revealWord: 3 },
        gamesPlayedCount: 0,
    });
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [adPrompt, setAdPrompt] = useState<AdPromptState>(EMPTY_AD_PROMPT);
    const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);

    // ==========================================
    // NOUVEAU : FONCTION DE SAUVEGARDE SÉCURISÉE
    // ==========================================
    const updatePlayerSafe = (modifier: (prev: PlayerData) => PlayerData) => {
        setPlayer((prevPlayer) => {
            const newPlayerState = modifier(prevPlayer);
            // Sauvegarde immédiate du NOUVEL état
            AsyncStorage.setItem('player', JSON.stringify(newPlayerState)).catch(console.error);
            return newPlayerState;
        });
    };

    useEffect(() => {
        const unsubscribeLoaded = interstitial.addAdEventListener(
            AdEventType.LOADED,
            () => {
                setIsInterstitialLoaded(true);
            }
        );

        const unsubscribeClosed = interstitial.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                setIsInterstitialLoaded(false);
                interstitial.load();
            }
        );

        const unsubscribeError = interstitial.addAdEventListener(
            AdEventType.ERROR,
            (error) => {
                console.log('Erreur de chargement Interstitial:', error);
                setIsInterstitialLoaded(false);
            }
        );

        const unsubscribeRewardedClosed = rewarded.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                rewarded.load();
            }
        );

        interstitial.load();
        rewarded.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeClosed();
            unsubscribeError();
            unsubscribeRewardedClosed();
        };
    }, []);

    const checkLevel = useCallback(async (level: number, playedLevels: number[]): Promise<number> => {
        if (level >= listWord.length) {
            return checkLevel(0, playedLevels);
        }
        if (playedLevels.includes(level)) {
            return checkLevel(level + 1, playedLevels);
        }
        return level;
    }, []);

    useFocusEffect(
        useCallback(() => {
            async function initGame() {
                // ==============================================================
                // CORRECTION : ÉVITE LE REDÉMARRAGE APRÈS AVOIR VU UNE VIDÉO
                // ==============================================================
                if (isLoaded) return;

                try {
                    const savedPlayed = await AsyncStorage.getItem('niveauxJoues');
                    const playedLevels: number[] = savedPlayed ? JSON.parse(savedPlayed) : [];

                    const randomIndex = Math.floor(Math.random() * listWord.length);
                    const nextIndice = await checkLevel(randomIndex, playedLevels);

                    const currentWord = listWord[nextIndice].word.split('');
                    setIndice(nextIndice);
                    setCheckWord(currentWord);
                    setTrouve(Array(currentWord.length).fill(''));

                    const savedPlayer = await AsyncStorage.getItem('player');
                    if (savedPlayer) {
                        const parsed = JSON.parse(savedPlayer);
                        setPlayer({
                            ...parsed,
                            coins: parsed.coins ?? 0,
                            gamesPlayedCount: parsed.gamesPlayedCount ?? 0,
                            boosters: {
                                revealLetter: parsed.boosters?.revealLetter ?? 3,
                                extraLife: parsed.boosters?.extraLife ?? 3,
                                revealWord: parsed.boosters?.revealWord ?? 3,
                            },
                        });
                    } else {
                        const initialPlayer: PlayerData = {
                            level: 1,
                            selectedTheme: 1,
                            game_version: '2.1',
                            coins: 0,
                            boosters: { revealLetter: 3, extraLife: 3, revealWord: 3 },
                            gamesPlayedCount: 0,
                        };
                        await AsyncStorage.setItem('player', JSON.stringify(initialPlayer));
                        setPlayer(initialPlayer);
                    }

                    // ==============================================================
                    // CORRECTION : ON ACTIVE LE JEU SEULEMENT SI LE CHARGEMENT RÉUSSIT
                    // ==============================================================
                    setIsLoaded(true);

                } catch (err) {
                    console.error("Erreur lors de l'initialisation du jeu :", err);
                    Alert.alert("Erreur", "Impossible de charger votre partie. Veuillez relancer l'application.");
                }
            }

            initGame();
        }, [checkLevel, isLoaded])
    );

    const saveLevel = async (indiceMot: number) => {
        try {
            const sauvegarde = await AsyncStorage.getItem('niveauxJoues');
            let motsJoues: number[] = sauvegarde ? JSON.parse(sauvegarde) : [];

            if (!motsJoues.includes(indiceMot)) {
                motsJoues.push(indiceMot);
                await AsyncStorage.setItem('niveauxJoues', JSON.stringify(motsJoues));
            }
        } catch (err) {
            console.error('Erreur de sauvegarde :', err);
        }
    };

    const handleGameEnd = async (isWin: boolean) => {
        const newCount = player.gamesPlayedCount + 1;
        let showAd = false;
        let finalCount = newCount;

        if (newCount >= 5) {
            if (isInterstitialLoaded) {
                showAd = true;
                finalCount = 0;
            } else {
                interstitial.load();
                finalCount = newCount;
            }
        }

        // ==============================================================
        // CORRECTION : SAUVEGARDE SÉCURISÉE DES PIÈCES ET DU NIVEAU
        // ==============================================================
        updatePlayerSafe((prev) => ({
            ...prev,
            level: isWin ? prev.level + 1 : prev.level,
            coins: isWin ? prev.coins + 15 : prev.coins,
            gamesPlayedCount: finalCount,
        }));

        if (isWin) {
            saveLevel(indice);
        }

        if (showAd) {
            interstitial.show();
        }
    };

    const promptWatchAdForDirectBooster = (type: BoosterType, boosterName: string) => {
        setAdPrompt({
            visible: true,
            boosterType: type,
            boosterName,
            watched: 0,
            required: ADS_REQUIRED[type],
        });
    };

    const closeAdPrompt = () => {
        setAdPrompt(EMPTY_AD_PROMPT);
    };

    const handleWatchAd = () => {
        const type = adPrompt.boosterType;
        if (!type) return;

        if (rewarded.loaded) {
            const unsubscribe = rewarded.addAdEventListener(
                RewardedAdEventType.EARNED_REWARD,
                () => {
                    unsubscribe();

                    setAdPrompt((prev) => {
                        const newWatched = prev.watched + 1;

                        if (newWatched >= prev.required) {
                            executeBoosterEffect(type);
                            return EMPTY_AD_PROMPT;
                        }

                        rewarded.load();
                        return { ...prev, watched: newWatched };
                    });
                }
            );
            rewarded.show();
        } else {
            Alert.alert("Indisponible", "La vidéo n'est pas encore prête, réessayez dans un instant.");
            rewarded.load();
        }
    };

    const executeBoosterEffect = (type: BoosterType) => {
        if (type === 'revealLetter') {
            const unrevealedIndices: number[] = [];
            trouve.forEach((val, idx) => {
                if (val === '') unrevealedIndices.push(idx);
            });
            if (unrevealedIndices.length === 0) return;

            const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            const targetLetter = checkWord[randomIndex];

            setTrouve((prev) => {
                const table = [...prev];
                checkWord.forEach((l, idx) => {
                    if (l === targetLetter) table[idx] = targetLetter;
                });
                return table;
            });
        } else if (type === 'extraLife') {
            if (countLife >= 4) return;
            const newCountLife = countLife + 1;
            setCountLife(newCountLife);
            setLife((prev) => {
                const table = [...prev];
                table[newCountLife] = 1;
                return table;
            });
        } else if (type === 'revealWord') {
            setTrouve([...checkWord]);
        }
    };

    const endgame = (word: string[]): boolean => {
        if (word.length === 0) return false;
        for (let i = 0; i <= word.length - 1; i++) {
            if (word[i] === '') return false;
        }
        return true;
    };

    const isGameOver = countLife <= -1;
    const isGameWon = endgame(trouve);

    const handleUseBooster = (
        type: BoosterType,
        cost: number,
        name: string
    ) => {
        if (isGameOver || isGameWon) return;

        const currentCount = player.boosters[type];

        if (currentCount > 0) {
            // ==============================================================
            // CORRECTION : DÉPENSE DU BOOSTER SÉCURISÉE
            // ==============================================================
            updatePlayerSafe((prev) => ({
                ...prev,
                boosters: {
                    ...prev.boosters,
                    [type]: prev.boosters[type] - 1,
                },
            }));
            executeBoosterEffect(type);
        } else if (player.coins >= cost) {
            // ==============================================================
            // CORRECTION : DÉPENSE DES PIÈCES SÉCURISÉE
            // ==============================================================
            updatePlayerSafe((prev) => ({
                ...prev,
                coins: prev.coins - cost,
            }));
            executeBoosterEffect(type);
        } else {
            promptWatchAdForDirectBooster(type, name);
        }
    };

    const handleLetterClick = (lettre: string) => {
        if (isGameOver || isGameWon) return;

        for (let i = 0; i <= checkWord.length - 1; i++) {
            if (lettre === checkWord[i] && trouve[i] === '') {
                setTrouve((prev) => {
                    const table = [...prev];
                    table[i] = lettre;
                    return table;
                });
                return;
            }
        }

        setLife((prev) => {
            const table = [...prev];
            if (countLife >= 0) {
                table[countLife] = 0;
            }
            return table;
        });

        const newCountLife = countLife - 1;
        setCountLife(newCountLife);

        if (newCountLife === -1) {
            handleGameEnd(false);
        }
    };

    const handleReset = () => {
        const indexIndice = Math.floor(Math.random() * listWord.length);
        const newWord = listWord[indexIndice].word.split('');

        setIndice(indexIndice);
        setCheckWord(newWord);
        setTrouve(Array(newWord.length).fill(''));
        setLife([1, 1, 1, 1, 1]);
        setCountLife(4);
    };

    useEffect(() => {
        if (isLoaded && endgame(trouve)) {
            handleGameEnd(true);
        }
    }, [trouve]);

    if (!isLoaded || checkWord.length === 0) return null;

    const activeTheme = THEMES[player.selectedTheme] || THEMES[1];
    const styles = activeTheme.gameStyles;

    return (
        <SafeAreaView style={styles.gameWrap}>
            <ImageBackground
                source={activeTheme.backgroundImage}
                style={styles.heroBg}
                resizeMode="cover"
            >
                <View style={styles.heroOverlay} />
            </ImageBackground>

            <View style={styles.gameHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                </TouchableOpacity>

                <View style={styles.levelIndicator}>
                    <Text style={styles.levelIndicatorText}>Niveau {player.level}</Text>
                </View>

                <View style={localStyles.coinBadge}>
                    <Text style={localStyles.coinBadgeText}>🪙 {player.coins}</Text>
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.bigcontainer}>
                    <View style={[styles.ornament, styles.ornamentTL]} />
                    <View style={[styles.ornament, styles.ornamentTR]} />
                    <View style={[styles.ornament, styles.ornamentBL]} />
                    <View style={[styles.ornament, styles.ornamentBR]} />

                    <View style={styles.container}>
                        <View style={styles.description}>
                            <Text style={styles.contenuedescription}>
                                {listWord[indice]?.indice}
                            </Text>
                        </View>

                        <View style={styles.game}>
                            {trouve.map((item, i) => (
                                <Letter key={i} letter={item} styles={styles} />
                            ))}
                        </View>

                        <View style={localStyles.boostersBar}>
                            <TouchableOpacity
                                style={localStyles.boosterBtn}
                                onPress={() => handleUseBooster('revealLetter', 30, '1 Lettre')}
                            >
                                <Text style={localStyles.boosterIcon}>💡</Text>
                                <Text style={localStyles.boosterLabel}>1 Lettre</Text>
                                <Text style={localStyles.boosterPrice}>
                                    {player.boosters.revealLetter > 0 ? `x${player.boosters.revealLetter}` : '🪙 30'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    localStyles.boosterBtn,
                                    countLife >= 4 && localStyles.boosterDisabled,
                                ]}
                                onPress={() => handleUseBooster('extraLife', 15, '+1 Vie')}
                                disabled={countLife >= 4}
                            >
                                <Text style={localStyles.boosterIcon}>🔴</Text>
                                <Text style={localStyles.boosterLabel}>+1 Vie</Text>
                                <Text style={localStyles.boosterPrice}>
                                    {player.boosters.extraLife > 0 ? `x${player.boosters.extraLife}` : '🪙 15'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={localStyles.boosterBtn}
                                onPress={() => handleUseBooster('revealWord', 50, 'Tout le mot')}
                            >
                                <Text style={localStyles.boosterIcon}>👁️</Text>
                                <Text style={localStyles.boosterLabel}>Tout le mot</Text>
                                <Text style={localStyles.boosterPrice}>
                                    {player.boosters.revealWord > 0 ? `x${player.boosters.revealWord}` : '🪙 50'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.lifebar}>
                            {life.map((item, i) => (
                                <Life key={i} active={item === 1} styles={styles} />
                            ))}
                        </View>

                        <Keyboard onLetterClick={handleLetterClick} styles={styles} />
                    </View>
                </View>
            </View>

            {isGameOver && <Boite handlereset={handleReset} word={checkWord.join('')} styles={styles} />}
            {isGameWon && <Boite haswon={true} handlereset={handleReset} word={checkWord.join('')} styles={styles} />}

            <AdConfirmModal
                visible={adPrompt.visible}
                boosterName={adPrompt.boosterName}
                boosterIcon={adPrompt.boosterType ? BOOSTER_ICONS[adPrompt.boosterType] : '⭐'}
                watched={adPrompt.watched}
                required={adPrompt.required}
                onCancel={closeAdPrompt}
                onWatch={handleWatchAd}
            />
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    coinBadge: {
        backgroundColor: 'rgba(240, 192, 64, 0.25)',
        borderWidth: 1,
        borderColor: '#f0c040',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
    },
    coinBadgeText: {
        color: '#f0c040',
        fontWeight: 'bold',
        fontSize: 14,
    },
    boostersBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
        gap: 8,
    },
    boosterBtn: {
        flex: 1,
        backgroundColor: 'rgba(240, 192, 64, 0.12)',
        borderColor: '#f0c040',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    boosterDisabled: {
        opacity: 0.35,
        borderColor: '#777',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    boosterIcon: {
        fontSize: 18,
    },
    boosterLabel: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    boosterPrice: {
        color: '#f0c040',
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 2,
    },
});