import React from "react";
import { TypeAnimation } from "react-type-animation";
import {
  IoLocationOutline,
  IoSchool,
  IoSchoolOutline,
  IoBriefcaseOutline,
  IoFootballOutline,
  IoBookOutline,
  IoMailOutline,
  IoLogoGithub,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { ARAMUNI_ASCII } from "../data/brandData";
import "./BoasVindas.css";

const BoasVindas = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "pt";
  const name = t("boasvindas.nome");
  const title = t("boasvindas.titulo");
  const sequence = [name, 1000, `${name} ${title}`, 2000];

  return (
    <div className="welcome-container">
      <pre className="aramuni-ascii">{ARAMUNI_ASCII}</pre>
      {/* key muda quando o idioma muda, forçando recriação */}
      <TypeAnimation
        key={lang}
        sequence={sequence}
        wrapper="h1"
        cursor={true}
        repeat={0}
        className="name-animation"
      />
      <div className="static-welcome">
        <p className="welcome-title">{t("boasvindas.bemvindo")}</p>
        <hr className="divider" />
        <p className="welcome-subtitle">{t("boasvindas.subtitulo")}</p>
        <ul className="info-list">
          <li>
            <a
              href="https://www.pucminas.br/campus/lourdes/ensino/graduacao/Paginas/Engenharia-de-Software.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoSchoolOutline className="icon" style={{ color: "var(--icon-school)" }} />
              {t("boasvindas.cargo1")}
            </a>
          </li>
          <li>
            <a
              href="https://icei.pucminas.br/aes"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoBriefcaseOutline
                className="icon"
                style={{ color: "var(--icon-work)" }}
              />
              {t("boasvindas.cargo2")}
            </a>
          </li>
          <li>
            <a
              href="https://github.com/joaopauloaramuni/trabalho-de-conclusao-de-curso-ii"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoBookOutline className="icon" style={{ color: "var(--icon-book)" }} />
              {t("boasvindas.orientacao")}
            </a>
          </li>
          <li>
            <a
              href="https://www.fumec.br/pos-graduacao-em-tecnologia-da-informacao-e-comunicacao-e-gestao-do-conhecimento/"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoSchool className="icon" />
              {t("boasvindas.formacao1")}
            </a>
          </li>
          <li>
            <a
              href="https://processoseletivo.fumec.br/cursos/ciencia-da-computacao/"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoSchool className="icon" />
              {t("boasvindas.formacao2")}
            </a>
          </li>
          <li>
            <a
              href="https://atletico.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoFootballOutline className="icon" />
              {t("boasvindas.esporte")}
            </a>
          </li>
          <li>
            <a
              href="https://www.pucminas.br/campus/coracao-eucaristico/Paginas/como-chegar.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoLocationOutline
                className="icon"
                style={{ color: "var(--icon-location)" }}
              />
              {t("boasvindas.local")}
            </a>
          </li>
          <li>
            <a
              href="mailto:joaopauloaramuni@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoMailOutline className="icon" style={{ color: "var(--icon-mail-gmail)" }} />
              joaopauloaramuni@gmail.com
            </a>
          </li>
          <li>
            <a
              href="mailto:joaoaramuni@pucminas.br"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoMailOutline className="icon" style={{ color: "var(--icon-mail-puc)" }} />
              joaoaramuni@pucminas.br
            </a>
          </li>
          <li>
            <a
              href="https://github.com/joaopauloaramuni/joaopauloaramuni-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <IoLogoGithub className="icon" style={{ color: "var(--icon-github)" }} />
              GitHub Portfolio
            </a>
          </li>
        </ul>
        <p className="navegue-text">{t("boasvindas.ajuda")}</p>
      </div>
    </div>
  );
};

export default BoasVindas;
