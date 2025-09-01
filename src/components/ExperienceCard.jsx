// src/components/ExperienceCard.jsx

import React from 'react';
import './ExperienceCard.css';

const ExperienceCard = ({ experience }) => {
  const { role, company, companyDescription, startDate, endDate, description, skills } = experience;

  return (
    <div className="experience-card">
      {/* NOVO ELEMENTO PARA A DATA NA TIMELINE */}
      <div className="timeline-date"></div>
      
      <div className="timeline-marker"></div>
      <div className="experience-content">
        <h3 className="role-title">{role} <span className="company-name">@ {company}</span></h3>
        <p className="date-range">{startDate} – {endDate}</p>
        
        <ul className="description-list">
          {description.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
        
        <p className="company-info">{companyDescription}</p>

        <div className="skills-container">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;