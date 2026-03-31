import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Locales
import translationEN from './locales/en/translation.json';
import translationENUS from './locales/en-US/translation.json';
import translationENIN from './locales/en-IN/translation.json';
import translationES from './locales/es/translation.json';
import translationFR from './locales/fr/translation.json';
import translationHI from './locales/hi/translation.json';

const resources = {
  en: { translation: translationEN },
  'en-US': { translation: translationENUS },
  'en-IN': { translation: translationENIN },
  es: { translation: translationES },
  fr: { translation: translationFR },
  hi: { translation: translationHI }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en-IN', // default language
    fallbackLng: 'en-IN',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
