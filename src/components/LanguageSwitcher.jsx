// src/components/LanguageSwitcher.jsx - VERSÃO PLANO B

import React from 'react';
import { useTranslation } from 'react-i18next';
// Usando um ícone de globo do pacote Font Awesome (fa)

const styles = {
  switcherContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 10,
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    color: '#a0aec0',
    background: 'rgba(45,55,72,0.95)',
    borderRadius: '8px',
    padding: '2px 8px',
    maxWidth: '95vw',
  },
  icon: {
    cursor: 'pointer',
    fontSize: '20px',
    transition: 'color 0.3s ease, transform 0.3s ease',
    color: '#a0aec0',
  },
  langText: {
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    fontSize: '15px',
  },
  active: {
    color: '#7fdbff',
    transform: 'scale(1.08)',
  }
};

// Responsividade para mobile
const mobileStyle = {
  switcherContainer: {
    top: '4px',
    right: '4px',
    gap: '4px',
    padding: '1px 4px',
    fontSize: '13px',
    borderRadius: '6px',
    maxWidth: '99vw',
  },
  icon: {
    fontSize: '15px',
  },
  langText: {
    fontSize: '13px',
  }
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isPtActive = i18n.language.startsWith('pt');
  const isEnActive = i18n.language.startsWith('en');

  // Detecta mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  const mergedContainer = isMobile ? { ...styles.switcherContainer, ...mobileStyle.switcherContainer } : styles.switcherContainer;
  const mergedIcon = isMobile ? { ...styles.icon, ...mobileStyle.icon } : styles.icon;
  const mergedLangText = isMobile ? { ...styles.langText, ...mobileStyle.langText } : styles.langText;

  return (
    <div style={mergedContainer}>
          <img
            src={typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/flag-br.svg' : '/flag-br.svg'}
            alt="PT"
            style={{ width: isMobile ? 18 : 22, height: isMobile ? 18 : 22, opacity: isPtActive ? 1 : 0.5, cursor: 'pointer', border: isPtActive ? '2px solid #7fdbff' : '2px solid transparent', borderRadius: '50%', transition: 'all 0.2s', marginRight: 4, background: '#23252b' }}
            onClick={() => changeLanguage('pt')}
            draggable={false}
          />
      <span>|</span>
          <img
            src={typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/flag-us.svg' : '/flag-us.svg'}
            alt="EN"
            style={{ width: isMobile ? 18 : 22, height: isMobile ? 18 : 22, opacity: isEnActive ? 1 : 0.5, cursor: 'pointer', border: isEnActive ? '2px solid #7fdbff' : '2px solid transparent', borderRadius: '50%', transition: 'all 0.2s', marginLeft: 4, background: '#23252b' }}
            onClick={() => changeLanguage('en')}
            draggable={false}
          />
    </div>
  );
};

export default LanguageSwitcher;