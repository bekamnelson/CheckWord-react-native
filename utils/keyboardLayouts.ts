// Disposition des touches par langue : les lettres propres à une langue
// (Ñ en espagnol, Ä Ö Ü en allemand) n'apparaissent que pour cette langue
export const LAYOUTS: Record<string, string[]> = {
    fr: 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split(''),
    en: 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split(''),
    es: 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split(''),
    de: 'QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM'.split(''),
};

export const layoutFor = (lang?: string) => LAYOUTS[lang?.slice(0, 2) ?? ''] ?? LAYOUTS.fr;
