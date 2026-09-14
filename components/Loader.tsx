import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

interface LoaderProps {
    label?: string;
}

export default function Loader({ label = 'loading ...' }: LoaderProps) {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        animation.start();

        return () => animation.stop();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={loaderStyles.container}>
            <Animated.View style={[loaderStyles.spinner, { transform: [{ rotate: spin }] }]} />
            <Text style={loaderStyles.text}>{label}</Text>
        </View>
    );
}

const loaderStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        width: '100%',
        height: '100%',
    },
    spinner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderTopColor: '#f8fafc',
    },
    text: {
        marginTop: 24,
        fontSize: 16,
        letterSpacing: 3,
        color: '#f8fafc',
        textTransform: 'uppercase',
    },
});