import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { DialogOptions } from '../../components/ThemedDialog';
import { useDialog } from '../../contexts/DialogContext';
import { renderWithProviders } from '../../testing/render';

// Petit écran de test : un bouton par boîte de dialogue à ouvrir
function Opener({ dialogs }: { dialogs: DialogOptions[] }) {
    const { showDialog } = useDialog();
    return (
        <>
            {dialogs.map((d, i) => (
                <Pressable key={i} onPress={() => showDialog(d)}>
                    <Text>{`ouvrir ${i}`}</Text>
                </Pressable>
            ))}
        </>
    );
}

describe('boîte de dialogue maison', () => {
    it('affiche titre, message et bouton « Compris » par défaut, puis se ferme', async () => {
        await renderWithProviders(<Opener dialogs={[{ title: 'Thème Verrouillé', message: 'Atteins le niveau 50' }]} />);

        await fireEvent.press(screen.getByText('ouvrir 0'));
        expect(await screen.findByText('Thème Verrouillé')).toBeOnTheScreen();
        expect(screen.getByText('Atteins le niveau 50')).toBeOnTheScreen();

        await fireEvent.press(screen.getByText('Compris'));
        expect(screen.queryByText('Thème Verrouillé')).toBeNull();
    });

    it('affiche la jauge de progression', async () => {
        await renderWithProviders(
            <Opener dialogs={[{ title: 'Verrouillé', progress: { current: 12, total: 50, label: 'Ton niveau : 12 / 50' } }]} />
        );
        await fireEvent.press(screen.getByText('ouvrir 0'));
        expect(await screen.findByText('Ton niveau : 12 / 50')).toBeOnTheScreen();
    });

    it('appelle l’action du bouton choisi', async () => {
        const onRetry = jest.fn();
        await renderWithProviders(
            <Opener dialogs={[{ title: 'Erreur', buttons: [{ label: 'Annuler' }, { label: 'Réessayer', primary: true, onPress: onRetry }] }]} />
        );
        await fireEvent.press(screen.getByText('ouvrir 0'));
        await fireEvent.press(await screen.findByText('Réessayer'));
        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Erreur')).toBeNull();
    });

    it('affiche les boîtes une par une, dans l’ordre', async () => {
        await renderWithProviders(<Opener dialogs={[{ title: 'Première' }, { title: 'Seconde' }]} />);
        await fireEvent.press(screen.getByText('ouvrir 0'));
        await fireEvent.press(screen.getByText('ouvrir 1'));

        expect(await screen.findByText('Première')).toBeOnTheScreen();
        expect(screen.queryByText('Seconde')).toBeNull();

        await fireEvent.press(screen.getByText('Compris'));
        expect(await screen.findByText('Seconde')).toBeOnTheScreen();
    });
});
