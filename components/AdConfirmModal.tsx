import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AdConfirmModalProps {
    visible: boolean;
    boosterName: string;
    boosterIcon?: string;
    /** Nombre de vidéos déjà regardées pour cette demande (0-indexé) */
    watched?: number;
    /** Nombre total de vidéos nécessaires pour débloquer le booster */
    required?: number;
    onCancel: () => void;
    onWatch: () => void;
}

export default function AdConfirmModal({
    visible,
    boosterName,
    boosterIcon = '⭐',
    watched = 0,
    required = 1,
    onCancel,
    onWatch,
}: AdConfirmModalProps) {
    const isMultiStep = required > 1;
    const currentStep = Math.min(watched + 1, required);

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
                    {/* Badge icône */}
                    <View style={styles.iconWrap}>
                        <Text style={styles.iconEmoji}>{boosterIcon}</Text>
                    </View>

                    <Text style={styles.title}>
                        {watched > 0 ? 'Encore une vidéo !' : 'Booster indisponible'}
                    </Text>

                    <Text style={styles.message}>
                        {watched > 0 ? (
                            <>
                                Plus qu'une vidéo pour débloquer{' '}
                                <Text style={styles.boosterName}>« {boosterName} »</Text> !
                            </>
                        ) : (
                            <>
                                Vous n'avez pas assez de pièces pour utiliser{' '}
                                <Text style={styles.boosterName}>« {boosterName} »</Text>.
                                {'\n'}
                                {isMultiStep
                                    ? `Regardez ${required} courtes vidéos pour l'obtenir gratuitement !`
                                    : "Regardez une courte vidéo pour l'obtenir gratuitement !"}
                            </>
                        )}
                    </Text>

                    {/* Indicateur de progression (uniquement si plusieurs vidéos requises) */}
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
                                Vidéo {currentStep}/{required}
                            </Text>
                        </View>
                    )}

                    {/* Bouton principal : regarder la pub */}
                    <TouchableOpacity
                        style={styles.watchBtn}
                        onPress={onWatch}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.watchBtnIcon}>🎬</Text>
                        <Text style={styles.watchBtnText}>
                            {isMultiStep
                                ? `Regarder la vidéo ${currentStep}/${required}`
                                : 'Regarder la pub'}
                        </Text>
                    </TouchableOpacity>

                    {/* Bouton secondaire : annuler */}
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onCancel}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelBtnText}>Annuler</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const GOLD = '#f0c040';

const styles = StyleSheet.create({
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
        backgroundColor: '#1c1c24',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(240, 192, 64, 0.4)',
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
        backgroundColor: 'rgba(240, 192, 64, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(240, 192, 64, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    iconEmoji: {
        fontSize: 30,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 16,
    },
    boosterName: {
        color: GOLD,
        fontWeight: '700',
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
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    progressDotDone: {
        backgroundColor: GOLD,
    },
    progressDotActive: {
        backgroundColor: 'rgba(240, 192, 64, 0.5)',
    },
    progressLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    watchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: GOLD,
        width: '100%',
        borderRadius: 14,
        paddingVertical: 13,
        marginBottom: 10,
        gap: 8,
    },
    watchBtnIcon: {
        fontSize: 17,
    },
    watchBtnText: {
        color: '#1c1c24',
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
        color: 'rgba(255, 255, 255, 0.55)',
        fontSize: 14,
        fontWeight: '600',
    },
});
