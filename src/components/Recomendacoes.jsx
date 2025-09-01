import React from 'react';
import { recommendationsData } from '../recommendationsData';
import { useTranslation } from 'react-i18next';
import './Recomendacoes.css';

export default function Recomendacoes() {
  const { t } = useTranslation();

  if (!recommendationsData.length) {
    return (
      <div>
        <h2>{t('recomendacoes.titulo')}</h2>
        <p>{t('recomendacoes.nenhum')}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 1.5rem' }}>
      <h3 style={{ color: '#00ff9d', marginBottom: '2rem', fontSize: '1.8rem' }}>
        {t('recomendacoes.titulo')}
      </h3>

      {recommendationsData.map((rec, idx) => (
        <div className="recomendacao-sobre-container" key={idx}>
          {rec.image && (
            <div className="recomendacao-avatar-container">
              <a href={rec.link || '#'} target="_blank" rel="noopener noreferrer">
                <img src={rec.image} alt={rec.name} className="recomendacao-avatar-image" />
              </a>
            </div>
          )}
          <div className="recomendacao-info-container">
            <div style={{ color: '#00ff9d', fontWeight: 'bold', fontSize: 18 }}>
              {rec.name}
            </div>
            <div style={{ fontStyle: 'italic', fontSize: 14 }}>
              {rec.relationship}
            </div>
            <div style={{ margin: '8px 0', fontSize: 15, color: '#cbd5e1' }}>
              {rec.recommendation}
            </div>
            {rec.link && (
              <a
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#a78bfa', textDecoration: 'underline', display: 'inline-block', marginTop: 8 }}
              >
                <span role="img" aria-label="link">🔗</span> {t('recomendacoes.link', 'LinkedIn')}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
