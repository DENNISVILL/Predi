import React, { useState, useContext, createContext } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

// Contexto global para el país seleccionado
export const CountryContext = createContext();

// Datos de los 21 países hispanohablantes
export const HISPANIC_COUNTRIES = {
  'ES': {
    name: 'España',
    flag: '🇪🇸',
    population: '47M',
    timezone: 'CET',
    currency: 'EUR',
    region: 'Europa',
    marketType: 'Hub Europeo',
    digitalGrowth: '12%',
    socialPenetration: '85%',
    peakHours: {
      instagram: '21:30-23:30',
      tiktok: '20:30-22:30',
      facebook: '21:00-23:00',
      youtube: '20:00-22:00'
    },
    culturalInsights: [
      'Horarios nocturnos tardíos',
      'Contenido familiar importante',
      'Humor español muy valorado',
      'Siesta afecta horarios'
    ],
    topHashtags: ['#España', '#Madrid', '#Barcelona', '#Andalucía'],
    festivals: ['San Fermín', 'Feria de Abril', 'Las Fallas', 'Semana Santa']
  },
  'MX': {
    name: 'México',
    flag: '🇲🇽',
    population: '128M',
    timezone: 'CST',
    currency: 'MXN',
    region: 'América del Norte',
    marketType: 'Mercado #1',
    digitalGrowth: '18%',
    socialPenetration: '78%',
    peakHours: {
      instagram: '21:00-23:00',
      tiktok: '22:00-24:00',
      facebook: '20:30-22:30',
      youtube: '19:30-21:30'
    },
    culturalInsights: [
      'Contenido familiar muy importante',
      'Humor mexicano único',
      'Tradiciones muy valoradas',
      'Mercado más grande'
    ],
    topHashtags: ['#México', '#CDMX', '#Guadalajara', '#Monterrey'],
    festivals: ['Día de Muertos', 'Cinco de Mayo', 'Grito de Independencia', 'Navidad']
  },
  'CO': {
    name: 'Colombia',
    flag: '🇨🇴',
    population: '51M',
    timezone: 'COT',
    currency: 'COP',
    region: 'América del Sur',
    marketType: 'Hub Sudamericano',
    digitalGrowth: '22%',
    socialPenetration: '82%',
    peakHours: {
      instagram: '20:00-22:00',
      tiktok: '21:00-23:00',
      facebook: '19:30-21:30',
      youtube: '20:30-22:30'
    },
    culturalInsights: [
      'Música muy importante',
      'Contenido positivo preferido',
      'Regiones muy diversas',
      'Emprendimiento en auge'
    ],
    topHashtags: ['#Colombia', '#Bogotá', '#Medellín', '#Cali'],
    festivals: ['Carnaval de Barranquilla', 'Feria de Flores', 'Festival de Vallenato', 'Semana Santa']
  },
  'AR': {
    name: 'Argentina',
    flag: '🇦🇷',
    population: '45M',
    timezone: 'ART',
    currency: 'ARS',
    region: 'América del Sur',
    marketType: 'Mercado Desarrollado',
    digitalGrowth: '15%',
    socialPenetration: '88%',
    peakHours: {
      instagram: '20:30-22:30',
      tiktok: '21:30-23:30',
      facebook: '20:00-22:00',
      youtube: '19:00-21:00'
    },
    culturalInsights: [
      'Fútbol es pasión nacional',
      'Humor sarcástico apreciado',
      'Contenido político sensible',
      'Tango y cultura porteña'
    ],
    topHashtags: ['#Argentina', '#BuenosAires', '#Córdoba', '#Rosario'],
    festivals: ['Carnaval', 'Día de la Independencia', 'Oktoberfest', 'Festival de Tango']
  },
  'PE': {
    name: 'Perú',
    flag: '🇵🇪',
    population: '33M',
    timezone: 'PET',
    currency: 'PEN',
    region: 'América del Sur',
    marketType: 'Crecimiento Digital',
    digitalGrowth: '25%',
    socialPenetration: '75%',
    peakHours: {
      instagram: '19:00-21:00',
      tiktok: '20:00-22:00',
      facebook: '18:30-20:30',
      youtube: '19:30-21:30'
    },
    culturalInsights: [
      'Gastronomía muy importante',
      'Orgullo cultural fuerte',
      'Tradiciones ancestrales',
      'Turismo en crecimiento'
    ],
    topHashtags: ['#Perú', '#Lima', '#Cusco', '#MachuPicchu'],
    festivals: ['Inti Raymi', 'Señor de los Milagros', 'Carnavales', 'Fiestas Patrias']
  },
  'VE': {
    name: 'Venezuela',
    flag: '🇻🇪',
    population: '28M',
    timezone: 'VET',
    currency: 'VES',
    region: 'América del Sur',
    marketType: 'Mercado Complejo',
    digitalGrowth: '20%',
    socialPenetration: '70%',
    peakHours: {
      instagram: '19:00-21:00',
      tiktok: '20:30-22:30',
      facebook: '18:00-20:00',
      youtube: '19:30-21:30'
    },
    culturalInsights: [
      'Música caribeña importante',
      'Contenido de esperanza valorado',
      'Diaspora global activa',
      'Belleza y concursos populares'
    ],
    topHashtags: ['#Venezuela', '#Caracas', '#Maracaibo', '#Valencia'],
    festivals: ['Carnaval', 'Diablos Danzantes', 'Feria de la Chinita', 'Navidad']
  },
  'CL': {
    name: 'Chile',
    flag: '🇨🇱',
    population: '19M',
    timezone: 'CLT',
    currency: 'CLP',
    region: 'América del Sur',
    marketType: 'Alto PIB per cápita',
    digitalGrowth: '14%',
    socialPenetration: '90%',
    peakHours: {
      instagram: '19:30-21:30',
      tiktok: '20:00-22:00',
      facebook: '19:00-21:00',
      youtube: '20:30-22:30'
    },
    culturalInsights: [
      'Humor chileno único',
      'Naturaleza muy valorada',
      'Vino y gastronomía',
      'Mercado desarrollado'
    ],
    topHashtags: ['#Chile', '#Santiago', '#Valparaíso', '#Atacama'],
    festivals: ['Fiestas Patrias', 'Vendimia', 'Festival de Viña', 'Año Nuevo']
  },
  'EC': {
    name: 'Ecuador',
    flag: '🇪🇨',
    population: '18M',
    timezone: 'ECT',
    currency: 'USD',
    region: 'América del Sur',
    marketType: 'Mercado Emergente',
    digitalGrowth: '28%',
    socialPenetration: '72%',
    peakHours: {
      instagram: '18:00-20:00',
      tiktok: '19:00-21:00',
      facebook: '17:30-19:30',
      youtube: '18:30-20:30'
    },
    culturalInsights: [
      'Biodiversidad importante',
      'Galápagos icónico',
      'Artesanías valoradas',
      'Mercado joven'
    ],
    topHashtags: ['#Ecuador', '#Quito', '#Guayaquil', '#Galápagos'],
    festivals: ['Carnaval', 'Inti Raymi', 'Mama Negra', 'Fiestas de Quito']
  }
  // Continuaremos con los otros 13 países en la siguiente fase
};

