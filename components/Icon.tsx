import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
}

// Icône Font Awesome 6 (style plein), utilisée à la place des emojis dans tout le jeu.
export default function Icon({ name, size = 16, color = '#ffffff', style }: IconProps) {
    return <FontAwesome6 name={name} size={size} color={color} solid style={style} />;
}

interface IconTextProps {
    icon: string;
    children: React.ReactNode;
    textStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    iconColor?: string;
    iconSize?: number;
    gap?: number;
}

// Icône + texte sur une ligne. Par défaut l'icône reprend la couleur et la taille du texte.
export function IconText({ icon, children, textStyle, style, iconColor, iconSize, gap = 8 }: IconTextProps) {
    const flat = StyleSheet.flatten(textStyle) || {};
    return (
        <View style={[styles.row, { gap }, style]}>
            <Icon
                name={icon}
                size={iconSize ?? (typeof flat.fontSize === 'number' ? flat.fontSize : 16)}
                color={iconColor ?? (typeof flat.color === 'string' ? flat.color : '#ffffff')}
            />
            <Text style={textStyle}>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
