// src/components/Experiencias.jsx

import React from 'react';
import { useTranslation } from 'react-i18next'; // ou seu hook de i18n
import { experiencesData } from '../experiencesData';
import ExperienceCard from './ExperienceCard';

const Experiencias = () => {
  const { t, i18n } = useTranslation();

  // Transformar dados brutos em objetos traduzidos
  const translatedExperiences = experiencesData.map(exp => ({
    ...exp,
    role: t(`experiencias.${exp.roleId}`),
    company: t(`experiencias.${exp.companyId}`),
    description: t(`experiencias.${exp.descriptionId}`).split('. ').filter(p => p), // transforma em lista de pontos
    skills: t(`experiencias.${exp.skillsId}`).split(', ').filter(s => s), // transforma em array
  }));

  return (
    <div style={{ padding: '0 1.5rem' }}>
      <h3 style={{ color: '#00ff9d', marginBottom: '2rem', fontSize: '1.8rem' }}>
        {t('experiencias.titulo')}
      </h3>

      <div className="timeline-container">
        {translatedExperiences.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
};

export default Experiencias;
