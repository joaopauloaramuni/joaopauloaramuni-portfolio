// src/components/SobreMim.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import './SobreMim.css';

const SobreMim = () => {
  const { t } = useTranslation();

  return (
    <div className="sobre-container">
      <div className="avatar-container">
        <img src="/avatar.jpeg" alt="Avatar" className="avatar-image" />
      </div>
      <div className="info-container">
        <h2 className="nome-titulo">{t('sobre.nome')}</h2>
        <h4 className="cargo-titulo">{t('sobre.cargo')}</h4>
        
        <p className="biografia">
          {t('sobre.biografia')}
        </p>
        
        <div className="skills-tags-container">
          <p className="skills-titulo">
            {t('sobre.titulo_skills')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SobreMim;
