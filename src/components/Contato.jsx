// src/components/Contato.jsx

import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp, FaDiscord } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Contato.css';

const Contato = () => {
  const { t } = useTranslation();

  const seuLinkedIn = "https://www.linkedin.com/in/joaopauloaramuni/";
  const seuGitHub = "https://github.com/joaopauloaramuni";
  const seuEmail = "joaopauloaramuni@gmail.com";
  const seuWhatsapp = "https://wa.me/5531980402103";
  const seuDiscord = "https://discordapp.com/users/959151773728251914";

  return (
    <div className="contato-container" style={{ padding: '0 1.5rem' }}>
      <h3 className="contato-titulo">{t('contato.titulo')}</h3>
      <p className="contato-subtitulo">{t('contato.subtitulo')}</p>

      <div className="contato-links">
        <a href={seuLinkedIn} target="_blank" rel="noopener noreferrer" className="contato-item">
          <FaLinkedin className="contato-icone" />
          <span>LinkedIn</span>
        </a>

        <a href={seuGitHub} target="_blank" rel="noopener noreferrer" className="contato-item">
          <FaGithub className="contato-icone" />
          <span>GitHub</span>
        </a>

        <a href={seuWhatsapp} target="_blank" rel="noopener noreferrer" className="contato-item">
          <FaWhatsapp className="contato-icone" />
          <span>WhatsApp</span>
        </a>

        <a href={seuDiscord} target="_blank" rel="noopener noreferrer" className="contato-item">
          <FaDiscord className="contato-icone" />
          <span>Discord</span>
        </a>

        <a href={`mailto:${seuEmail}`} className="contato-item">
          <FaEnvelope className="contato-icone" />
          <span>{seuEmail}</span>
        </a>
      </div>
    </div>
  );
};

export default Contato;
