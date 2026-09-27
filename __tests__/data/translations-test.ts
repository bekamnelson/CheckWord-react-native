import de from '../../translations/de.json';
import en from '../../translations/en.json';
import es from '../../translations/es.json';
import fr from '../../translations/fr.json';
import { TIERS } from '../../utils/difficulty';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

// Aplatit un fichier de traduction : { "a.b.0.c": "texte", ... }
function flatten(value: Json, prefix = '', out: Record<string, Json> = {}) {
    if (value !== null && typeof value === 'object') {
        const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v] as const) : Object.entries(value);
        for (const [k, v] of entries) flatten(v, prefix ? `${prefix}.${k}` : k, out);
    } else {
        out[prefix] = value;
    }
    return out;
}

const placeholders = (text: Json) =>
    typeof text === 'string' ? (text.match(/\{\{\s*\w+\s*\}\}/g) ?? []).map((p) => p.replace(/\s/g, '')).sort() : [];

const FR = flatten(fr as Json);
const OTHERS: [string, Record<string, Json>][] = [
    ['en', flatten(en as Json)],
    ['es', flatten(es as Json)],
    ['de', flatten(de as Json)],
];

describe.each(OTHERS)('traduction « %s »', (lang, flat) => {
    it('a exactement les mêmes clés que le français', () => {
        const missing = Object.keys(FR).filter((k) => !(k in flat));
        const extra = Object.keys(flat).filter((k) => !(k in FR));
        expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });

    it('garde les mêmes variables {{…}} que le français', () => {
        const bad = Object.keys(FR).filter(
            (k) => k in flat && JSON.stringify(placeholders(FR[k])) !== JSON.stringify(placeholders(flat[k]))
        );
        expect(bad).toEqual([]);
    });
});

describe.each([['fr', FR], ...OTHERS])('textes « %s »', (lang, flat) => {
    it("n'a aucun texte vide", () => {
        const empty = Object.entries(flat).filter(([, v]) => typeof v === 'string' && v.trim() === '');
        expect(empty.map(([k]) => k)).toEqual([]);
    });

    it("ne contient aucun emoji (remplacés par des icônes Font Awesome)", () => {
        const withEmoji = Object.entries(flat).filter(([, v]) => typeof v === 'string' && /\p{Extended_Pictographic}/u.test(v));
        expect(withEmoji.map(([k, v]) => `${k} : ${v}`)).toEqual([]);
    });

    it('traduit les 4 niveaux de difficulté', () => {
        for (const tier of TIERS) expect(flat[`difficulte_${tier}`]).toEqual(expect.any(String));
    });
});
