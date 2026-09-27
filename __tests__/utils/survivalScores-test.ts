import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTime, loadScores, MAX_SCORES, saveScore, SurvivalAttempt } from '../../utils/survivalScores';

const attempt = (id: string, wordsFound: number, duration = 60, date = 1): SurvivalAttempt => ({
    id,
    wordsFound,
    duration,
    lang: 'fr',
    date,
});

beforeEach(async () => {
    await AsyncStorage.clear();
});

describe('classement du mode survie', () => {
    it('est vide au départ', async () => {
        expect(await loadScores()).toEqual([]);
    });

    it('classe par mots trouvés, puis durée, puis ancienneté', async () => {
        await saveScore(attempt('a', 5, 100, 1));
        await saveScore(attempt('b', 8, 50, 2));
        await saveScore(attempt('c', 5, 200, 3));
        await saveScore(attempt('d', 5, 200, 0));
        expect((await loadScores()).map((s) => s.id)).toEqual(['b', 'd', 'c', 'a']);
    });

    it('renvoie le rang de la tentative', async () => {
        expect(await saveScore(attempt('a', 3))).toBe(1);
        expect(await saveScore(attempt('b', 10))).toBe(1);
        expect(await saveScore(attempt('c', 5))).toBe(2);
    });

    it(`ne garde que les ${MAX_SCORES} meilleures tentatives`, async () => {
        for (let i = 1; i <= MAX_SCORES; i++) await saveScore(attempt(`s${i}`, i));
        expect(await saveScore(attempt('trop-faible', 0))).toBeNull();

        const scores = await loadScores();
        expect(scores).toHaveLength(MAX_SCORES);
        expect(scores.some((s) => s.id === 'trop-faible')).toBe(false);

        // Une meilleure tentative entre et chasse la dernière
        expect(await saveScore(attempt('record', 99))).toBe(1);
        const after = await loadScores();
        expect(after).toHaveLength(MAX_SCORES);
        expect(after.some((s) => s.id === 's1')).toBe(false);
    });

    it('résiste à des données corrompues', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await AsyncStorage.setItem('survie_classement', '{pas du json');
        expect(await loadScores()).toEqual([]);
        spy.mockRestore();
    });
});

describe('formatTime', () => {
    it.each([
        [0, '0:00'],
        [5, '0:05'],
        [59.2, '1:00'],
        [120, '2:00'],
        [125, '2:05'],
        [-4, '0:00'],
    ])('%d s → %s', (secs, text) => {
        expect(formatTime(secs)).toBe(text);
    });
});
