import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// On importe tes fichiers JSON
import en from './translations/en.json';
import de from './translations/de.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        lng: 'fr', // Langue par défaut
        fallbackLng: 'en', // Langue de secours
        resources: {
            fr: { translation: fr },
            en: { translation: en },
            es: { translation: es },
            de: { translation: de }
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;