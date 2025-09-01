// src/components/Experiencias.jsx

import React from 'react';
import { experiencesData } from '../experiencesData';
import ExperienceCard from './ExperienceCard';

const Experiencias = () => {
  return (
    // ADICIONE O ESTILO AQUI
    <div style={{ padding: '0 1.5rem' }}>
      <h3 style={{ color: '#ff851b', marginBottom: '2rem', fontSize: '1.8rem' }}>
        Minha Trajetória Profissional:
      </h3>
      
      <div className="timeline-container">
        {experiencesData.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
};

export default Experiencias;