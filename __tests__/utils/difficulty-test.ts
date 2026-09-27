import { tierFor, TIERS, WORDS_PER_TIER } from '../../utils/difficulty';

describe('mode survie : difficulté par paliers de 10 mots', () => {
    it('monte d’un cran tous les 10 mots', () => {
        expect(WORDS_PER_TIER).toBe(10);
    });

    it.each([
        [0, 'facile'], // 1er mot
        [9, 'facile'], // 10e mot
        [10, 'moyen'], // 11e mot
        [19, 'moyen'],
        [20, 'difficile'],
        [29, 'difficile'],
        [30, 'tres_difficile'],
        [500, 'tres_difficile'],
    ])('%i mots trouvés → %s', (found, tier) => {
        expect(tierFor(found)).toBe(tier);
    });

    it('reste sur facile pour une valeur négative', () => {
        expect(tierFor(-3)).toBe('facile');
    });

    it('connaît les 4 niveaux dans l’ordre', () => {
        expect(TIERS).toEqual(['facile', 'moyen', 'difficile', 'tres_difficile']);
    });
});
