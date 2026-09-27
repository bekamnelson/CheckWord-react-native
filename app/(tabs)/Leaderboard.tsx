import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Icon, { IconText } from './../../components/Icon';
import Ornaments from './../../components/Ornaments';
import ThemeBackdrop from './../../components/ThemeBackdrop';
import { useGameTheme } from './../../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from './../../themes/decor';
import { formatTime, loadScores, MAX_SCORES, SurvivalAttempt } from './../../utils/survivalScores';

// Or, argent, bronze pour le podium
const MEDAL_COLORS = ['#f5c542', '#c0c0c0', '#cd7f32'];

export default function Leaderboard() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { highlight } = useLocalSearchParams<{ highlight?: string }>();

    const [scores, setScores] = useState<SurvivalAttempt[]>([]);
    const { decor } = useGameTheme();
    const pal = decor.palette;
    const styles = useMemo(() => makeStyles(pal), [pal]);

    useFocusEffect(
        useCallback(() => {
            loadScores().then(setScores);
        }, [])
    );

    const formatDate = (ts: number) =>
        new Date(ts).toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit', year: '2-digit' });

    return (
        <SafeAreaView style={styles.wrap}>
            <ThemeBackdrop />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <IconText icon="arrow-left" textStyle={styles.backText} style={{ justifyContent: 'flex-start' }}>{t('retour')}</IconText>
                </TouchableOpacity>
                <IconText icon="ranking-star" textStyle={styles.headerTitle}>{t('survie_classement')}</IconText>
                <View style={{ width: 80 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.subtitle}>{t('survie_classement_sous_titre', { count: MAX_SCORES })}</Text>

                {scores.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>{t('survie_classement_vide')}</Text>
                    </View>
                ) : (
                    scores.map((s, i) => {
                        const isNew = s.id === highlight;
                        return (
                            <View key={s.id} style={[styles.row, i < 3 && styles.rowTop, isNew && styles.rowNew]}>
                                <View style={styles.rankCell}>
                                    {i < 3 ? (
                                        <Icon name="medal" size={24} color={MEDAL_COLORS[i]} />
                                    ) : (
                                        <Text style={styles.rank}>{i + 1}</Text>
                                    )}
                                </View>
                                <View style={styles.main}>
                                    <Text style={styles.words}>
                                        {t('survie_mots_count', { count: s.wordsFound })}
                                    </Text>
                                    <IconText icon="stopwatch" textStyle={styles.meta} gap={5} style={{ justifyContent: 'flex-start' }}>
                                        {formatTime(s.duration)} · {s.lang.toUpperCase()} · {formatDate(s.date)}
                                    </IconText>
                                </View>
                                {isNew && <Text style={styles.newTag}>{t('survie_nouveau')}</Text>}
                            </View>
                        );
                    })
                )}

                <Pressable style={styles.playBtn} onPress={() => router.dismissTo('/Survival')}>
                    <IconText icon="stopwatch" textStyle={styles.playBtnText}>{t('survie_jouer')}</IconText>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles calculés à partir de la palette du thème actif
const makeStyles = (p: ThemePalette) => StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: p.bg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    backBtn: {
        padding: 8,
        width: 80,
    },
    backText: {
        color: p.text,
        fontSize: 15,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: p.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        gap: 10,
    },
    subtitle: {
        color: p.textMuted,
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 6,
    },
    empty: {
        backgroundColor: p.panel,
        borderRadius: 12,
        padding: 24,
    },
    emptyText: {
        color: p.textMuted,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: p.panel,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: p.panelBorder,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 12,
    },
    rowTop: {
        borderColor: withAlpha(p.primary, 0.5),
        backgroundColor: withAlpha(p.primary, 0.08),
    },
    rowNew: {
        borderColor: p.success,
        borderWidth: 2,
    },
    rankCell: {
        width: 34,
        alignItems: 'center',
    },
    rank: {
        color: p.text,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    main: {
        flex: 1,
    },
    words: {
        color: p.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    meta: {
        color: p.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    newTag: {
        color: p.success,
        fontSize: 11,
        fontWeight: 'bold',
    },
    playBtn: {
        backgroundColor: p.primary,
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 14,
    },
    playBtnText: {
        color: p.onPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
