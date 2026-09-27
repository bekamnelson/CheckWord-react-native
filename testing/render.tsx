import { render } from '@testing-library/react-native';
import React from 'react';
import { DialogProvider } from '../contexts/DialogContext';
import { GameThemeProvider } from '../contexts/GameThemeContext';
import i18n from '../i18n';

// Rend un composant avec les mêmes fournisseurs que l'application (thème + boîtes de dialogue).
export async function renderWithProviders(ui: React.ReactElement) {
    return await render(
        <GameThemeProvider>
            <DialogProvider>{ui}</DialogProvider>
        </GameThemeProvider>
    );
}

export { i18n };
