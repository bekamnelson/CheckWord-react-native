import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import i18n from '../i18n';
import Icon from './Icon';
import { useGameTheme } from '../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from '../themes/decor';
import Ornaments from './Ornaments';
import ThemeBackdrop from './ThemeBackdrop';

const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
];

interface LanguagePickerProps {
    visible: boolean;
    onDone: () => void;
}

// Écran affiché au tout premier lancement : aucune langue n'est encore enregistrée,
// donc les textes sont bilingues et le choix est obligatoire (pas de fermeture possible).
export default function LanguagePicker({ visible, onDone }: LanguagePickerProps) {
    const { decor } = useGameTheme();
    const pal = decor.palette;
    const styles = useMemo(() => makeStyles(pal), [pal]);
    const choose = async (code: string) => {
        await i18n.changeLanguage(code);
        try {
            await AsyncStorage.setItem('language', code);
        } catch (e) {
            console.error('Erreur de sauvegarde de la langue :', e);
        }
        onDone();
    };

    return (
        <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
            <View style={styles.bg}>
                <ThemeBackdrop />

                <View style={styles.card}>
                    <Ornaments />

                    <View style={styles.logoRow}>
                        <Icon name={decor.icons.title} size={20} color={pal.primary} />
                        <Text style={styles.logo}>CheckWord</Text>
                        <Icon name={decor.icons.title} size={20} color={pal.primary} />
                    </View>
                    <Text style={styles.title}>Choisissez votre langue</Text>
                    <Text style={styles.subtitle}>Choose your language · Elige tu idioma · Wähle deine Sprache</Text>

                    {LANGUAGES.map((lang) => (
                        <Pressable
                            key={lang.code}
                            style={({ pressed }) => [styles.langBtn, pressed && styles.langBtnPressed]}
                            onPress={() => choose(lang.code)}
                        >
                            <View style={styles.codeBadge}>
                                <Text style={styles.codeText}>{lang.code.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.label}>{lang.label}</Text>
                        </Pressable>
                    ))}

                    <Text style={styles.hint}>
                        Modifiable dans les réglages · Can be changed in settings · Se puede cambiar en los ajustes · In den Einstellungen änderbar
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

// Styles calculés à partir de la palette du thème actif
const makeStyles = (p: ThemePalette) => StyleSheet.create({
    bg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: p.bg,
    },
    card: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: p.panel,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: withAlpha(p.primary, 0.4),
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    logo: {
        color: p.primary,
        fontSize: 26,
        fontWeight: 'bold',
    },
    title: {
        color: p.text,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: p.textMuted,
        fontSize: 15,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
    langBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        marginBottom: 12,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: p.primary,
        backgroundColor: withAlpha(p.primary, 0.1),
    },
    langBtnPressed: {
        backgroundColor: withAlpha(p.primary, 0.3),
    },
    codeBadge: {
        backgroundColor: p.primary,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    codeText: {
        color: p.onPrimary,
        fontSize: 13,
        fontWeight: 'bold',
    },
    label: {
        color: p.primary,
        fontSize: 17,
        fontWeight: 'bold',
    },
    hint: {
        color: p.textMuted,
        fontSize: 11,
        textAlign: 'center',
        marginTop: 12,
    },
});
