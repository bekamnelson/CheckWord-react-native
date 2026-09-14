
import { ImageSourcePropType } from 'react-native';

// Dynamic import or mapping for your 8 theme styles
import { gameTheme1Styles } from './../themes/gameTheme1';
import { gameTheme2Styles } from './../themes/gameTheme2';
import { gameTheme3Styles } from './../themes/gameTheme3';
import { gameTheme4Styles } from './../themes/gameTheme4';
import { gameTheme5Styles } from './../themes/gameTheme5';
import { gameTheme6Styles } from './../themes/gameTheme6';
import { gameTheme7Styles } from './../themes/gameTheme7';
import { gameTheme8Styles } from './../themes/gameTheme8';

// Styles des thèmes d'Accueil (HomeScreen)
import { theme1Styles } from './../themes/theme1';
import { theme2Styles } from './../themes/theme2';
import { theme3Styles } from './../themes/theme3';
import { theme4Styles } from './../themes/theme4';
import { theme5Styles } from './../themes/theme5';
import { theme6Styles } from './../themes/theme6';
import { theme7Styles } from './../themes/theme7';
import { theme8Styles } from './../themes/theme8';
export interface ThemeConfig {
    id: number;
    backgroundImage: ImageSourcePropType;
    gameStyles: Record<string, any>;
    themeStyles: Record<string, any>;
}

export const THEMES: Record<number, ThemeConfig> = {
    1: {
        id: 1,
        backgroundImage: require('./../image/plan1.png'),
        gameStyles: gameTheme1Styles,
        themeStyles: theme1Styles,
    },
    2: {
        id: 2,
        backgroundImage: require('./../image/plan2.png'),
        gameStyles: gameTheme2Styles,
        themeStyles: theme2Styles,
    },
    3: {
        id: 3,
        backgroundImage: require('./../image/plan3.png'),
        gameStyles: gameTheme3Styles,
        themeStyles: theme3Styles,
    },
    4: {
        id: 4,
        backgroundImage: require('./../image/plan4.png'),
        gameStyles: gameTheme4Styles,
        themeStyles: theme4Styles,
    },
    5: {
        id: 5,
        backgroundImage: require('./../image/plan5.png'),
        gameStyles: gameTheme5Styles,
        themeStyles: theme5Styles,
    },
    6: {
        id: 6,
        backgroundImage: require('./../image/plan6.png'),
        gameStyles: gameTheme6Styles,
        themeStyles: theme6Styles,
    },
    7: {
        id: 7,
        backgroundImage: require('./../image/plan7.png'),
        gameStyles: gameTheme7Styles, // À remplacer par gameTheme7Styles
        themeStyles: theme7Styles,     // À remplacer par theme7Styles
    },
    8: {
        id: 8,
        backgroundImage: require('./../image/plan8.png'),
        gameStyles: gameTheme8Styles, // À remplacer par gameTheme8Styles
        themeStyles: theme8Styles,     // À remplacer par theme8Styles
    },
};