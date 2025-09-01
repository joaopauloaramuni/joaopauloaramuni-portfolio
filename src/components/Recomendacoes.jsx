// src/components/Recomendacoes.jsx
import React from 'react';
import { recommendationsData } from '../recommendationsData';
import { useTranslation } from 'react-i18next';

export default function Recomendacoes() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'pt';

  if (!recommendationsData.length) {
    return (
      <div>
        <h2>{t('recomendacoes.titulo', 'Recomendações')}</h2>
        <p>{t('recomendacoes.nenhum', 'Nenhuma recomendação cadastrada ainda.')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>{t('recomendacoes.titulo', 'Recomendações')}</h2>
      {recommendationsData.map((rec, idx) => (
        <div className="premio-sobre-container" key={idx}>
          {rec.image && (
            <div className="premio-avatar-container">
              <a href={rec.link || '#'} target="_blank" rel="noopener noreferrer">
                <img src={rec.image} alt={rec.name} className="premio-avatar-image" />
              </a>
            </div>
          )}
          <div className="premio-info-container">
            <div className="experience-title" style={{ fontWeight: 'bold', fontSize: 18 }}>
              {rec.name}
            </div>
            <div className="experience-company" style={{ fontStyle: 'italic', fontSize: 14 }}>
              {rec.relationship}
            </div>
            <div style={{ margin: '8px 0', fontSize: 15, color: '#cbd5e1' }}>
              {rec.recommendation}
            </div>
            {rec.link && (
              <a
                href={rec.link}
                className="experience-link"
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
