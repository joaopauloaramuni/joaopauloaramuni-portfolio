import React, { Component } from "react";
import { useTranslation } from "react-i18next";
import { TerminalOutput } from "react-terminal-ui";

// Peças do lazyCommand.jsx (num arquivo só de componentes, para o Fast Refresh)

// Linha de aviso no idioma atual ("Carregando...", "Não foi possível...")
export function Aviso({ chave }) {
  const { t } = useTranslation();
  return <TerminalOutput>{t(chave)}</TerminalOutput>;
}

export class FalhaAoCarregar extends Component {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  componentDidCatch(error) {
    console.error("Comando: falha ao carregar ou mostrar", error);
    this.props.onError?.();
  }

  render() {
    if (this.state.falhou) {
      return <Aviso chave="comando.falha_carregar" />;
    }
    return this.props.children;
  }
}
