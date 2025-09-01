// src/components/ExperienceCard.jsx

import React from 'react';
import './ExperienceCard.css';

const ExperienceCard = ({ experience }) => {
  const { role, company, startDate, endDate, description, skills } = experience;

  return (
    <div className="experience-card">
      {/* Data marker da timeline */}
      <div className="timeline-date"></div>
      <div className="timeline-marker"></div>

      {/* Conteúdo da experiência */}
      <div className="experience-content">
        <h3 className="role-title">
          {role} <span className="company-name">@ {company}</span>
        </h3>
        <p className="date-range">{startDate} – {endDate}</p>

        {/* Descrição da experiência */}
        <ul className="description-list">
          {description.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        {/* Skills */}
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
