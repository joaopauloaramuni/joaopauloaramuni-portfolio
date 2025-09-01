// src/components/SobreMim.jsx

import React from 'react';
// 1. Importe o hook 'useTranslation'
import { useTranslation } from 'react-i18next';
import './SobreMim.css';

const SobreMim = () => {
  // 2. Inicialize o hook para ter acesso à função 't' (de "translate")
  const { t } = useTranslation();


  return (
    <div className="sobre-container" style={{ padding: '0 1.5rem' }}>
      <div className="avatar-container">
        <img src="/avatar.jpeg" alt="Avatar" className="avatar-image" />
      </div>
      <div className="info-container">
        {/* 3. Substitua o texto fixo pela função t() com a chave da tradução */}
        <h2 className="nome-titulo">{t('sobre.nome')}</h2>
        <h4 className="cargo-titulo">{t('sobre.cargo')}</h4>
        
        <p className="biografia">
          {t('sobre.biografia')}
        </p>
        
      </div>
    </div>
  );
};

export default SobreMim;