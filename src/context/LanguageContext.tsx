import React, {
  createContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en';
import hi from '../locales/hi';
import ar from '../locales/ar';
import fr from '../locales/fr';

const translations = {
  en,
  hi,
  ar,
  fr,
};

export const LanguageContext =
  createContext<any>(null);

export const LanguageProvider = ({
  children,
}: any) => {
  const [language, setLanguage] =
  useState<keyof typeof translations>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage =
        await AsyncStorage.getItem('language');

      if (
  savedLanguage === 'en' ||
  savedLanguage === 'hi' ||
  savedLanguage === 'ar' ||
  savedLanguage === 'fr'
) {
  setLanguage(savedLanguage);
}
    } catch (error) {
      console.log(
        'Error loading language:',
        error
      );
    }
  };

  const changeLanguage = async (
  lang: 'en' | 'hi' | 'ar' | 'fr'
) => {
    try {
      setLanguage(lang);

      await AsyncStorage.setItem(
        'language',
        lang
      );
    } catch (error) {
      console.log(
        'Error saving language:',
        error
      );
    }
  };

  const t = (
  key: string,
  params?: Record<string, string | number>
) => {
  let text =
    (translations[language] as Record<string, string>)[key] ||
    key;

  if (params) {
    Object.keys(params).forEach(param => {
      text = text.replace(
        new RegExp(`{{${param}}}`, 'g'),
        String(params[param])
      );
    });
  }

  return text;
};

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};