// Componente de selección de país
export const CountrySelector = ({ onCountryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('MX'); // México por defecto

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsOpen(false);
    onCountryChange(countryCode, HISPANIC_COUNTRIES[countryCode]);
  };

  const currentCountry = HISPANIC_COUNTRIES[selectedCountry];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-gradient-to-r from-red-600/20 to-yellow-500/20 border border-red-500/30 rounded-lg px-4 py-2 text-white hover:from-red-600/30 hover:to-yellow-500/30 transition-all"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentCountry.flag}</span>
        <div className="text-left">
          <div className="text-sm font-semibold">{currentCountry.name}</div>
          <div className="text-xs text-gray-400">{currentCountry.population} • {currentCountry.marketType}</div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[#111318] border border-white/10 rounded-lg shadow-2xl z-[100] max-h-96 overflow-y-auto backdrop-blur-xl">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-white font-semibold text-sm">🇪🇸 Países Hispanohablantes</h3>
            <p className="text-gray-400 text-xs">Selecciona tu mercado objetivo</p>
          </div>

          <div className="p-2">
            {Object.entries(HISPANIC_COUNTRIES).map(([code, country]) => (
              <button
                key={code}
                onClick={() => handleCountrySelect(code)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-xl">{country.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{country.name}</span>
                    {selectedCountry === code && <Check className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="text-xs text-gray-400">
                    {country.population} • {country.marketType} • {country.digitalGrowth} crecimiento
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-700 bg-gray-900/50">
            <div className="text-xs text-gray-400 text-center">
              <strong className="text-yellow-400">559M</strong> hablantes • <strong className="text-green-400">21</strong> países
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Provider del contexto
export const CountryProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('MX');
  const [countryData, setCountryData] = useState(HISPANIC_COUNTRIES['MX']);

  const updateCountry = (countryCode, data) => {
    setSelectedCountry(countryCode);
    setCountryData(data);
  };

  return (
    <CountryContext.Provider value={{
      selectedCountry,
      countryData,
      updateCountry,
      allCountries: HISPANIC_COUNTRIES
    }}>
      {children}
    </CountryContext.Provider>
  );
};

// Hook para usar el contexto
export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry debe usarse dentro de CountryProvider');
  }
  return context;
};

export default CountrySelector;
