// src/components/BoasVindas.jsx

import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { IoLocationSharp, IoSchool, IoSchoolOutline, IoBriefcase } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import './BoasVindas.css';

const BoasVindas = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'pt';
  const name = t('boasvindas.nome');
  const title = t('boasvindas.titulo');

  const sequence = [
    name,
    1000,
    `${name} ${title}`,
    2000,
  ];

  return (
    <div className="welcome-container">
      {/* key muda quando o idioma muda, forçando recriação */}
      <TypeAnimation
        key={lang}
        sequence={sequence}
        wrapper="h1"
        cursor={true}
        repeat={0}
        className="name-animation"
      />
      <div className="static-welcome">
        <p className="welcome-title">{t('boasvindas.bemvindo')}</p>
        <hr className="divider" />
        <ul className="info-list">
            <li>
            <IoSchoolOutline className="icon" style={{ color: '#f3d956' }} />
            {t('boasvindas.cargo1')}
          </li>
          <li>
            <IoBriefcase className="icon" style={{ color: '#8B4513' }} />
            {t('boasvindas.cargo2')}
          </li>
          <li>
            <IoSchool className="icon" style={{ color: '#ccc' }} />
            {t('boasvindas.formacao1')}
          </li>
          <li>
            <IoSchool className="icon" style={{ color: '#ccc' }} />
            {t('boasvindas.formacao2')}
          </li>
          <li>
            <IoLocationSharp className="icon" style={{ color: '#ff6b6b' }} />
            {t('boasvindas.local')}
          </li>
        </ul>
        <p className="navegue-text">{t('boasvindas.ajuda')}</p>
      </div>
    </div>
  );
};

export default BoasVindas;
