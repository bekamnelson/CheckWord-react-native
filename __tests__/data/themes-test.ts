import {
    isThemeUnlocked,
    SURVIVAL_THEMES,
    survivalThemesUnlockedBetween,
    THEME_UNLOCKS,
    THEMES,
    themeUnlockedAt,
} from '../../components/themeRegistry';
import { DECORS } from '../../themes/decor';

const LEVEL_THEMES = THEME_UNLOCKS.filter((th) => th.reqLevel !== undefined);

describe('thèmes', () => {
    it('16 thèmes : 8 par niveau et 8 par la Survie', () => {
        expect(THEME_UNLOCKS).toHaveLength(16);
        expect(LEVEL_THEMES).toHaveLength(8);
        expect(SURVIVAL_THEMES).toHaveLength(8);
    });

    it('chaque thème a ses styles, son fond et son décor', () => {
        for (const { id } of THEME_UNLOCKS) {
            expect(THEMES[id]).toBeDefined();
            expect(THEMES[id].backgroundImage).toBeDefined();
            expect(THEMES[id].gameStyles).toBeDefined();
            expect(THEMES[id].themeStyles).toBeDefined();
            expect(DECORS[id]).toBeDefined();
        }
    });

    it('les thèmes générés ont toutes les clés de style des thèmes faits à la main', () => {
        const gameKeys = Object.keys(THEMES[1].gameStyles);
        const homeKeys = Object.keys(THEMES[1].themeStyles);
        for (const th of SURVIVAL_THEMES) {
            expect(Object.keys(THEMES[th.id].gameStyles)).toEqual(expect.arrayContaining(gameKeys));
            expect(Object.keys(THEMES[th.id].themeStyles)).toEqual(expect.arrayContaining(homeKeys));
        }
    });

    it('ont des identifiants uniques', () => {
        const ids = THEME_UNLOCKS.map((th) => th.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('chaque thème a une seule condition : un niveau OU un temps de survie', () => {
        for (const th of THEME_UNLOCKS) {
            expect((th.reqLevel === undefined) !== (th.reqSurvival === undefined)).toBe(true);
        }
    });
});

describe('thèmes débloqués par niveau (Solo)', () => {
    it('le premier thème est disponible dès le niveau 1', () => {
        expect(LEVEL_THEMES[0].reqLevel).toBe(1);
    });

    it('un nouveau thème se débloque tous les 50 niveaux', () => {
        LEVEL_THEMES.slice(1).forEach((th, i) => expect(th.reqLevel).toBe((i + 1) * 50));
    });

    it("themeUnlockedAt ne signale jamais le thème de départ", () => {
        expect(themeUnlockedAt(1)).toBeUndefined();
    });

    it('themeUnlockedAt trouve le thème débloqué exactement à son niveau', () => {
        for (const th of LEVEL_THEMES.filter((t) => t.reqLevel! > 1)) {
            expect(themeUnlockedAt(th.reqLevel!)?.id).toBe(th.id);
        }
        expect(themeUnlockedAt(51)).toBeUndefined();
    });
});

describe('thèmes débloqués par la Survie', () => {
    it('à partir de 4:00, puis une minute de plus pour chacun', () => {
        expect(SURVIVAL_THEMES.map((th) => th.reqSurvival)).toEqual([240, 300, 360, 420, 480, 540, 600, 660]);
        expect(SURVIVAL_THEMES.map((th) => th.name)).toEqual([
            'ÉCHECS', 'HIVER', 'FORÊT', 'ÉTOILES', 'NOËL', 'FOOT', 'SAVANE', 'HALLOWEEN',
        ]);
    });

    it('ne débloque rien sous 4:00', () => {
        expect(survivalThemesUnlockedBetween(0, 239)).toEqual([]);
    });

    it('débloque Échecs à 4:00 pile', () => {
        expect(survivalThemesUnlockedBetween(0, 240).map((th) => th.name)).toEqual(['ÉCHECS']);
    });

    it('débloque plusieurs thèmes d’un coup si le record progresse beaucoup', () => {
        expect(survivalThemesUnlockedBetween(250, 425).map((th) => th.name)).toEqual(['HIVER', 'FORÊT', 'ÉTOILES']);
    });

    it('ne redébloque pas un thème déjà obtenu', () => {
        expect(survivalThemesUnlockedBetween(300, 330)).toEqual([]);
    });

    it('isThemeUnlocked applique la bonne condition', () => {
        const chess = SURVIVAL_THEMES[0];
        const sakura = LEVEL_THEMES[1];
        expect(isThemeUnlocked(chess, { level: 999, bestSurvival: 239 })).toBe(false);
        expect(isThemeUnlocked(chess, { level: 1, bestSurvival: 240 })).toBe(true);
        expect(isThemeUnlocked(sakura, { level: 49, bestSurvival: 9999 })).toBe(false);
        expect(isThemeUnlocked(sakura, { level: 50, bestSurvival: 0 })).toBe(true);
    });
});
