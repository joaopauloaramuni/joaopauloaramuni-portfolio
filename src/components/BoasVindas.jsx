// src/components/BoasVindas.jsx

import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { IoFlash, IoLocationSharp, IoSchool } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import './BoasVindas.css';


const BoasVindas = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'pt';

  const name = t('boasvindas.nome', 'João Paulo Aramuni');
  const title = lang === 'en'
    ? t('boasvindas.titulo', 'Professor at PUC Minas')
    : t('boasvindas.titulo', 'Professor na PUC Minas');

  const sequence = [
    name,
    1000,
    `${name} - ${title}`,
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
        <p className="welcome-title">
          {t('boasvindas.bemvindo', lang === 'en' ? '$ Welcome to my Portfolio' : '$ Bem-vindo ao meu Portfólio')}
        </p>
        <hr className="divider" />
        <ul className="info-list">
          <li>
            <IoFlash className="icon" style={{ color: '#f3d956' }} />
            {t('boasvindas.cargo', title)}
          </li>
          <li>
            <IoLocationSharp className="icon" style={{ color: '#ff6b6b' }} />
            {t('boasvindas.local', lang === 'en' ? 'Belo Horizonte, Minas Gerais, Brazil' : 'Belo Horizonte, Minas Gerais, Brasil')}
          </li>
          <li>
            <IoSchool className="icon" />
            {t('boasvindas.faculdade', lang === 'en' ? 'Software Engineering - PUC Minas' : 'Engenharia de Software - PUC Minas')}
          </li>
        </ul>
        <p className="navegue-text">
          {t('boasvindas.ajuda', lang === 'en' ? 'Type `help` to explore all available commands.' : 'Digite `ajuda` para conhecer mais sobre os comandos.')}
        </p>
      </div>
    </div>
  );
};

export default BoasVindas;