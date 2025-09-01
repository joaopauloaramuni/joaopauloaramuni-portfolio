import React from 'react';
import { awardsData } from '../awardsData';
import { useTranslation } from 'react-i18next';
import './Premios.css';

export default function Premios() {
  const { t } = useTranslation();

  if (!awardsData.length) {
    return (
      <div>
        <h2>{t('premios.titulo')}</h2>
        <p>{t('premios.nenhum')}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 1.5rem' }}>
      <h3 style={{ color: '#00ff9d', marginBottom: '2rem', fontSize: '1.8rem' }}>
        {t('premios.titulo')}
      </h3>
      {awardsData.map((award, idx) => (
        <div className="premio-sobre-container" key={idx}>
          {award.image && (
            <div className="premio-avatar-container">
              <a href={award.link || '#'} target="_blank" rel="noopener noreferrer">
                <img
                  src={award.image}
                  alt={t(`premios.${award.id}.titulo`)}
                  className="premio-avatar-image"
                />
              </a>
            </div>
          )}
          <div className="premio-info-container">
            <div className="premio-title">
              {t(`premios.${award.id}.titulo`)}
            </div>
            <div className="premio-org">
              {t(`premios.${award.id}.org`)}
            </div>
            {award.year && <div className="premio-year">{award.year}</div>}
            <div className="premio-desc">
              {t(`premios.${award.id}.desc`)}
            </div>
            {award.link && (
              <a
                href={award.link}
                className="premio-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span role="img" aria-label="link">🔗</span> {t('premios.link')}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
