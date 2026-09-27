import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useGameTheme } from '../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from '../themes/decor';
import Icon from './Icon';

interface AdConfirmModalProps {
    visible: boolean;
    boosterName: string;
    boosterIcon?: string; // nom d'icône Font Awesome
    watched?: number;
    required?: number;
    onCancel: () => void;
    onWatch: () => void;
}

export default function AdConfirmModal({
    visible,
    boosterName,
    boosterIcon = 'star',
    watched = 0,
    required = 1,
    onCancel,
    onWatch,
}: AdConfirmModalProps) {
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const styles = React.useMemo(() => makeStyles(decor.palette), [decor]);
    const isMultiStep = required > 1;
    const currentStep = Math.min(watched + 1, required);

    const title = watched > 0 ? t('ad_encore') : t('ad_indisponible');

    const message = watched > 0
        ? t('ad_plus_une', { name: boosterName })
        : t('ad_pas_pieces', {
            name: boosterName,
            info: isMultiStep
                ? t('ad_multi_videos', { count: required })
                : t('ad_une_video'),
        });

    const watchBtnLabel = isMultiStep
        ? t('ad_regarder_multi', { current: currentStep, total: required })
        : t('ad_regarder');

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={onCancel}>
                <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.iconWrap}>
                        <Icon name={boosterIcon} size={28} color={decor.palette.primary} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {isMultiStep && (
                        <View style={styles.progressRow}>
                            {Array.from({ length: required }).map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.progressDot,
                                        i < watched && styles.progressDotDone,
                                        i === watched && styles.progressDotActive,
                                    ]}
                                />
                            ))}
                            <Text style={styles.progressLabel}>
                                {t('ad_progression', { current: currentStep, total: required })}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.watchBtn} onPress={onWatch} activeOpacity={0.85}>
                        <Icon name="circle-play" size={17} color={decor.palette.onPrimary} />
                        <Text style={styles.watchBtnText}>{watchBtnLabel}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
                        <Text style={styles.cancelBtnText}>{t('ad_annuler')}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

// Couleurs issues de la palette du thème actif
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
        borderColor: withAlpha(p.primary, 0.4),
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
        backgroundColor: withAlpha(p.primary, 0.15),
        borderWidth: 1,
        borderColor: withAlpha(p.primary, 0.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: {
        color: p.text,
        fontSize: 18,
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
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 6,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: withAlpha(p.textMuted, 0.3),
    },
    progressDotDone: { backgroundColor: p.primary },
    progressDotActive: { backgroundColor: withAlpha(p.primary, 0.5) },
    progressLabel: {
        color: p.textMuted,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    watchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: p.primary,
        width: '100%',
        borderRadius: 14,
        paddingVertical: 13,
        marginBottom: 10,
        gap: 8,
    },
    watchBtnText: {
        color: p.onPrimary,
        fontSize: 15,
        fontWeight: '700',
    },
    cancelBtn: {
        width: '100%',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: p.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
});
