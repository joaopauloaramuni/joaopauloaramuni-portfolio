// src/components/Ajuda.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { commandList } from '../commands';
import './Ajuda.css';

const Ajuda = () => {
  const { t } = useTranslation();
  return (
    <div className="ajuda-container">
      <p>{t('ajuda.titulo', 'Comandos disponíveis:')}</p>
      {Object.values(commandList).map((cmd, index) => {
        const allAliases = [cmd.name, ...cmd.aliases].join(' | ');
        return (
          <div key={`help-${index}`} className="ajuda-item">
            <div className="ajuda-aliases">
              <span className="ajuda-aliases-symbol">&gt;</span>
              <span>{allAliases}</span>
            </div>
            <p className="ajuda-description">
              {t(`ajuda.${cmd.name}.desc`)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Ajuda;
