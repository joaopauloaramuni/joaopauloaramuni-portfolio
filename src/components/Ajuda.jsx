import React from "react";
import { useTranslation } from "react-i18next";
import { commandList } from "../commands";
import "./Ajuda.css";

const Ajuda = () => {
  const { t } = useTranslation();
  return (
    <div className="ajuda-container">
      <p className="ajuda-titulo">{t("ajuda.titulo")}</p>
      {/* Tabela de duas colunas (comando | descrição), como um --help */}
      <div className="ajuda-lista">
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
      </div>

      {/* Atalhos do terminal numa linha só: o "ajuda" inteiro tem que caber
          na tela sem rolagem */}
      <p className="ajuda-dicas">
        {t("ajuda.dicas.titulo")} {t("ajuda.dicas.historico")} · {t("ajuda.dicas.autocomplete")}
      </p>
    </div>
  );
};

export default Ajuda;
