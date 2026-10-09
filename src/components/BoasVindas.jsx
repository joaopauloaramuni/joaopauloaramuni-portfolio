import React, { useEffect, useState } from "react";
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
  IoSunnyOutline,
  IoMoonOutline,
  IoPartlySunnyOutline,
  IoCloudyNightOutline,
  IoCloudyOutline,
  IoRainyOutline,
  IoThunderstormOutline,
  IoSnowOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { ARAMUNI_ASCII } from "../data/brandData";
import AramuniLogo from "./AramuniLogo";
import { useTheme } from "../theme/themeContext";
import { obterVisitas } from "../lib/visitas";
import { obterClima, grupoDoTempo } from "../lib/clima";
import StatusAgora from "./StatusAgora";
import "./BoasVindas.css";

// Ícone do tempo (mesma família io5 dos outros ícones da boas-vindas)
const iconeDoTempo = (grupo, dia) => {
  switch (grupo) {
    case "limpo":
      return dia ? IoSunnyOutline : IoMoonOutline;
    case "poucas_nuvens":
      return dia ? IoPartlySunnyOutline : IoCloudyNightOutline;
    case "garoa":
    case "chuva":
      return IoRainyOutline;
    case "tempestade":
      return IoThunderstormOutline;
    case "neve":
      return IoSnowOutline;
    default:
      return IoCloudyOutline;
  }
};

// Clima da cidade aproximada do visitante, ao lado do contador de visitas.
// A cidade vai sempre escrita: se a estimativa pelo IP errar, fica claro que
// é outra cidade (ver api/_clima.js).
const Clima = ({ clima, separador }) => {
  const { t } = useTranslation();
  const grupo = grupoDoTempo(clima.codigo);
  const Icone = iconeDoTempo(grupo, clima.dia);
  const descricao = t(`boasvindas.clima.${grupo}`);
  const lugar = [clima.cidade, clima.regiao].filter(Boolean).join(", ");
  const dica = `${descricao}, ${t("boasvindas.clima.agora")} ${t(
    "boasvindas.clima.em"
  )} ${lugar}. ${t("boasvindas.clima.aproximado")}`;

  return (
    <span className="welcome-clima" title={dica}>
      {separador && <span className="welcome-sep" aria-hidden="true">·</span>}
      <Icone className="welcome-clima-icon" aria-hidden="true" />
      <span className="welcome-visitas-num">
        {clima.temp}°{clima.unidade}
      </span>{" "}
      <span className="sr-only">{descricao}, </span>
      {t("boasvindas.clima.em")} {clima.cidade}
    </span>
  );
};

const BoasVindas = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const lang = i18n.language.startsWith("en") ? "en" : "pt";
  const name = t("boasvindas.nome");
  const title = t("boasvindas.titulo");
  const sequence = [name, 1000, `${name} ${title}`, 2000];

  // Total de visitas ao portfólio (soma +1 só uma vez por sessão, ver lib/visitas.js)
  const [visitas, setVisitas] = useState(null);
  useEffect(() => {
    let ativo = true;
    obterVisitas().then((total) => {
      if (ativo) setVisitas(total);
    });
    return () => {
      ativo = false;
    };
  }, []);

  // Clima da cidade do visitante (some se a cidade não for conhecida)
  const [clima, setClima] = useState(null);
  useEffect(() => {
    let ativo = true;
    obterClima().then((dados) => {
      if (ativo) setClima(dados);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="welcome-container">
      {/* Logo à esquerda do banner: as duas crescem juntas (mesma fonte) */}
      <div className="welcome-brand">
        {/* No tema galo, o escudo do Atlético entra no lugar da logo */}
        {theme === "galo" ? (
          <img
            src="/galo/escudo-cam.webp"
            alt={t("boasvindas.escudo_alt")}
            className="welcome-logo welcome-escudo"
            width="480"
            height="714"
          />
        ) : (
          <AramuniLogo className="welcome-logo" />
        )}
        <pre className="aramuni-ascii">{ARAMUNI_ASCII}</pre>
      </div>
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
        {/* Em aula, disponível, fim de semana ou feriado: sai do horário do
            cal, sem rede, então vem antes do contador e não "pula" */}
        <StatusAgora />
        {(visitas != null || clima) && (
          <p className="welcome-visitas">
            {"> "}
            {visitas != null && (
              <span className="welcome-visitas-total">
                <span className="welcome-visitas-num">
                  {Number(visitas).toLocaleString(lang === "en" ? "en-US" : "pt-BR")}
                </span>{" "}
                {t("boasvindas.visitas")}
              </span>
            )}
            {clima && <Clima clima={clima} separador={visitas != null} />}
          </p>
        )}
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
          {/* Dois links na mesma linha: o item não é um <a>, cada nome é */}
          <li>
            <span className="icon-link icon-link-multi">
              <IoBriefcaseOutline
                className="icon"
                style={{ color: "var(--icon-work)" }}
              />
              <span>
                {t("boasvindas.consultoria")}{" "}
                <a
                  href="https://www.linkedin.com/company/jedis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-link"
                >
                  JDSDEV
                </a>
                {" - "}
                <a
                  href="https://www.jedis.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-link"
                >
                  Jedis Tecnologia
                </a>
              </span>
            </span>
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
        <p className="navegue-text">
          {t("boasvindas.ajuda")
            .split("`")
            .map((parte, i) =>
              i % 2 === 1 ? (
                <span key={i} className="navegue-cmd">
                  {parte}
                </span>
              ) : (
                parte
              )
            )}
        </p>
      </div>
    </div>
  );
};

export default BoasVindas;
