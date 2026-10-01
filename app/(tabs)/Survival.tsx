import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AdEventType, InterstitialAd, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

import DifficultyBadge, { DIFFICULTY_BADGE_SPACE, borderTopOf } from './../../components/DifficultyBadge';
import { IconText } from './../../components/Icon';
import Keyboard from './../../components/Keyboard';
import Letter from './../../components/Letter';
import Loader from './../../components/Loader';
import Ornaments from './../../components/Ornaments';
import SecondChanceModal from './../../components/SecondChanceModal';
import { useDialog } from './../../contexts/DialogContext';
import ThemeBackdrop from './../../components/ThemeBackdrop';
import { useGameTheme } from './../../contexts/GameThemeContext';
import listWordDe from './../../JSON/liste_mot_de.json';
import listWordEn from './../../JSON/liste_mot_en.json';
import listWordEs from './../../JSON/liste_mot_es.json';
import listWordFr from './../../JSON/liste_mot_fr.json';
import { ThemePalette, withAlpha } from './../../themes/decor';
import { tierFor } from './../../utils/difficulty';
import { formatTime, saveBestDuration, saveScore } from './../../utils/survivalScores';
import { SURVIVAL_THEMES, survivalThemesUnlockedBetween } from './../../components/themeRegistry';

interface WordEntry {
    word: string;
    indice: string;
    difficulte: string;
}

const WORD_LISTS: Record<string, WordEntry[]> = { fr: listWordFr, en: listWordEn, es: listWordEs, de: listWordDe };

// Règles du mode survie
const START_SECONDS = 120;
const BONUS_SECONDS = 30;
const PENALTY_SECONDS = 5;
const LOW_TIME_SECONDS = 20;
const NEXT_WORD_DELAY_MS = 700;
// Dernière chance (une fois par partie) : une vidéo contre du temps et des lettres
const CHANCE_SECONDS = 30;
const CHANCE_LETTERS = 2;

const IS_CLOSED_TESTING = false;
const interstitialAdUnitId = (__DEV__ || IS_CLOSED_TESTING)
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-5542646175321041/9569611051';
const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId);
const rewardedAdUnitId = (__DEV__ || IS_CLOSED_TESTING)
    ? TestIds.REWARDED
    : 'ca-app-pub-5542646175321041/1438900243';
const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId);

type Phase = 'ready' | 'playing' | 'over';

interface RunResult {
    id: string;
    wordsFound: number;
    duration: number;
    rank: number | null;
    unlockedThemes: string[]; // thèmes débloqués par cette partie
    nextThemeAt: number | null; // meilleur temps à atteindre pour le prochain thème (secondes)
}

