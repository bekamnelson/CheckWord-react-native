import { act, screen } from '@testing-library/react-native';
import React from 'react';
import DifficultyBadge, { borderTopOf } from '../../components/DifficultyBadge';
import { i18n, renderWithProviders } from '../../testing/render';

afterEach(async () => {
    await act(() => i18n.changeLanguage('fr'));
});

describe('DifficultyBadge', () => {
    it.each([
        ['facile', 'Facile'],
        ['moyen', 'Moyen'],
        ['difficile', 'Difficile'],
        ['tres_difficile', 'Très difficile'],
    ])('affiche le niveau « %s »', async (level, label) => {
        await renderWithProviders(<DifficultyBadge level={level} />);
        expect(await screen.findByText(label)).toBeOnTheScreen();
    });

    it('est traduit dans la langue du jeu', async () => {
        await act(() => i18n.changeLanguage('de'));
        await renderWithProviders(<DifficultyBadge level="difficile" />);
        expect(await screen.findByText('Schwer')).toBeOnTheScreen();
    });

    it("n'affiche rien pour un niveau inconnu ou absent", async () => {
        await renderWithProviders(<DifficultyBadge level="impossible" />);
        expect(screen.queryByText(/facile|moyen|difficile/i)).toBeNull();
        await renderWithProviders(<DifficultyBadge />);
        expect(screen.queryByText(/facile|moyen|difficile/i)).toBeNull();
    });
});

describe('borderTopOf', () => {
    it('lit l’épaisseur du trait du haut d’un cadre', async () => {
        expect(borderTopOf({ borderWidth: 3 })).toBe(3);
        expect(borderTopOf({ borderWidth: 1, borderTopWidth: 4 })).toBe(4);
        expect(borderTopOf([{ borderWidth: 2 }, { borderTopWidth: 0 }])).toBe(0);
        expect(borderTopOf({ borderLeftWidth: 4 })).toBe(0);
        expect(borderTopOf(undefined)).toBe(0);
    });
});
