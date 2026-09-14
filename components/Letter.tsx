import React from 'react';
import { Text, View } from 'react-native';


interface LetterProps {
    letter?: string;
    styles: any;
}

export default function Letter({ letter = '', styles = {} }: LetterProps) {
    return (
        <View style={styles.letterBox}>
            <Text style={styles.letterText}
                adjustsFontSizeToFit={true} // <-- Ajoute ceci
                numberOfLines={1}
            >{letter}</Text>
            <View style={styles.baredeco} />
        </View>
    );
}