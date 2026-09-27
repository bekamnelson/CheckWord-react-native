import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { useSound } from '../contexts/SoundContext';

const soundSource = require('./../sound/sound1.mp3');

export default function Sound() {
    const player = useAudioPlayer(soundSource);
    const { soundEnabled } = useSound();

    useEffect(() => {
        player.loop = true;
        player.volume = 0.1;
        if (soundEnabled) {
            player.play();
        } else {
            player.pause();
        }
    }, [soundEnabled, player]);

    return null;
}
