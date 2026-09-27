// Niveaux de difficulté des listes de mots, du plus simple au plus dur.
export const TIERS = ['facile', 'moyen', 'difficile', 'tres_difficile'] as const;
export type Tier = (typeof TIERS)[number];

// Mode survie : la difficulté monte d'un cran tous les 10 mots
// (1-10 faciles, 11-20 moyens, 21-30 difficiles, à partir du 31e très difficiles).
export const WORDS_PER_TIER = 10;

// found = mots déjà trouvés (le mot en cours est le n° found + 1)
export const tierFor = (found: number): Tier =>
    TIERS[Math.min(TIERS.length - 1, Math.floor(Math.max(0, found) / WORDS_PER_TIER))];
