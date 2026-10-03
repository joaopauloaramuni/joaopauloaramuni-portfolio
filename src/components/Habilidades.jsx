import React, { useId } from "react";
import { skillsData } from "../data/skillsData";
import { SKINS, DEFAULT_SKIN } from "../data/skillSkins";
import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import SkinsFooter from "./SkinsFooter";
import "./Habilidades.css";

// Faixa de nível exibida ao lado da porcentagem
const levelKey = (level) =>
  level >= 80 ? "avancado" : level >= 50 ? "intermediario" : "basico";

// Variáveis CSS de cada skill: cor do logo, degradê, nível e posição
const skillStyle = (skill, index) => ({
  "--skill": skill.color,
  "--skill-from": skill.gradient[0],
  "--skill-to": skill.gradient[1],
  "--level": `${skill.level}%`,
  "--i": index,
});

// Link para o repositório: o item inteiro é clicável nos três estilos
function SkillLink({ skill, className, children }) {
  const { t } = useTranslation();
  return (
    <a
      className={className}
      href={skill.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("habilidades.verRepositorio", { name: skill.name })}
    >
      {children}
    </a>
  );
}

/* ---------- skills --cards: logo dentro de um anel de progresso ---------- */
function CardSkill({ skill, index }) {
  const { t } = useTranslation();
  const gradientId = useId();
  const Icon = skill.icon;

  return (
    <li className="skill-card" style={skillStyle(skill, index)}>
      <SkillLink skill={skill} className="skill-card-link">
        <FaGithub className="skill-card-github" aria-hidden="true" />

        <div
          className="skill-ring"
          role="img"
          aria-label={`${skill.name}: ${skill.level}%`}
        >
          <svg className="skill-ring-svg" viewBox="0 0 80 80" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor={skill.gradient[0]} />
                <stop offset="100%" stopColor={skill.gradient[1]} />
              </linearGradient>
            </defs>
            <circle className="skill-ring-track" cx="40" cy="40" r="34" />
            <circle
              className="skill-ring-fill"
              cx="40"
              cy="40"
              r="34"
              pathLength="100"
              stroke={`url(#${gradientId})`}
              style={{ "--offset": 100 - skill.level }}
            />
          </svg>
          <Icon className="skill-ring-icon" aria-hidden="true" />
        </div>

        <span className="skill-name">{skill.name}</span>
        <span className="skill-card-meta">
          {skill.level}% · {t(`habilidades.nivel.${levelKey(skill.level)}`)}
        </span>
      </SkillLink>
    </li>
  );
}

/* ---------- skills --lista: logo + barra com o degradê da marca ---------- */
function ListaSkill({ skill, index }) {
  const { t } = useTranslation();
  const Icon = skill.icon;

  return (
    <li className="skill-row" style={skillStyle(skill, index)}>
      <SkillLink skill={skill} className="skill-row-link">
        <span className="skill-tile" aria-hidden="true">
          <Icon />
        </span>
        <div className="skill-body">
          <div className="skill-head">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-badge">
              {t(`habilidades.nivel.${levelKey(skill.level)}`)}
            </span>
            <span className="skill-pct">{skill.level}%</span>
          </div>
          <div
            className="skill-track"
            role="img"
            aria-label={`${skill.name}: ${skill.level}%`}
          >
            <div className="skill-fill" />
          </div>
        </div>
        <FiArrowUpRight className="skill-go" aria-hidden="true" />
      </SkillLink>
    </li>
  );
}

/* ---------- skills / skills --terminal (padrão): barra em blocos, estilo CLI ---------- */
const SEGMENTS = 20;
function TerminalSkill({ skill, index }) {
  const { t } = useTranslation();
  const Icon = skill.icon;
  const filled = Math.round((skill.level / 100) * SEGMENTS);

  return (
    <li className="skill-term" style={skillStyle(skill, index)}>
      <SkillLink skill={skill} className="skill-term-link">
        <Icon className="skill-term-icon" aria-hidden="true" />
        <span className="skill-name">{skill.name}</span>
        <span
          className="skill-term-bar"
          role="img"
          aria-label={`${skill.name}: ${skill.level}%`}
        >
          {Array.from({ length: SEGMENTS }, (_, s) => (
            <span
              key={s}
              className={s < filled ? "seg on" : "seg"}
              style={{ "--s": s }}
            />
          ))}
        </span>
        <span className="skill-pct">{skill.level}%</span>
        <span className="skill-term-level">
          {t(`habilidades.nivel.${levelKey(skill.level)}`)}
        </span>
      </SkillLink>
    </li>
  );
}

const SKIN_LAYOUT = {
  cards: { listClass: "skills-grid", Item: CardSkill },
  lista: { listClass: "skills-list", Item: ListaSkill },
  terminal: { listClass: "skills-term", Item: TerminalSkill },
};

export default function Habilidades({ skin = DEFAULT_SKIN }) {
  const { t } = useTranslation();
  const { listClass, Item } = SKIN_LAYOUT[skin] ?? SKIN_LAYOUT[DEFAULT_SKIN];

  return (
    <div className="habilidades-container">
      <h3 className="habilidades-titulo">{t("habilidades.titulo")}</h3>

      {skillsData.length ? (
        <ul className={listClass}>
          {skillsData.map((skill, idx) => (
            <Item key={skill.name} skill={skill} index={idx} />
          ))}
        </ul>
      ) : (
        <p className="habilidades-vazio">{t("habilidades.nenhuma")}</p>
      )}

      {/* Mostra os outros estilos, como a ajuda de um comando de terminal */}
      <SkinsFooter skins={SKINS} active={skin} namespace="habilidades" />
    </div>
  );
}
