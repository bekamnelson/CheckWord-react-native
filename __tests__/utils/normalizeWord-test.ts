import { normalizeWord } from '../../utils/normalizeWord';

describe('normalizeWord', () => {
    it('met le mot en majuscules', () => {
        expect(normalizeWord('maison', 'fr')).toBe('MAISON');
    });

    it('retire les accents en français', () => {
        expect(normalizeWord('Éléphant', 'fr')).toBe('ELEPHANT');
        expect(normalizeWord('garçon', 'fr')).toBe('GARCON');
        expect(normalizeWord('forêt', 'fr')).toBe('FORET');
    });

    it('retire espaces, tirets, chiffres et ponctuation', () => {
        expect(normalizeWord('arc-en-ciel', 'fr')).toBe('ARCENCIEL');
        expect(normalizeWord('mot de passe 2!', 'fr')).toBe('MOTDEPASSE');
    });

    it('garde le Ñ en espagnol', () => {
        expect(normalizeWord('niño', 'es')).toBe('NIÑO');
        expect(normalizeWord('Mañana', 'es-ES')).toBe('MAÑANA');
    });

    it('retire quand même les autres accents en espagnol', () => {
        expect(normalizeWord('canción', 'es')).toBe('CANCION');
    });

    it('garde Ä Ö Ü en allemand', () => {
        expect(normalizeWord('Mädchen', 'de')).toBe('MÄDCHEN');
        expect(normalizeWord('schön', 'de')).toBe('SCHÖN');
        expect(normalizeWord('Tür', 'de')).toBe('TÜR');
    });

    it('écrit ß en SS', () => {
        expect(normalizeWord('Straße', 'de')).toBe('STRASSE');
        expect(normalizeWord('Fuß', 'fr')).toBe('FUSS');
    });

    it("n'accepte Ñ et les trémas que dans leur langue", () => {
        expect(normalizeWord('niño', 'fr')).toBe('NINO');
        expect(normalizeWord('Mädchen', 'en')).toBe('MADCHEN');
        expect(normalizeWord('niño', 'de')).toBe('NINO');
    });

    it('ne laisse jamais passer les caractères de remplacement internes', () => {
        expect(normalizeWord('a#b$c%d', 'de')).toBe('ABCD');
        expect(normalizeWord('a#b$c%d', 'es')).toBe('ABCD');
    });

    it('fonctionne sans langue', () => {
        expect(normalizeWord('Été')).toBe('ETE');
        expect(normalizeWord('')).toBe('');
    });
});
