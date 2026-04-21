import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import en from '../translations/en/common.json';
import tn from '../translations/tn/common.json';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.knowledgeBase': 'Knowledge Base',
    'nav.telehealth': 'Telehealth',
    'nav.new': 'NEW',
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.documentation': 'Documentation',
    'nav.partners': 'Partners',
    'nav.contact': 'Contact',
    'nav.legal': 'Legal',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms of Service',
    
    // Auth
    'auth.signup': 'Sign Up',
    'auth.login': 'Login',
    
    // Landing Page
    'landing.announcement': '🚀 New: AI-Powered Disease Detection now available!',
    'landing.learnMore': 'Learn more →',
    'landing.search': 'Search...',
    'landing.hero.title': 'Smart Farming for',
    'landing.hero.subtitle': 'African Agriculture',
    'landing.hero.description': 'Empower your farm with real-time disease detection, expert consultations, and offline-first technology designed for African farmers.',
    'landing.cta.primary': 'Launch Dashboard',
    'landing.cta.secondary': 'Browse Library',
    'landing.features.title': 'Everything you need to succeed',
    'landing.features.subtitle': 'Powerful tools to help you manage your farm efficiently',
    'landing.feature1.title': 'Offline-First',
    'landing.feature1.desc': 'Works without internet connection. Sync automatically when online.',
    'landing.feature2.title': 'AI Diagnostics',
    'landing.feature2.desc': 'Instant disease detection using advanced artificial intelligence.',
    'landing.feature3.title': 'Expert Access',
    'landing.feature3.desc': 'Connect with veterinarians and agricultural experts 24/7.',
    'landing.field.title': 'AI Field Agent',
    'landing.field.desc': 'Your pocket agricultural expert powered by advanced AI technology',
    'landing.field.point1': 'Real-time disease identification',
    'landing.field.point2': 'Treatment recommendations',
    'landing.field.point3': 'Prevention strategies',
    'landing.field.cta': 'Explore Features',
    'landing.cta.title': 'Ready to transform your farm?',
    'landing.cta.subtitle': 'Join thousands of farmers already using Farm-Aid',
    'landing.cta.getStarted': 'Get Started',
    'landing.cta.watchDemo': 'Watch Demo',
    'landing.stats.farmers': 'Active Farmers',
    'landing.stats.animals': 'Animals Protected',
    'landing.stats.vets': 'Expert Vets',
    'landing.stats.support': 'Support Hours',
    'landing.footer.description': 'Empowering African farmers with technology for sustainable agriculture.',
    'landing.footer.product': 'Product',
    'landing.footer.offline': 'Offline Mode',
    'landing.footer.resources': 'Resources',
    'landing.footer.directory': 'Vet Directory',
    'landing.footer.community': 'Community',
    'landing.footer.roadmap': 'Roadmap',
    'landing.footer.company': 'Company',
    'landing.footer.rights': 'All rights reserved.',
  },
  tn: {
    // Setswana translations
    'nav.features': 'Dikarolo',
    'nav.knowledgeBase': 'Kitso',
    'nav.telehealth': 'Pabalesego ya Mapodise',
    'nav.new': 'NTŠHA',
    'nav.about': 'Ka ga rona',
    'nav.pricing': 'Ditlhwatlhwa',
    'nav.documentation': 'Mokwalo',
    'nav.partners': 'Balekane',
    'nav.contact': 'Ikgolaganye',
    'nav.legal': 'Melao',
    'nav.privacy': 'Puso ya Sephiri',
    'nav.terms': 'Melaotheo',
    
    'auth.signup': 'Ikwadise',
    'auth.login': 'Tsena',
    
    'landing.announcement': '🚀 E ntšha: AI ya go lemoga malwetse e a le gona!',
    'landing.learnMore': 'Ithaetse →',
    'landing.search': 'Batla...',
    'landing.hero.title': 'Temothuo e Botlhale ya',
    'landing.hero.subtitle': 'Temothuo ya Aforika',
    'landing.hero.description': 'Tlhotlhietsa polasi ya gago ka go lemoga malwetse ka bonako, dipuisano le ditogamaano, le thekenoloji e e berekang kwa ntle ga inthanete.',
    'landing.cta.primary': 'Simolola Dashboard',
    'landing.cta.secondary': 'Tlhoma Laeborari',
    'landing.features.title': 'Sengwe le sengwe se o se tlhokang',
    'landing.features.subtitle': 'Didirisiwa tse di maatla go go thusa go tsamaisa polasi ya gago sentle',
    'landing.feature1.title': 'E Bereka kwa Ntle ga Inthanete',
    'landing.feature1.desc': 'E bereka kwa ntle ga kgokagano ya inthanete. E ikopanya ka nosi fa e le gona.',
    'landing.feature2.title': 'AI ya go Lemoga Malwetse',
    'landing.feature2.desc': 'Lemoga malwetse ka bonako go dirisiwa botshelo jwa maemo a a kwa godimo.',
    'landing.feature3.title': 'Tirelo ya Ditogamaano',
    'landing.feature3.desc': 'Ikgolaganye le dingaka tsa diruiwa le ditogamaano tsa temothuo nako yotlhe.',
    'landing.field.title': 'Moemelwa wa AI',
    'landing.field.desc': 'Togamaano ya gago ya temothuo e e tsamayang e dirisa thekenoloji ya AI',
    'landing.field.point1': 'Lemoga malwetse ka bonako',
    'landing.field.point2': 'Dikgakololo tsa kalafi',
    'landing.field.point3': 'Ditsela tsa thibelo',
    'landing.field.cta': 'Tlhoma Dikarolo',
    'landing.cta.title': 'O ikemiseditse go fetola polasi ya gago?',
    'landing.cta.subtitle': 'Tsena mo balemirueng ba ba dirisang Farm-Aid',
    'landing.cta.getStarted': 'Simolola',
    'landing.cta.watchDemo': 'Lebela Demo',
    'landing.stats.farmers': 'Balemi ba ba Dirisang',
    'landing.stats.animals': 'Diruiwa tse di Sireleditsweng',
    'landing.stats.vets': 'Dingaka tsa Diruiwa',
    'landing.stats.support': 'Iri tsa Thuso',
    'landing.footer.description': 'Tlotlofatsa balemi ba Aforika ka thekenoloji ya temothuo e e tsitsitseng.',
    'landing.footer.product': 'Sedirisiwa',
    'landing.footer.offline': 'Moetlo wa kwa Ntle',
    'landing.footer.resources': 'Didirisiwa',
    'landing.footer.directory': 'Lenaneo la Dingaka',
    'landing.footer.community': 'Setšhaba',
    'landing.footer.roadmap': 'Tsela ya go Tsamaya',
    'landing.footer.company': 'Khampani',
    'landing.footer.rights': 'Ditšhwanelo tsotlhe di sireleditswe.',
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};