export default function Survival() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const lang = WORD_LISTS[i18n.language?.slice(0, 2)] ? i18n.language.slice(0, 2) : 'fr';
    const listWord = WORD_LISTS[lang];

    // Mots regroupés par difficulté, une seule fois par langue
    const buckets = useMemo(() => {
        const b: Record<string, number[]> = {};
        listWord.forEach((w, i) => (b[w.difficulte] ??= []).push(i));
        return b;
    }, [listWord]);

    const { theme: activeTheme, decor, setThemeId } = useGameTheme();
    const { showDialog } = useDialog();
    const pal = decor.palette;
    const local = useMemo(() => makeLocal(pal), [pal]);
    const [phase, setPhase] = useState<Phase>('ready');
    const [timeLeft, setTimeLeft] = useState(START_SECONDS);
    const [wordIndex, setWordIndex] = useState(0);
    const [checkWord, setCheckWord] = useState<string[]>([]);
    const [trouve, setTrouve] = useState<string[]>([]);
    const [wordsFound, setWordsFound] = useState(0);
    const [result, setResult] = useState<RunResult | null>(null);
    const [flash, setFlash] = useState<{ text: string; good: boolean; key: number } | null>(null);
    const [chance, setChance] = useState<'available' | 'offered' | 'watching' | 'used'>('available');
    const chanceRef = useRef<'available' | 'offered' | 'watching' | 'used'>('available');
    const pausedAtRef = useRef(0); // début de la pause « Dernière chance » (exclue de la durée de survie)

    const deadlineRef = useRef(0);
    const startRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const nextWordTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const usedRef = useRef<Set<number>>(new Set());
    const endedRef = useRef(false);
    const busyRef = useRef(false); // vrai pendant la courte pause après un mot trouvé
    const wordsFoundRef = useRef(0);
    // Lettres trouvées, toujours à jour : deux touches tapées très vite ne s'écrasent pas
    const trouveRef = useRef<string[]>([]);
    const checkWordRef = useRef<string[]>([]);
    const flashAnim = useRef(new Animated.Value(0)).current;
    // Ref (et non state) : endRun est appelé depuis le setInterval et doit lire la valeur à jour
    const adLoadedRef = useRef(false);

    useEffect(() => {
        const unsubLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            adLoadedRef.current = true;
        });
        const unsubClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            adLoadedRef.current = false;
            interstitial.load();
        });
        const unsubError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
            adLoadedRef.current = false;
        });
        const unsubRewardedClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => rewarded.load());
        interstitial.load();
        rewarded.load();
        return () => {
            unsubLoaded();
            unsubClosed();
            unsubError();
            unsubRewardedClosed();
        };
    }, []);

    const setChanceState = (c: 'available' | 'offered' | 'watching' | 'used') => {
        chanceRef.current = c;
        setChance(c);
    };

    const stopTimers = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (nextWordTimeout.current) clearTimeout(nextWordTimeout.current);
        intervalRef.current = null;
        nextWordTimeout.current = null;
    };

    useFocusEffect(
        useCallback(() => {
            // Quitter l'écran en pleine partie l'abandonne (elle n'est pas classée)
            return () => {
                stopTimers();
                if (!endedRef.current) setPhase('ready');
            };
        }, [])
    );

    const showFlash = (text: string, good: boolean) => {
        setFlash({ text, good, key: Date.now() });
        flashAnim.setValue(1);
        Animated.timing(flashAnim, { toValue: 0, duration: 900, useNativeDriver: true }).start();
    };

    const pickWord = () => {
        const tier = buckets[tierFor(wordsFoundRef.current)] ?? [];
        let pool = tier.filter((i) => !usedRef.current.has(i));
        if (pool.length === 0) pool = listWord.map((_, i) => i).filter((i) => !usedRef.current.has(i));
        if (pool.length === 0) {
            usedRef.current.clear();
            pool = listWord.map((_, i) => i);
        }
        const next = pool[Math.floor(Math.random() * pool.length)];
        usedRef.current.add(next);
        const letters = listWord[next].word.split('');
        setWordIndex(next);
        checkWordRef.current = letters;
        trouveRef.current = Array(letters.length).fill('');
        setCheckWord(letters);
        setTrouve(trouveRef.current);
        busyRef.current = false;
    };

    const endRun = async () => {
        if (endedRef.current) return;
        endedRef.current = true;
        stopTimers();
        setTimeLeft(0);

        const attempt = {
            id: `${Date.now()}`,
            wordsFound: wordsFoundRef.current,
            duration: Math.round((Date.now() - startRef.current) / 1000),
            lang,
            date: Date.now(),
        };
        const rank = await saveScore(attempt);

        // Thèmes débloqués par le meilleur temps de survie (le dernier débloqué est appliqué)
        const { before, after } = await saveBestDuration(attempt.duration);
        const unlocked = survivalThemesUnlockedBetween(before, after);
        if (unlocked.length > 0) await setThemeId(unlocked[unlocked.length - 1].id);
        const next = SURVIVAL_THEMES.find((th) => th.reqSurvival! > after);

        setResult({
            id: attempt.id,
            wordsFound: attempt.wordsFound,
            duration: attempt.duration,
            rank,
            unlockedThemes: unlocked.map((th) => th.name),
            nextThemeAt: next ? next.reqSurvival! : null,
        });
        setPhase('over');

        // Publicité de fin de partie
        if (adLoadedRef.current || interstitial.loaded) interstitial.show();
        else interstitial.load();
    };

    const tick = () => {
        const remaining = (deadlineRef.current - Date.now()) / 1000;
        setTimeLeft(Math.max(0, remaining));
        if (remaining > 0) return;
        if (chanceRef.current === 'available') {
            // Temps écoulé : on fige la partie et on propose la Dernière chance
            stopTimers();
            pausedAtRef.current = Date.now();
            setChanceState('offered');
        } else if (chanceRef.current === 'used') {
            endRun();
        }
    };

    // Reprend le chrono en ignorant la durée de la pause
    const resumeAfterPause = (extraSeconds: number) => {
        const pause = Date.now() - pausedAtRef.current;
        startRef.current += pause;
        deadlineRef.current = Date.now() + extraSeconds * 1000;
        setTimeLeft(extraSeconds);
        intervalRef.current = setInterval(tick, 200);
    };

    // Vidéo regardée : +30 s et 2 lettres du mot en cours (sans jamais le terminer)
    const applyChance = () => {
        const word = checkWordRef.current;
        const found = trouveRef.current;
        const hidden = [...new Set(word.filter((l, i) => found[i] === ''))].sort(() => Math.random() - 0.5);
        const picked = hidden.slice(0, Math.max(0, Math.min(CHANCE_LETTERS, hidden.length - 1)));
        const next = found.map((v, i) => (v === '' && picked.includes(word[i]) ? word[i] : v));
        trouveRef.current = next;
        setTrouve(next);
        setChanceState('used');
        showFlash(`+${CHANCE_SECONDS}s`, true);
        resumeAfterPause(CHANCE_SECONDS);
    };

    const handleChanceWatch = () => {
        if (!rewarded.loaded) {
            showDialog({ title: t('game_video_indispo_titre'), message: t('game_video_indispo_msg'), icon: 'clapperboard' });
            rewarded.load();
            return;
        }
        setChanceState('watching');
        let earned = false;
        const unsubEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
            earned = true;
        });
        const unsubClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
            unsubEarned();
            unsubClosed();
            if (earned) applyChance();
            else setChanceState('offered'); // vidéo fermée trop tôt : l'offre reste affichée
        });
        rewarded.show();
    };

    const handleChanceGiveUp = () => {
        if (chanceRef.current !== 'offered') return;
        startRef.current += Date.now() - pausedAtRef.current; // la pause ne compte pas
        setChanceState('used');
        endRun();
    };

    const adjustTime = (seconds: number) => {
        deadlineRef.current += seconds * 1000;
        tick();
    };

    const startRun = () => {
        stopTimers();
        usedRef.current.clear();
        endedRef.current = false;
        setChanceState('available');
        wordsFoundRef.current = 0;
        setWordsFound(0);
        setResult(null);
        pickWord();
        startRef.current = Date.now();
        deadlineRef.current = startRef.current + START_SECONDS * 1000;
        setTimeLeft(START_SECONDS);
        setPhase('playing');
        intervalRef.current = setInterval(tick, 200);
    };

    const handleLetterClick = (lettre: string) => {
        if (phase !== 'playing' || busyRef.current || endedRef.current || chanceRef.current === 'offered' || chanceRef.current === 'watching') return;

        const current = trouveRef.current;
        const pos = checkWordRef.current.findIndex((l, i) => l === lettre && current[i] === '');
        if (pos === -1) {
            showFlash(`-${PENALTY_SECONDS}s`, false);
            adjustTime(-PENALTY_SECONDS);
            return;
        }

        const next = [...current];
        next[pos] = lettre;
        trouveRef.current = next;
        setTrouve(next);

        if (next.every((l) => l !== '')) {
            busyRef.current = true;
            wordsFoundRef.current += 1;
            setWordsFound(wordsFoundRef.current);
            showFlash(`+${BONUS_SECONDS}s`, true);
            adjustTime(BONUS_SECONDS);
            nextWordTimeout.current = setTimeout(pickWord, NEXT_WORD_DELAY_MS);
        }
    };

    const styles = activeTheme.gameStyles;
    const lowTime = phase === 'playing' && timeLeft <= LOW_TIME_SECONDS;

    const rankLabel = (rank: number | null) =>
        rank === null ? t('survie_hors_classement') : rank === 1 ? t('survie_record') : t('survie_rang', { rank });

    return (
        <SafeAreaView style={styles.gameWrap}>
            <ThemeBackdrop />

            <View style={styles.gameHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <IconText icon="arrow-left" textStyle={styles.backBtnText}>{t('retour')}</IconText>
                </TouchableOpacity>
                <View style={styles.levelIndicator}>
                    <IconText icon="stopwatch" textStyle={styles.levelIndicatorText} gap={6}>{t('survie_titre')}</IconText>
                </View>
                <View style={local.scoreBadge}>
                    <IconText icon="check" textStyle={local.scoreBadgeText} gap={6}>{wordsFound}</IconText>
                </View>
            </View>

            {phase === 'ready' && (
                <View style={local.center}>
                    <View style={local.card}>
                        <IconText icon="stopwatch" textStyle={local.cardTitle} style={local.titleRow}>{t('survie_titre')}</IconText>
                        <IconText icon="clock" iconColor={pal.primary} textStyle={local.rule} style={local.ruleRow}>{t('survie_regle_depart', { time: formatTime(START_SECONDS) })}</IconText>
                        <IconText icon="circle-check" iconColor={pal.success} textStyle={local.rule} style={local.ruleRow}>{t('survie_regle_bonus', { s: BONUS_SECONDS })}</IconText>
                        <IconText icon="circle-xmark" iconColor={pal.danger} textStyle={local.rule} style={local.ruleRow}>{t('survie_regle_malus', { s: PENALTY_SECONDS })}</IconText>
                        <IconText icon="arrow-trend-up" iconColor={pal.accent} textStyle={local.rule} style={local.ruleRow}>{t('survie_regle_difficulte')}</IconText>
                        <IconText icon="palette" iconColor={pal.primary} textStyle={local.rule} style={local.ruleRow}>{t('survie_regle_themes')}</IconText>
                        <Pressable style={local.primaryBtn} onPress={startRun}>
                            <Text style={local.primaryBtnText}>{t('survie_commencer')}</Text>
                        </Pressable>
                        <Pressable style={local.secondaryBtn} onPress={() => router.push('/Leaderboard')}>
                            <IconText icon="ranking-star" textStyle={local.secondaryBtnText}>{t('survie_classement')}</IconText>
                        </Pressable>
                    </View>
                </View>
            )}

            {phase !== 'ready' && checkWord.length > 0 && (
                <ScrollView contentContainerStyle={local.scroll} showsVerticalScrollIndicator={false} bounces={false}>
                    <View style={local.timerRow}>
                        <Text style={[local.timer, lowTime && local.timerLow]}>{formatTime(timeLeft)}</Text>
                        {flash && (
                            <Animated.Text
                                key={flash.key}
                                style={[
                                    local.flash,
                                    { color: flash.good ? pal.success : pal.danger },
                                    {
                                        opacity: flashAnim,
                                        transform: [{
                                            translateY: flashAnim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }),
                                        }],
                                    },
                                ]}
                            >
                                {flash.text}
                            </Animated.Text>
                        )}
                    </View>

                    <View style={styles.bigcontainer}>
                        <Ornaments />

                        <View style={styles.container}>
                            <View style={[styles.description, local.tight, local.hintWithBadge]}>
                                <DifficultyBadge
                                    level={listWord[wordIndex]?.difficulte}
                                    borderTopWidth={borderTopOf(styles.description)}
                                />
                                <Text style={styles.contenuedescription}>{listWord[wordIndex]?.indice}</Text>
                            </View>

                            <View style={[styles.game, local.tight]}>
                                {trouve.map((item, i) => (
                                    <Letter key={i} letter={item} styles={styles} />
                                ))}
                            </View>

                            <Keyboard onLetterClick={handleLetterClick} styles={styles} />
                        </View>
                    </View>
                </ScrollView>
            )}

            {phase === 'over' && result && (
                <View style={local.modalOverlay}>
                    <View style={local.card}>
                        <IconText icon="hourglass-end" textStyle={local.cardTitle} style={local.titleRow}>{t('survie_fin')}</IconText>
                        {listWord[wordIndex] && trouve.some((l) => l === '') && (
                            <Text style={local.rule}>
                                {t('boite_mot_cache')} <Text style={local.gold}>{checkWord.join('')}</Text>
                            </Text>
                        )}
                        <View style={local.statsRow}>
                            <View style={local.stat}>
                                <Text style={local.statValue}>{result.wordsFound}</Text>
                                <Text style={local.statLabel}>{t('survie_mots')}</Text>
                            </View>
                            <View style={local.stat}>
                                <Text style={local.statValue}>{formatTime(result.duration)}</Text>
                                <Text style={local.statLabel}>{t('survie_duree')}</Text>
                            </View>
                        </View>
                        <IconText
                            icon={result.rank === 1 ? 'medal' : result.rank ? 'ranking-star' : 'rotate-right'}
                            textStyle={[local.rank, result.rank === 1 && local.gold]}
                        >
                            {rankLabel(result.rank)}
                        </IconText>

                        {result.unlockedThemes.map((name) => (
                            <View key={name} style={local.unlockBox}>
                                <IconText icon="palette" iconColor={pal.primary} textStyle={local.unlockTitle}>
                                    {t('boite_theme_debloque', { name })}
                                </IconText>
                            </View>
                        ))}
                        {result.nextThemeAt !== null && (
                            <IconText icon="lock" iconColor={pal.textMuted} textStyle={local.nextTheme} style={local.nextThemeRow}>
                                {t('survie_prochain_theme', { time: formatTime(result.nextThemeAt) })}
                            </IconText>
                        )}

                        <Pressable style={local.primaryBtn} onPress={startRun}>
                            <Text style={local.primaryBtnText}>{t('survie_rejouer')}</Text>
                        </Pressable>
                        <Pressable
                            style={local.secondaryBtn}
                            onPress={() => router.push({ pathname: '/Leaderboard', params: { highlight: result.id } })}
                        >
                            <IconText icon="ranking-star" textStyle={local.secondaryBtnText}>{t('survie_classement')}</IconText>
                        </Pressable>
                        <Pressable style={local.secondaryBtn} onPress={() => router.back()}>
                            <Text style={local.secondaryBtnText}>{t('boite_retour')}</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            <SecondChanceModal
                visible={phase === 'playing' && (chance === 'offered' || chance === 'watching')}
                paused={chance === 'watching'}
                message={t('chance_msg_survie')}
                rewards={[
                    { icon: 'stopwatch', color: pal.success, label: t('chance_secondes', { count: CHANCE_SECONDS }) },
                    { icon: 'lightbulb', label: t('chance_lettres', { count: CHANCE_LETTERS }) },
                ]}
                onWatch={handleChanceWatch}
                onGiveUp={handleChanceGiveUp}
            />

            {/* Écran de chargement : s'efface quand la page est prête */}
            <Loader />
        </SafeAreaView>
    );
}

