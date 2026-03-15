import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import hi from './locales/hi.json';
import ru from './locales/ru.json';
import id from './locales/id.json';
import th from './locales/th.json';
import ar from './locales/ar.json';

const savedLang = localStorage.getItem('i18n-lang') || 'vi';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
    es: { translation: es },
    pt: { translation: pt },
    fr: { translation: fr },
    de: { translation: de },
    it: { translation: it },
    zh: { translation: zh },
    ja: { translation: ja },
    ko: { translation: ko },
    hi: { translation: hi },
    ru: { translation: ru },
    id: { translation: id },
    th: { translation: th },
    ar: { translation: ar },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18n-lang', lng);
});

export default i18n;
