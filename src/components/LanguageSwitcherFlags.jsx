import React from 'react';
import { useTranslation } from 'react-i18next';
// 1. Importe o ícone de Globo que você queria
import { FaGlobeAmericas } from 'react-icons/fa';

const styles = {
  switcherContainer: {
    position: 'absolute',
    top: '18px',
    right: '22px',
    zIndex: 10,
    display: 'flex',
    gap: '10px', // Ajustei o espaço para acomodar os novos itens
    alignItems: 'center',
  },
  // 2. Novo estilo para o ícone de globo
  globeIcon: {
    fontSize: '22px',
    color: '#a0aec0', // Cor cinza padrão
  },
  iconSpan: {
    cursor: 'pointer',
    fontSize: '24px',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: 0.6,
    borderRadius: '4px',
    overflow: 'hidden',
  },
  activeIcon: {
    opacity: 1, // Totalmente visível
    boxShadow: '0 0 12px rgba(45, 200, 255, 0.7)', // Brilho azul claro
  },
  // 3. Novo estilo para o separador
  separator: {
    color: '#4a5568', // Cor escura e sutil
    fontSize: '18px',
  }
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isPtActive = i18n.language.startsWith('pt');
  const isEnActive = i18n.language.startsWith('en');

  return (
    <div style={styles.switcherContainer}>
      {/* 4. Adicionamos o ícone de globo no início */}
      
      <span
        className="fi fi-br"
        style={{
          ...styles.iconSpan, 
          ...(isPtActive ? styles.activeIcon : {})
        }} 
        onClick={() => changeLanguage('pt')}
        title="Mudar para Português"
      />

      {/* 5. Adicionamos o separador visual entre as bandeiras */}
      <span style={styles.separator}>|</span>

      <span
        className="fi fi-us"
        style={{
          ...styles.iconSpan, 
          ...(isEnActive ? styles.activeIcon : {})
        }} 
        onClick={() => changeLanguage('en')}
        title="Switch to English"
      />
    </div>
  );
};

export default LanguageSwitcher;