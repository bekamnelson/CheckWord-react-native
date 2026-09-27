// Stockage local simulé en mémoire (vidé avant chaque test par les tests qui en dépendent)
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Lecteur audio factice : les sons ne sont pas joués pendant les tests
jest.mock('expo-audio', () => ({
    useAudioPlayer: () => ({ play: jest.fn(), pause: jest.fn(), seekTo: jest.fn(), remove: jest.fn() }),
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-haptics', () => ({
    notificationAsync: jest.fn(),
    impactAsync: jest.fn(),
    NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
    ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));
