
import React from 'react';
import { certificationsData } from '../certificationsData';
import { useTranslation } from 'react-i18next';
import './Certificacoes.css';

const order = { Practitioner: 1, Associate: 2, Professional: 3 };
const sortedCerts = [...certificationsData].sort((a, b) => order[a.level] - order[b.level]);

export default function Certificacoes() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('en') ? 'en' : 'pt';
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>{t('certificacoes.titulo', 'Certificações')}</h2>
      {sortedCerts.map((cert, idx) => (
        <div className="cert-card" key={idx}>
          <div style={{ flex: 1 }}>
            <div className="experience-title" style={{ fontWeight: 'bold', fontSize: 18 }}>{t(`certificacoes.${cert.title}.titulo`, cert.title)}</div>
            <div className="experience-company">Company</div>
            {cert.description && (
              <div style={{ margin: '8px 0 0 0', fontSize: 15, color: '#cbd5e1' }}>{t(`certificacoes.${cert.title}.descricao`, cert.description)}</div>
            )}
            <a href={cert.link} className="experience-link" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline', display: 'inline-block', marginTop: 8 }}>{t('certificacoes.link', '🔗 Ver Credencial')}</a>
          </div>
          <a href={cert.link} target="_blank" rel="noopener noreferrer">
            <img src={cert.image} alt={cert.title} />
          </a>
        </div>
      ))}
    </div>
  );
}
