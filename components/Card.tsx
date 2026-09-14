import React from 'react';
import {
    ImageBackground,
    Pressable,
    Text,
    View,
} from 'react-native';
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
                <View style={styles.cardOverlay}>
                    {!isUnlocked ? (
                        <>
                            <Text style={styles.lockIcon}>🔒</Text>
                            <Text style={styles.themeName}>Niv. {reqLevel}</Text>
                        </>
                    ) : (
                        <Text style={styles.themeName}>{name}</Text>
                    )}
                </View>
            </ImageBackground>
        </Pressable>
    );
}