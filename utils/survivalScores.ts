import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SurvivalAttempt {
    id: string;
    wordsFound: number;
    // Durée totale survécue en secondes (sert à départager deux scores égaux)
    duration: number;
    lang: string;
    date: number;
}

const STORAGE_KEY = 'survie_classement';
export const MAX_SCORES = 10;

// Meilleur en premier : plus de mots trouvés, puis plus longue survie, puis le plus ancien.
const compare = (a: SurvivalAttempt, b: SurvivalAttempt) =>
    b.wordsFound - a.wordsFound || b.duration - a.duration || a.date - b.date;

export async function loadScores(): Promise<SurvivalAttempt[]> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as SurvivalAttempt[]).sort(compare) : [];
    } catch (e) {
        console.error('Erreur de chargement du classement :', e);
        return [];
    }
}

// Enregistre la tentative et renvoie son rang (1 à 10), ou null si elle n'entre pas dans le top 10.
export async function saveScore(attempt: SurvivalAttempt): Promise<number | null> {
    const scores = [...(await loadScores()), attempt].sort(compare).slice(0, MAX_SCORES);
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
        console.error('Erreur de sauvegarde du classement :', e);
    }
    const rank = scores.findIndex((s) => s.id === attempt.id);
    return rank === -1 ? null : rank + 1;
}

export const formatTime = (totalSeconds: number) => {
    const s = Math.max(0, Math.ceil(totalSeconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
