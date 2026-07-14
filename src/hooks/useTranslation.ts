import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function useTranslation() {
  return useContext(LanguageContext);
}