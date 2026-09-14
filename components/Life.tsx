import React from 'react';
import { Text, View } from 'react-native';


interface LifeProps {
    active?: boolean;
    styles: any;
}

export default function Life({ active = true, styles = {} }: LifeProps) {
    return (
        <View style={[styles.lifeSlot, active && styles.lifeActive]}>
            {active && <Text style={styles.heartIcon}>♥</Text>}
        </View>
    );
}