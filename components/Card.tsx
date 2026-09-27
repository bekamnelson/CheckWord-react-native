import React from 'react';
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { DECORS } from '../themes/decor';
import Icon from './Icon';
import { THEMES } from './themeRegistry';

interface CardProps {
    plan: number;
    isUnlocked: boolean;
    reqLevel: number;
    isSelected: boolean;
    name: string;
    styles: Record<string, any>;
    handleClick: (plan: number, reqLevel: number) => void;
}

export default function Card({
    plan,
    isUnlocked,
    reqLevel,
    isSelected,
    name,
    styles,
    handleClick,
}: CardProps) {
    const cardTheme = THEMES[plan] || THEMES[1];
    // Aperçu de l'identité du thème : son emblème et son symbole de vie
    const decor = DECORS[plan] || DECORS[1];

    return (
        <Pressable
            style={({ pressed }) => [
                styles.themeCard,
                !isUnlocked && styles.locked,
                isSelected && styles.selected,
                pressed && { transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => handleClick(plan, reqLevel)}
        >
            <ImageBackground
                source={cardTheme.backgroundImage}
                style={styles.bgImage}
                resizeMode="cover"
            >
                <View style={local.preview}>
                    <View style={[local.emblem, { borderColor: decor.palette.primary }]}>
                        <Icon name={decor.icons.title} size={16} color={decor.palette.primary} />
                    </View>
                    {isSelected && (
                        <View style={[local.check, { backgroundColor: decor.palette.primary }]}>
                            <Icon name="check" size={11} color={decor.palette.onPrimary} />
                        </View>
                    )}
                </View>

                <View style={styles.cardOverlay}>
                    {!isUnlocked ? (
                        <>
                            <Icon name="lock" size={32} style={styles.lockIcon} />
                            <Text style={styles.themeName}>Niv. {reqLevel}</Text>
                        </>
                    ) : (
                        <>
                            <View style={local.lives}>
                                {[0, 1, 2].map((i) => (
                                    <Icon key={i} name={decor.icons.life} size={13} color={decor.icons.lifeColor} />
                                ))}
                            </View>
                            <Text style={styles.themeName}>{name}</Text>
                        </>
                    )}
                </View>
            </ImageBackground>
        </Pressable>
    );
}

const local = StyleSheet.create({
    preview: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 2,
    },
    emblem: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1.5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    check: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lives: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 6,
    },
});
