import i18n from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrig } from 'react-i18next'

import en from '@/locales/en.json'
import pt from '@/locales/pt-BR.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-BR': { translation: pt },
  },
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
})

export default i18n
export const useTranslation = useTranslationOrig
