import React from "react";
import { useTranslation } from "react-i18next";
import "./SkinsFooter.css";

// Rodapé "Estilos: --cards --lista --terminal", como a ajuda de um comando
// de terminal. Usado por "skills" e "wakatime"; os nomes vêm de
// `${namespace}.estilos` e `${namespace}.skins.<estilo>` no i18n.
export default function SkinsFooter({ skins, active, namespace }) {
  const { t } = useTranslation();

  return (
    <p className="skins-footer">
      <span className="skins-footer-label">{t(`${namespace}.estilos`)}</span>
      {skins.map((name) => (
        <code
          key={name}
          className={name === active ? "skins-footer-skin ativo" : "skins-footer-skin"}
          aria-current={name === active ? "true" : undefined}
        >
          --{t(`${namespace}.skins.${name}`)}
        </code>
      ))}
    </p>
  );
}
