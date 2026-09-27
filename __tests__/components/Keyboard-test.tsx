import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import Keyboard from '../../components/Keyboard';
import { i18n, renderWithProviders } from '../../testing/render';

// Le clavier attend de connaître sa largeur avant de dessiner les touches
async function renderKeyboard(onLetterClick = jest.fn()) {
    await renderWithProviders(<Keyboard onLetterClick={onLetterClick} styles={{}} />);
    await fireEvent(screen.getByTestId('keyboard'), 'layout', { nativeEvent: { layout: { width: 360, height: 300 } } });
    return onLetterClick;
}

afterEach(async () => {
    await act(() => i18n.changeLanguage('fr'));
});

describe('Keyboard', () => {
    it('envoie la lettre touchée', async () => {
        const onLetterClick = await renderKeyboard();
        await fireEvent.press(screen.getByText('A'));
        expect(onLetterClick).toHaveBeenCalledWith('A');
    });

    it('en français : 26 lettres, sans Ñ ni trémas', async () => {
        await renderKeyboard();
        expect(screen.getByText('Z')).toBeOnTheScreen();
        expect(screen.queryByText('Ñ')).toBeNull();
        expect(screen.queryByText('Ä')).toBeNull();
    });

    it('en espagnol : ajoute la touche Ñ', async () => {
        await act(() => i18n.changeLanguage('es'));
        const onLetterClick = await renderKeyboard();
        await fireEvent.press(screen.getByText('Ñ'));
        expect(onLetterClick).toHaveBeenCalledWith('Ñ');
        expect(screen.queryByText('Ä')).toBeNull();
    });

    it('en allemand : ajoute Ä Ö Ü', async () => {
        await act(() => i18n.changeLanguage('de'));
        await renderKeyboard();
        for (const ch of ['Ä', 'Ö', 'Ü']) expect(screen.getByText(ch)).toBeOnTheScreen();
        expect(screen.queryByText('Ñ')).toBeNull();
    });
});