// Styles calculés à partir de la palette du thème actif
const makeLocal = (p: ThemePalette) => StyleSheet.create({
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 12,
    },
    // Marges réduites pour laisser de la place au grand clavier
    tight: {
        marginBottom: 16,
    },
    hintWithBadge: {
        marginTop: DIFFICULTY_BADGE_SPACE,
        paddingTop: DIFFICULTY_BADGE_SPACE + 6,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: withAlpha(p.bg, 0.85),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 20,
    },
    card: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: p.bg,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: p.panelBorder,
        paddingVertical: 26,
        paddingHorizontal: 22,
        alignItems: 'center',
    },
    cardTitle: {
        color: p.primary,
        fontSize: 22,
        fontWeight: 'bold',
    },
    titleRow: {
        marginBottom: 16,
    },
    ruleRow: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        marginBottom: 6,
    },
    rule: {
        flexShrink: 1,
        color: p.text,
        fontSize: 14,
        lineHeight: 20,
    },
    gold: {
        color: p.primary,
        fontWeight: 'bold',
    },
    primaryBtn: {
        width: '100%',
        backgroundColor: p.primary,
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 18,
    },
    primaryBtnText: {
        color: p.onPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryBtn: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: withAlpha(p.primary, 0.5),
        paddingVertical: 11,
        alignItems: 'center',
        marginTop: 10,
    },
    secondaryBtnText: {
        color: p.primary,

        fontSize: 15,
        fontWeight: '600',
    },
    scoreBadge: {
        backgroundColor: withAlpha(p.success, 0.2),
        borderWidth: 1,
        borderColor: p.success,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
    },
    scoreBadgeText: {
        color: p.success,
        fontWeight: 'bold',
        fontSize: 14,
    },
    timerRow: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    timer: {
        color: p.text,
        fontSize: 40,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
        textShadowColor: p.bg,
        textShadowRadius: 6,
    },
    timerLow: {
        color: p.danger,
    },
    flash: {
        position: 'absolute',
        right: '18%',
        fontSize: 22,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 14,
        marginTop: 10,
        marginBottom: 12,
    },
    stat: {
        flex: 1,
        backgroundColor: withAlpha(p.primary, 0.1),
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    statValue: {
        color: p.text,
        fontSize: 26,
        fontWeight: 'bold',
    },
    statLabel: {
        color: p.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    unlockBox: {
        alignSelf: 'stretch',
        backgroundColor: withAlpha(p.primary, 0.12),
        borderWidth: 1,
        borderColor: withAlpha(p.primary, 0.6),
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 12,
    },
    unlockTitle: {
        color: p.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
    nextThemeRow: {
        marginTop: 10,
    },
    nextTheme: {
        color: p.textMuted,
        fontSize: 13,
    },
    rank: {
        color: p.text,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
});
