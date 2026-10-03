import React from "react";
import { useTranslation } from "react-i18next";
import { commandList } from "../commands";
import "./Ajuda.css";

const Ajuda = () => {
  const { t } = useTranslation();
  const exampleLink = `${window.location.origin}/${t("ajuda.dicas.link_exemplo")}`;
  return (
    <div className="ajuda-container">
      <p>{t("ajuda.titulo")}</p>
      {Object.values(commandList).map((cmd, index) => {
        const allAliases = [cmd.name, ...cmd.aliases].join(" | ");
        return (
          <div key={`help-${index}`} className="ajuda-item">
            <div className="ajuda-aliases">
              <span className="ajuda-aliases-symbol">&gt;</span>
              <span>{allAliases}</span>
            </div>
            <span className="ajuda-description">- {t(`ajuda.${cmd.name}.desc`)}</span>
          </div>
        );
      })}

      {/* Atalhos do terminal e link direto (?cmd=) */}
      <div className="ajuda-dicas">
        <p>{t("ajuda.dicas.titulo")}</p>
        <p>
          <span className="ajuda-aliases-symbol">&gt;</span>
          {t("ajuda.dicas.historico")}
        </p>
        <p>
          <span className="ajuda-aliases-symbol">&gt;</span>
          {t("ajuda.dicas.autocomplete")}
        </p>
        <p>
          <span className="ajuda-aliases-symbol">&gt;</span>
          {t("ajuda.dicas.link", { url: exampleLink })}
        </p>
      </div>
    </div>
  );
};

export default Ajuda;
