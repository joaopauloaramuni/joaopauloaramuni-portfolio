// src/components/Projetos.jsx

import React from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from '../projectsData';

const Projetos = () => {
  return (
    // ADICIONE O MESMO ESTILO AQUI
    <div style={{ padding: '0 1.5rem' }}>
      <h3 style={{ color: '#00ff9d', marginBottom: '2rem', fontSize: '1.8rem' }}>
        Meus Principais Projetos:
      </h3>
      
      <div>
        {projectsData.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projetos;