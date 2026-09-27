import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
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

import { useTranslation } from 'react-i18next';
import AdConfirmModal from './../../components/AdConfirmModal';
import Boite from './../../components/Boite';
import Icon, { IconText } from './../../components/Icon';
import DifficultyBadge, { DIFFICULTY_BADGE_SPACE, borderTopOf } from './../../components/DifficultyBadge';
import Keyboard from './../../components/Keyboard';
import Letter from './../../components/Letter';
import LifeBar from './../../components/LifeBar';
import Ornaments from './../../components/Ornaments';
import Loader from './../../components/Loader';
import ThemeBackdrop from './../../components/ThemeBackdrop';
import { themeUnlockedAt } from './../../components/themeRegistry';
import { useDialog } from './../../contexts/DialogContext';
import { useGameTheme } from './../../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from './../../themes/decor';

import listWordDe from './../../JSON/liste_mot_de.json';
import listWordEn from './../../JSON/liste_mot_en.json';
import listWordEs from './../../JSON/liste_mot_es.json';
import listWordFr from './../../JSON/liste_mot_fr.json';

interface WordEntry {
    word: string;
    indice: string;
    difficulte: string;
}

// Une liste de mots par langue, chacune avec sa propre sauvegarde des mots déjà trouvés.
// La clé FR reste 'niveauxJoues' pour conserver la progression des joueurs existants.
const WORD_LISTS: Record<string, { words: WordEntry[]; playedKey: string }> = {
    fr: { words: listWordFr, playedKey: 'niveauxJoues' },
    en: { words: listWordEn, playedKey: 'niveauxJoues_en' },
    es: { words: listWordEs, playedKey: 'niveauxJoues_es' },
    de: { words: listWordDe, playedKey: 'niveauxJoues_de' },
};

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

