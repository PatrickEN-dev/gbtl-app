// src/lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrig } from 'react-i18next'
import { getLocales } from 'expo-localization'

import en from '@/locales/en.json'
import pt from '@/locales/pt-BR.json'

const deviceLocale = getLocales()?.[0]?.languageCode ?? 'en'
const initialLng = deviceLocale.startsWith('pt') ? 'pt-BR' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-BR': { translation: pt },
  },
  lng: initialLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
})

export default i18n
export const useTranslation = useTranslationOrig
