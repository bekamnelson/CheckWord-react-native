import listWordDe from '../../JSON/liste_mot_de.json';
import listWordEn from '../../JSON/liste_mot_en.json';
import listWordEs from '../../JSON/liste_mot_es.json';
import listWordFr from '../../JSON/liste_mot_fr.json';
import { TIERS } from '../../utils/difficulty';
import { layoutFor } from '../../utils/keyboardLayouts';
import { normalizeWord } from '../../utils/normalizeWord';

interface WordEntry {
    word: string;
    indice: string;
    difficulte: string;
}

const LISTS: [string, WordEntry[]][] = [
    ['fr', listWordFr],
    ['en', listWordEn],
    ['es', listWordEs],
    ['de', listWordDe],
];

describe.each(LISTS)('liste de mots « %s »', (lang, words) => {
    it('contient au moins 5000 mots', () => {
        expect(words.length).toBeGreaterThanOrEqual(5000);
    });

    it('ne contient aucun doublon', () => {
        const seen = new Set<string>();
        const dupes = words.map((w) => w.word).filter((w) => (seen.has(w) ? true : (seen.add(w), false)));
        expect(dupes).toEqual([]);
    });

    it('ne contient que des lettres tapables sur le clavier de la langue', () => {
        const keys = new Set(layoutFor(lang));
        const bad = words.filter((w) => w.word.length < 2 || [...w.word].some((ch) => !keys.has(ch)));
        expect(bad.map((w) => w.word)).toEqual([]);
    });

    it('est déjà au format du jeu (normalisation sans effet)', () => {
        const bad = words.filter((w) => normalizeWord(w.word, lang) !== w.word);
        expect(bad.map((w) => w.word)).toEqual([]);
    });

    it('a un indice non vide pour chaque mot', () => {
        const bad = words.filter((w) => typeof w.indice !== 'string' || w.indice.trim().length === 0);
        expect(bad.map((w) => w.word)).toEqual([]);
    });

    it("n'écrit jamais le mot à deviner en toutes lettres dans son indice", () => {
        // Mot par mot (« Raconter » reste permis pour CONTER, mais pas « Petit flacon » pour FLACON)
        const hintWords = (hint: string) => hint.split(/[^\p{L}]+/u).map((part) => normalizeWord(part, lang));
        const bad = words.filter((w) => hintWords(w.indice).includes(w.word));
        expect(bad.map((w) => `${w.word} : ${w.indice}`)).toEqual([]);
    });

    it('a une difficulté valide pour chaque mot', () => {
        const bad = words.filter((w) => !(TIERS as readonly string[]).includes(w.difficulte));
        expect(bad.map((w) => `${w.word} : ${w.difficulte}`)).toEqual([]);
    });

    it('a assez de mots dans chaque niveau pour le mode survie', () => {
        for (const tier of TIERS) {
            expect(words.filter((w) => w.difficulte === tier).length).toBeGreaterThanOrEqual(100);
        }
    });
});

describe('claviers', () => {
    it('affichent Ñ uniquement en espagnol et Ä Ö Ü uniquement en allemand', () => {
        expect(layoutFor('es')).toContain('Ñ');
        expect(layoutFor('de')).toEqual(expect.arrayContaining(['Ä', 'Ö', 'Ü']));
        for (const lang of ['fr', 'en']) {
            expect(layoutFor(lang)).not.toContain('Ñ');
            expect(layoutFor(lang)).not.toContain('Ä');
        }
        expect(layoutFor('es')).not.toContain('Ä');
        expect(layoutFor('de')).not.toContain('Ñ');
    });

    it('contiennent les 26 lettres, sans doublon', () => {
        for (const lang of ['fr', 'en', 'es', 'de']) {
            const keys = layoutFor(lang);
            expect(new Set(keys).size).toBe(keys.length);
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((ch) => expect(keys).toContain(ch));
        }
    });

    it('utilisent le clavier français pour une langue inconnue', () => {
        expect(layoutFor('it')).toEqual(layoutFor('fr'));
        expect(layoutFor(undefined)).toEqual(layoutFor('fr'));
    });
});
