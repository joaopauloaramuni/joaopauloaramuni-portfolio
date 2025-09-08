import React from "react";
import "./ExperienceCard.css";

const ExperienceCard = ({ experience }) => {
  const { role, company, startDate, endDate, description, skills, logo } = experience;

  return (
    <div className="experience-card">
      {/* Linha da timeline */}
      <div className="timeline-date"></div>
      <div className="timeline-marker"></div>

      {/* Conteúdo do card */}
      <div className="experience-content">
        <div className="role-container">
          {/* Logo da empresa */}
          {logo && (
            <img
              src={logo}
              alt={`${company} logo`}
              className="company-logo"
            />
          )}

          {/* Cargo em cima e empresa abaixo */}
          <div className="role-text">
            <h3 className="role-title">{role}</h3>
            <p className="company-name">@ {company}</p>
          </div>
        </div>

        {/* Datas */}
        <p className="date-range">
          {startDate} – {endDate}
        </p>

        {/* Descrição */}
        <ul className="description-list">
          {description.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        {/* Skills */}
        <div className="skills-container">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
