// Lettres propres à une langue, gardées telles quelles car présentes sur son clavier.
export const KEPT_LETTERS: Record<string, string> = { es: 'Ñ', de: 'ÄÖÜ' };

const PLACEHOLDERS = ['#', '$', '%'];

// Met un mot saisi au format du jeu : majuscules, sans accents ni caractères spéciaux,
// sauf les lettres du clavier de la langue (Ñ en espagnol, Ä Ö Ü en allemand).
// ß s'écrit SS en majuscules.
export function normalizeWord(text: string, lang?: string): string {
    const keep = KEPT_LETTERS[lang?.slice(0, 2) ?? ''] ?? '';
    // Les caractères de remplacement sont retirés d'abord, sinon « # » deviendrait « Ä »
    let formatted = text.replace(/[#$%]/g, '').replace(/ß/g, 'SS').toUpperCase();
    keep.split('').forEach((ch, i) => { formatted = formatted.split(ch).join(PLACEHOLDERS[i]); });
    formatted = formatted
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z#$%]/g, '');
    keep.split('').forEach((ch, i) => { formatted = formatted.split(PLACEHOLDERS[i]).join(ch); });
    return formatted;
}
