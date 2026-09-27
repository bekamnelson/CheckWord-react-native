import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import i18n from '../../i18n';
import { useSound } from '../../contexts/SoundContext';
import Icon, { IconText } from '../../components/Icon';
import Ornaments from './../../components/Ornaments';
import Loader from './../../components/Loader';
import ThemeBackdrop from './../../components/ThemeBackdrop';
import { useGameTheme } from './../../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from './../../themes/decor';

interface PlayerInfo {
    level: number;
    selectedTheme: number;
    game_version: string;
}

const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
];

export default function Settings() {
    const router = useRouter();
    const { t } = useTranslation();
    const { soundEnabled, toggleSound } = useSound();
    const { decor } = useGameTheme();
    const pal = decor.palette;
    const styles = useMemo(() => makeStyles(pal), [pal]);

    const [player, setPlayer] = useState<PlayerInfo>({
        level: 1,
        selectedTheme: 1,
        game_version: '2.1',
    });
    const [currentLang, setCurrentLang] = useState(i18n.language);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try {
                    const savedPlayer = await AsyncStorage.getItem('player');
                    if (savedPlayer) setPlayer(JSON.parse(savedPlayer));
                    const savedLang = await AsyncStorage.getItem('language');
                    if (savedLang) setCurrentLang(savedLang);
                } catch (e) {
                    console.error(e);
                }
            };
            load();
        }, [])
    );

    const handleLanguageChange = async (code: string) => {
        setCurrentLang(code);
        i18n.changeLanguage(code);
        await AsyncStorage.setItem('language', code);
    };


    return (
        <SafeAreaView style={styles.wrap}>
            <ThemeBackdrop />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <IconText icon="arrow-left" textStyle={styles.backText} style={{ justifyContent: 'flex-start' }}>{t('settings_back')}</IconText>
                </TouchableOpacity>
                <IconText icon="gear" textStyle={styles.headerTitle}>{t('settings_title')}</IconText>
                <View style={{ width: 80 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>

                {/* SON */}
                <View style={styles.card}>
                    <Ornaments />

                    <View style={styles.sectionHeader}>
                        <Icon name="music" size={18} color={pal.primary} />
                        <Text style={styles.sectionTitle}>{t('settings_sound')}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>
                            {soundEnabled ? t('settings_sound_on') : t('settings_sound_off')}
                        </Text>
                        <Switch
                            value={soundEnabled}
                            onValueChange={toggleSound}
                            trackColor={{ false: withAlpha(pal.textMuted, 0.4), true: pal.primary }}
                            thumbColor={soundEnabled ? pal.text : pal.textMuted}
                        />
                    </View>
                </View>

                {/* LANGUE */}
                <View style={styles.card}>
                    <Ornaments />

                    <View style={styles.sectionHeader}>
                        <Icon name="globe" size={18} color={pal.primary} />
                        <Text style={styles.sectionTitle}>{t('settings_language')}</Text>
                    </View>

                    <View style={styles.langRow}>
                        {LANGUAGES.map((lang) => {
                            const isActive = currentLang === lang.code;
                            return (
                                <Pressable
                                    key={lang.code}
                                    style={[styles.langBtn, isActive && styles.langBtnActive]}
                                    onPress={() => handleLanguageChange(lang.code)}
                                >
                                    <View style={[styles.codeBadge, isActive && styles.codeBadgeActive]}>
                                        <Text style={styles.codeText}>{lang.code.toUpperCase()}</Text>
                                    </View>
                                    <Text style={[styles.langLabel, isActive && styles.langLabelActive]}>
                                        {lang.label}
                                    </Text>
                                    {isActive && (
                                        <Icon name="circle-check" size={15} color={pal.primary} style={{ marginLeft: 4 }} />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* À PROPOS */}
                <View style={styles.card}>
                    <Ornaments />

                    <View style={styles.sectionHeader}>
                        <Icon name="circle-info" size={18} color={pal.primary} />
                        <Text style={styles.sectionTitle}>{t('settings_about')}</Text>
                    </View>

                    <View style={styles.aboutBlock}>
                        <IconText icon="crown" textStyle={styles.appName}>{t('settings_app_name')}</IconText>
                        <View style={styles.versionRow}>
                            <Text style={styles.versionLabel}>{t('settings_version')}</Text>
                            <Text style={styles.versionValue}>{player.game_version}</Text>
                        </View>
                        <View style={styles.divider} />
                        <Text style={styles.description}>{t('settings_description')}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Écran de chargement : s'efface quand la page est prête */}
            <Loader />
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
        zIndex: 10,
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
        paddingVertical: 20,
        paddingHorizontal: 16,
        gap: 18,
    },
    card: {
        backgroundColor: p.panel,
        borderRadius: 12,
        padding: 18,
        position: 'relative',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        color: p.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLabel: {
        color: p.text,
        fontSize: 15,
    },
    langRow: {
        gap: 10,
    },
    langBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: p.panelBorder,
        backgroundColor: withAlpha(p.primary, 0.05),
        gap: 6,
    },
    langBtnActive: {
        borderColor: p.primary,
        backgroundColor: withAlpha(p.primary, 0.15),
    },
    codeBadge: {
        backgroundColor: withAlpha(p.textMuted, 0.4),
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 1,
    },
    codeBadgeActive: {
        backgroundColor: p.primary,
    },
    codeText: {
        color: p.onPrimary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    langLabel: {
        color: p.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    langLabelActive: {
        color: p.primary,
    },
    aboutBlock: {
        gap: 10,
    },
    appName: {
        color: p.primary,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    versionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    versionLabel: {
        color: p.textMuted,
        fontSize: 14,
    },
    versionValue: {
        color: p.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: withAlpha(p.primary, 0.3),
        marginVertical: 4,
    },
    description: {
        color: p.textMuted,
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
    },
});
