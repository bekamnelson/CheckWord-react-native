import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import SecondChanceModal, { SECOND_CHANCE_SECONDS } from '../../components/SecondChanceModal';
import { renderWithProviders } from '../../testing/render';

const setup = (props: Partial<React.ComponentProps<typeof SecondChanceModal>> = {}) => {
    const onWatch = jest.fn();
    const onGiveUp = jest.fn();
    const view = renderWithProviders(
        <SecondChanceModal visible paused={false} rewards={[{ icon: 'heart', label: '+2 vies' }, { icon: 'lightbulb', label: '2 lettres révélées' }]} onWatch={onWatch} onGiveUp={onGiveUp} {...props} />
    );
    return { onWatch, onGiveUp, view };
};

describe('Dernière chance', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('propose la vidéo avec les récompenses', async () => {
        await setup().view;
        expect(await screen.findByText('Dernière chance !')).toBeOnTheScreen();
        expect(screen.getByText('+2 vies')).toBeOnTheScreen();
        expect(screen.getByText('2 lettres révélées')).toBeOnTheScreen();
        expect(screen.getByText(String(SECOND_CHANCE_SECONDS))).toBeOnTheScreen();
    });

    it('lance la vidéo ou abandonne selon le bouton', async () => {
        const { onWatch, onGiveUp, view } = setup();
        await view;
        await fireEvent.press(screen.getByText('Regarder la vidéo'));
        expect(onWatch).toHaveBeenCalledTimes(1);
        await fireEvent.press(screen.getByText('Abandonner'));
        expect(onGiveUp).toHaveBeenCalledTimes(1);
    });

    it('abandonne tout seul quand le temps est écoulé', async () => {
        jest.useFakeTimers();
        const { onGiveUp, view } = setup();
        await view;
        for (let i = 0; i <= SECOND_CHANCE_SECONDS; i++) {
            await act(async () => {
                jest.advanceTimersByTime(1000);
            });
        }
        expect(onGiveUp).toHaveBeenCalled();
    });

    it('met le compte à rebours en pause pendant la vidéo', async () => {
        jest.useFakeTimers();
        const { onGiveUp, view } = setup({ paused: true });
        await view;
        for (let i = 0; i <= SECOND_CHANCE_SECONDS + 2; i++) {
            await act(async () => {
                jest.advanceTimersByTime(1000);
            });
        }
        expect(onGiveUp).not.toHaveBeenCalled();
    });
});
