import { THEME_UNLOCKS, THEMES, themeUnlockedAt } from '../../components/themeRegistry';
import { DECORS } from '../../themes/decor';

describe('thèmes', () => {
    it('chaque thème déblocable a ses styles, son fond et son décor', () => {
        for (const { id } of THEME_UNLOCKS) {
            expect(THEMES[id]).toBeDefined();
            expect(THEMES[id].backgroundImage).toBeDefined();
            expect(THEMES[id].gameStyles).toBeDefined();
            expect(THEMES[id].themeStyles).toBeDefined();
            expect(DECORS[id]).toBeDefined();
        }
    });

    it('ont des identifiants uniques', () => {
        const ids = THEME_UNLOCKS.map((th) => th.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('le premier thème est disponible dès le niveau 1', () => {
        expect(THEME_UNLOCKS[0].reqLevel).toBe(1);
    });

    it('un nouveau thème se débloque tous les 50 niveaux', () => {
        THEME_UNLOCKS.slice(1).forEach((th, i) => expect(th.reqLevel).toBe((i + 1) * 50));
    });

    it('les niveaux requis ne diminuent jamais', () => {
        const levels = THEME_UNLOCKS.map((th) => th.reqLevel);
        expect(levels).toEqual([...levels].sort((a, b) => a - b));
    });

    it("themeUnlockedAt ne signale jamais le thème de départ", () => {
        expect(themeUnlockedAt(1)).toBeUndefined();
    });

    it('themeUnlockedAt trouve le thème débloqué exactement à son niveau', () => {
        for (const th of THEME_UNLOCKS.filter((t) => t.reqLevel > 1)) {
            expect(themeUnlockedAt(th.reqLevel)?.reqLevel).toBe(th.reqLevel);
        }
    });
});