// Noms d'icônes Font Awesome
const BOOSTER_ICONS: Record<BoosterType, string> = {
    revealLetter: 'lightbulb',
    extraLife: 'heart',
    revealWord: 'eye',
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
    const { t, i18n } = useTranslation();
    const { theme: activeTheme, decor, setThemeId, themeIdRef } = useGameTheme();
    const { showDialog } = useDialog();
    const localStyles = React.useMemo(() => makeLocalStyles(decor.palette), [decor]);
    const lang = WORD_LISTS[i18n.language?.slice(0, 2)] ? i18n.language.slice(0, 2) : 'fr';
    const { words: listWord, playedKey } = WORD_LISTS[lang];

    const [indice, setIndice] = useState<number>(0);
    const [wordLang, setWordLang] = useState<string>(lang);
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
    const [unlockedTheme, setUnlockedTheme] = useState<string | null>(null);

    const [adPrompt, setAdPrompt] = useState<AdPromptState>(EMPTY_AD_PROMPT);
    const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);

    // ==========================================
    // NOUVEAU : FONCTION DE SAUVEGARDE SÉCURISÉE
    // ==========================================
    const updatePlayerSafe = (modifier: (prev: PlayerData) => PlayerData) => {
        setPlayer((prevPlayer) => {
            const newPlayerState = modifier(prevPlayer);
            // Sauvegarde immédiate du NOUVEL état
            // Le thème est géré par le contexte : on sauvegarde toujours sa valeur à jour
            const toSave = { ...newPlayerState, selectedTheme: themeIdRef.current };
            AsyncStorage.setItem('player', JSON.stringify(toSave)).catch(console.error);
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

    // Premier mot non encore trouvé à partir de `start` (en bouclant) ; si tout a été trouvé, on rejoue `start`.
    const pickLevel = useCallback((start: number, playedLevels: number[]): number => {
        const played = new Set(playedLevels);
        for (let k = 0; k < listWord.length; k++) {
            const i = (start + k) % listWord.length;
            if (!played.has(i)) return i;
        }
        return start;
    }, [listWord]);

    const loadPlayedLevels = useCallback(async (): Promise<number[]> => {
        const savedPlayed = await AsyncStorage.getItem(playedKey);
        return savedPlayed ? JSON.parse(savedPlayed) : [];
    }, [playedKey]);

    useFocusEffect(
        useCallback(() => {
            async function initGame() {
                // ==============================================================
                // CORRECTION : ÉVITE LE REDÉMARRAGE APRÈS AVOIR VU UNE VIDÉO
                // ==============================================================
                // Un changement de langue dans les réglages impose en revanche un nouveau mot.
                if (isLoaded && wordLang === lang) return;

                try {
                    const playedLevels = await loadPlayedLevels();

                    const randomIndex = Math.floor(Math.random() * listWord.length);
                    const nextIndice = pickLevel(randomIndex, playedLevels);

                    const currentWord = listWord[nextIndice].word.split('');
                    setIndice(nextIndice);
                    setWordLang(lang);
                    setCheckWord(currentWord);
                    setTrouve(Array(currentWord.length).fill(''));
                    setLife([1, 1, 1, 1, 1]);
                    setCountLife(4);

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
                    showDialog({ title: t('game_erreur_titre'), message: t('game_erreur_msg'), icon: 'triangle-exclamation', tone: 'danger' });
                }
            }

            initGame();
        }, [pickLevel, loadPlayedLevels, isLoaded, wordLang, lang, listWord])
    );

    const saveLevel = async (indiceMot: number) => {
        try {
            const motsJoues = await loadPlayedLevels();

            if (!motsJoues.includes(indiceMot)) {
                motsJoues.push(indiceMot);
                await AsyncStorage.setItem(playedKey, JSON.stringify(motsJoues));
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
        // Un nouveau thème se débloque tous les 50 niveaux : on l'applique automatiquement
        // (le joueur peut toujours en choisir un autre depuis la page Thèmes).
        const unlocked = isWin ? themeUnlockedAt(player.level + 1) : undefined;
        setUnlockedTheme(unlocked?.name ?? null);

        updatePlayerSafe((prev) => ({
            ...prev,
            level: isWin ? prev.level + 1 : prev.level,
            coins: isWin ? prev.coins + 15 : prev.coins,
            gamesPlayedCount: finalCount,
        }));
        if (unlocked) setThemeId(unlocked.id);

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
            showDialog({ title: t('game_video_indispo_titre'), message: t('game_video_indispo_msg'), icon: 'clapperboard' });
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

    const handleReset = async () => {
        const playedLevels = await loadPlayedLevels().catch(() => []);
        const indexIndice = pickLevel(Math.floor(Math.random() * listWord.length), playedLevels);
        const newWord = listWord[indexIndice].word.split('');

        setIndice(indexIndice);
        setWordLang(lang);
        setUnlockedTheme(null);
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

    // Tant que la partie n'est pas prête : écran de chargement seul (même voile que celui qui s'efface ensuite)
    if (!isLoaded || checkWord.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Loader ready={false} />
            </SafeAreaView>
        );
    }

    const styles = activeTheme.gameStyles;

    return (
        <SafeAreaView style={styles.gameWrap}>
            <ThemeBackdrop />

            <View style={styles.gameHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <IconText icon="arrow-left" textStyle={styles.backBtnText}>{t('retour')}</IconText>
                </TouchableOpacity>

                <View style={styles.levelIndicator}>
                    <Text style={styles.levelIndicatorText}>{t('game_niveau', { level: player.level })}</Text>
                </View>

                <View style={localStyles.coinBadge}>
                    <IconText icon="coins" textStyle={localStyles.coinBadgeText} gap={6}>{player.coins}</IconText>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={localStyles.scroll}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.bigcontainer}>
                    <Ornaments />

                    <View style={styles.container}>
                        <View style={[styles.description, localStyles.tight, localStyles.hintWithBadge]}>
                            <DifficultyBadge
                                level={WORD_LISTS[wordLang].words[indice]?.difficulte}
                                borderTopWidth={borderTopOf(styles.description)}
                            />
                            <Text style={styles.contenuedescription}>
                                {WORD_LISTS[wordLang].words[indice]?.indice}
                            </Text>
                        </View>

                        <View style={[styles.game, localStyles.tight]}>
                            {trouve.map((item, i) => (
                                <Letter key={i} letter={item} styles={styles} />
                            ))}
                        </View>

                        <LifeBar remaining={countLife + 1} total={life.length} />

                        <View style={localStyles.boostersBar}>
                            {([
                                { type: 'revealLetter', cost: 30, label: t('game_booster_lettre'), icon: BOOSTER_ICONS.revealLetter, iconColor: decor.palette.primary },
                                { type: 'extraLife', cost: 15, label: t('game_booster_vie'), icon: decor.icons.life, iconColor: decor.icons.lifeColor },
                                { type: 'revealWord', cost: 50, label: t('game_booster_mot'), icon: BOOSTER_ICONS.revealWord, iconColor: decor.palette.accent },
                            ] as const).map(({ type, cost, label, icon, iconColor }) => {
                                const disabled = type === 'extraLife' && countLife >= 4;
                                const stock = player.boosters[type];
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[localStyles.boosterBtn, disabled && localStyles.boosterDisabled]}
                                        onPress={() => handleUseBooster(type, cost, label)}
                                        disabled={disabled}
                                    >
                                        <Icon name={icon} size={18} color={iconColor} />
                                        <Text style={localStyles.boosterLabel}>{label}</Text>
                                        {stock > 0 ? (
                                            <Text style={localStyles.boosterPrice}>x{stock}</Text>
                                        ) : (
                                            <IconText icon="coins" textStyle={localStyles.boosterPrice} gap={4}>{cost}</IconText>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Keyboard onLetterClick={handleLetterClick} styles={styles} />
                    </View>
                </View>
            </ScrollView>

            {isGameOver && <Boite handlereset={handleReset} word={checkWord.join('')} styles={styles} />}
            {isGameWon && (
                <Boite
                    haswon={true}
                    handlereset={handleReset}
                    word={checkWord.join('')}
                    styles={styles}
                    unlockedTheme={unlockedTheme}
                />
            )}

            <AdConfirmModal
                visible={adPrompt.visible}
                boosterName={adPrompt.boosterName}
                boosterIcon={adPrompt.boosterType === 'extraLife' ? decor.icons.life : adPrompt.boosterType ? BOOSTER_ICONS[adPrompt.boosterType] : 'star'}
                watched={adPrompt.watched}
                required={adPrompt.required}
                onCancel={closeAdPrompt}
                onWatch={handleWatchAd}
            />

            {/* Écran de chargement : s'efface quand la page est prête */}
            <Loader />
        </SafeAreaView>
    );
}

// Styles propres à l'écran, calculés à partir de la palette du thème actif
const makeLocalStyles = (p: ThemePalette) => StyleSheet.create({
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 12,
    },
    // Marges réduites pour laisser de la place au grand clavier
    tight: {
        marginBottom: 14,
    },
    hintWithBadge: {
        marginTop: DIFFICULTY_BADGE_SPACE,
        paddingTop: DIFFICULTY_BADGE_SPACE + 6,
    },
    coinBadge: {
        backgroundColor: withAlpha(p.primary, 0.2),
        borderWidth: 1,
        borderColor: p.primary,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
    },
    coinBadgeText: {
        color: p.primary,
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
        backgroundColor: withAlpha(p.primary, 0.12),
        borderColor: p.primary,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    boosterDisabled: {
        opacity: 0.35,
        borderColor: p.textMuted,
        backgroundColor: 'transparent',
    },
    boosterLabel: {
        color: p.text,
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    boosterPrice: {
        color: p.primary,
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 2,
    },
});
