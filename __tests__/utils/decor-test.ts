import { DECORS, mix, withAlpha } from '../../themes/decor';

const HEX = /^#[0-9a-f]{6}$/i;

describe('couleurs', () => {
    it('withAlpha ajoute la transparence', () => {
        expect(withAlpha('#ff8fab', 0.2)).toBe('#ff8fab33');
        expect(withAlpha('#000000', 1)).toBe('#000000ff');
        expect(withAlpha('#000000', 0)).toBe('#00000000');
        expect(withAlpha('#000000', 2)).toBe('#000000ff'); // borné à 1
    });

    it('mix mélange deux couleurs', () => {
        expect(mix('#000000', '#ffffff', 0)).toBe('#000000');
        expect(mix('#000000', '#ffffff', 1)).toBe('#ffffff');
        expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
        expect(mix('#ff0000', '#0000ff', 0.5)).toBe('#800080');
    });
});

describe('décors des thèmes', () => {
    const ids = Object.keys(DECORS).map(Number);

    it('existe pour les 16 thèmes', () => {
        expect([...ids].sort((a, b) => a - b)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
    });

    it.each(ids)('thème %i : couleurs hexadécimales valides (utilisables par withAlpha / mix)', (id) => {
        const { palette, icons, particles } = DECORS[id];
        for (const key of ['bg', 'primary', 'onPrimary', 'accent', 'text', 'textMuted', 'success', 'danger'] as const) {
            expect(palette[key]).toMatch(HEX);
        }
        expect(icons.lifeColor).toMatch(HEX);
        // Les particules ne passent pas par withAlpha / mix : rgba() est permis
        particles.colors.forEach((c) => expect(c).toMatch(/^(#[0-9a-f]{6}|rgba?\(.+\))$/i));
        expect(particles.icons.length).toBeGreaterThan(0);
        expect(particles.count).toBeGreaterThan(0);
        expect(particles.minSize).toBeLessThanOrEqual(particles.maxSize);
    });
});
