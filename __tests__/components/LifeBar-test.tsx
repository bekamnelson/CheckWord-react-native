import { screen } from '@testing-library/react-native';
import React from 'react';
import LifeBar from '../../components/LifeBar';
import { renderWithProviders } from '../../testing/render';

describe('LifeBar', () => {
    it('affiche le libellé « Vies » et le compteur', async () => {
        await renderWithProviders(<LifeBar remaining={3} total={5} />);
        expect(await screen.findByText('Vies')).toBeOnTheScreen();
        expect(screen.getByText('3/5')).toBeOnTheScreen();
    });

    it('ne descend jamais sous 0', async () => {
        await renderWithProviders(<LifeBar remaining={-2} total={5} />);
        expect(await screen.findByText('0/5')).toBeOnTheScreen();
    });

    it('version compacte sans libellé (cartes joueurs du multijoueur)', async () => {
        await renderWithProviders(<LifeBar remaining={2} total={4} compact />);
        expect(await screen.findByText('2/4')).toBeOnTheScreen();
        expect(screen.queryByText('Vies')).toBeNull();
    });
});
