import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from '../themes/decor';
import Icon from './Icon';
import Ornaments from './Ornaments';

export interface DialogButton {
    label: string;
    onPress?: () => void;
    primary?: boolean; // bouton principal (plein) ; sinon bouton discret
}

export interface DialogOptions {
    title: string;
    message?: string;
    icon?: string;                     // icône Font Awesome
    tone?: 'info' | 'danger';          // danger : icône et bordure rouges
    progress?: { current: number; total: number; label?: string }; // jauge (ex. niveau atteint / requis)
    buttons?: DialogButton[];          // par défaut : un seul bouton « Compris »
}

interface ThemedDialogProps {
    options: DialogOptions | null;
    onClose: () => void;
}

// Boîte de dialogue maison (remplace les alertes système), aux couleurs et décorations du thème.
export default function ThemedDialog({ options, onClose }: ThemedDialogProps) {
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const pal = decor.palette;
    const styles = useMemo(() => makeStyles(pal), [pal]);

    if (!options) return null;

    const accent = options.tone === 'danger' ? pal.danger : pal.primary;
    const buttons = options.buttons?.length ? options.buttons : [{ label: t('dialog_ok'), primary: true }];
    const progress = options.progress;
    const ratio = progress ? Math.max(0, Math.min(1, progress.current / Math.max(1, progress.total))) : 0;

    const press = (btn: DialogButton) => {
        onClose();
        btn.onPress?.();
    };

    return (
        <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.card, { borderColor: withAlpha(accent, 0.6) }]} onPress={(e) => e.stopPropagation()}>
                    <Ornaments />

                    <View style={[styles.iconWrap, { backgroundColor: withAlpha(accent, 0.15), borderColor: withAlpha(accent, 0.6) }]}>
                        <Icon name={options.icon ?? 'circle-info'} size={28} color={accent} />
                    </View>

                    <Text style={styles.title}>{options.title}</Text>
                    {!!options.message && <Text style={styles.message}>{options.message}</Text>}

                    {progress && (
                        <View style={styles.progressWrap}>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressFill, { width: `${ratio * 100}%`, backgroundColor: accent }]} />
                            </View>
                            <Text style={styles.progressLabel}>
                                {progress.label ?? `${progress.current} / ${progress.total}`}
                            </Text>
                        </View>
                    )}

                    <View style={styles.actions}>
                        {buttons.map((btn, i) => (
                            <TouchableOpacity
                                key={i}
                                activeOpacity={0.85}
                                style={btn.primary ? [styles.btnPrimary, { backgroundColor: accent }] : styles.btnSecondary}
                                onPress={() => press(btn)}
                            >
                                <Text style={btn.primary ? styles.btnPrimaryText : styles.btnSecondaryText}>{btn.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const makeStyles = (p: ThemePalette) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    card: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: p.bg,
        borderRadius: 24,
        borderWidth: 1.5,
        paddingTop: 28,
        paddingBottom: 22,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: {
        color: p.text,
        fontSize: 19,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        color: p.textMuted,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 16,
    },
    progressWrap: {
        alignSelf: 'stretch',
        alignItems: 'center',
        gap: 6,
        marginBottom: 18,
    },
    progressTrack: {
        alignSelf: 'stretch',
        height: 10,
        borderRadius: 5,
        backgroundColor: withAlpha(p.textMuted, 0.25),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressLabel: {
        color: p.text,
        fontSize: 13,
        fontWeight: '700',
    },
    actions: {
        alignSelf: 'stretch',
        gap: 8,
    },
    btnPrimary: {
        borderRadius: 14,
        paddingVertical: 13,
        alignItems: 'center',
    },
    btnPrimaryText: {
        color: p.onPrimary,
        fontSize: 15,
        fontWeight: '700',
    },
    btnSecondary: {
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
    },
    btnSecondaryText: {
        color: p.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
});
