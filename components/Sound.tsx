import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

const soundSource = require('./../sound/sound1.mp3');

export default function Sound() {
    const player = useAudioPlayer(soundSource);

    useEffect(() => {
        player.loop = true;
        player.volume = 0.1;
        player.play();

        return () => {
            player.pause();
        };
    }, [player]);

    return null;
}