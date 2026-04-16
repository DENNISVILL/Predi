import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';

// Importar traducciones
import es from '../locales/es.json';
import en from '../locales/en.json';

const translations = {
  es,
  en
};

const useTranslation = () => {
  const { language, setLanguage } = useStore();
  const [currentTranslations, setCurrentTranslations] = useState(translations[language] || translations.es);

  useEffect(() => {
    setCurrentTranslations(translations[language] || translations.es);
  }, [language]);

  // Función para obtener traducción por clave
  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = currentTranslations;

    // Navegar por el objeto de traducciones
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Retornar la clave si no se encuentra
      }
    }

    // Si el valor es un string, reemplazar parámetros
    if (typeof value === 'string') {
      return Object.keys(params).reduce((str, param) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      }, value);
    }

    return value;
  }, [currentTranslations]);

  // Función para cambiar idioma
  const changeLanguage = useCallback((newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('predix-language', newLanguage);
    }
  }, [setLanguage]);

  // Función para obtener idiomas disponibles
  const getAvailableLanguages = useCallback(() => {
    return [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  }, []);

  // Función para formatear números según el idioma
  const formatNumber = useCallback((number, options = {}) => {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(number);
  }, [language]);

  // Función para formatear fechas según el idioma
  const formatDate = useCallback((date, options = {}) => {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  }, [language]);

  // Función para formatear moneda
  const formatCurrency = useCallback((amount, currency = 'USD') => {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }, [language]);

  return {
    t,
    language,
    changeLanguage,
    getAvailableLanguages,
    formatNumber,
    formatDate,
    formatCurrency,
    isRTL: false // Español e inglés son LTR
  };
};

export default useTranslation;
