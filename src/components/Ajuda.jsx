// src/components/Ajuda.jsx


import React from 'react';
import { useTranslation } from 'react-i18next';
import { commandList } from '../commands';

const Ajuda = () => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '0 1.5rem' }}>
      <p>{t('ajuda.titulo', 'Comandos disponíveis:')}</p>
      {Object.values(commandList).map((cmd, index) => {
        const allAliases = [cmd.name, ...cmd.aliases].join(' | ');
        return (
          <div key={`help-${index}`} style={{ marginBottom: '1.2rem' }}>
            <div style={{ color: '#00ff9d' }}>
              <span style={{ marginRight: '1ch' }}>&gt;</span>
              <span>{allAliases}</span>
            </div>
            <p style={{ margin: '0.25em 0 0 2.5ch', color: '#a0aec0' }}>
              {t(`ajuda.${cmd.name}.desc`, cmd.description)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Ajuda;