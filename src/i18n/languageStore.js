import { atom } from 'nanostores';
import { translations } from './translations';

// Create language atom with default to 'en'
export const currentLanguage = atom('en');

// Helper function to get current translations
export function getTranslations() {
  return translations[currentLanguage.get()];
}

// Helper function to switch language
export function switchLanguage(lang) {
  if (translations[lang]) {
    currentLanguage.set(lang);
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
    }
  }
}

// Initialize language from localStorage or browser preference
export function initializeLanguage() {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && translations[savedLang]) {
      currentLanguage.set(savedLang);
      return;
    }
    
    // Check browser language preference
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es' && translations.es) {
      currentLanguage.set('es');
    }
  }
}
