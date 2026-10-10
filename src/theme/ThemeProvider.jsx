import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ThemeContext,
  THEME_STORAGE_KEY,
  THEMES,
  DEFAULT_THEME,
  nextTheme,
} from "./themeContext";
import MATRIX_CONFIG from "../config/matrixConfig";

// Lê o tema salvo; sem escolha anterior (ou sem localStorage) abre no dark
const readStoredTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

// Layout do fundo matrix: ?matrix=neo na URL tem prioridade (para testar),
// depois o salvo, depois o padrão
const readMatrixLayout = () => {
  const { LAYOUTS, PADRAO, STORAGE_KEY, ALIASES } = MATRIX_CONFIG;
  try {
    const param = new URLSearchParams(window.location.search).get("matrix");
    const fromUrl = ALIASES[param] ?? param;
    if (LAYOUTS.includes(fromUrl)) return fromUrl;
    const saved = localStorage.getItem(STORAGE_KEY);
    return LAYOUTS.includes(saved) ? saved : PADRAO;
  } catch {
    return PADRAO;
  }
};

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);
  const [matrixLayout, setMatrixLayoutState] = useState(readMatrixLayout);

  // <html data-theme="..."> ativa os tokens de theme.css
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Só salva quando o visitante escolhe: quem nunca trocou continua no padrão
  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* navegação privada: o tema vale só para esta visita */
    }
  }, []);

  const setMatrixLayout = useCallback((next) => {
    if (!MATRIX_CONFIG.LAYOUTS.includes(next)) return;
    setMatrixLayoutState(next);
    try {
      localStorage.setItem(MATRIX_CONFIG.STORAGE_KEY, next);
    } catch {
      /* navegação privada: vale só para esta visita */
    }
  }, []);

  // Ciclo escuro → claro → galo → matrix → escuro...
  const toggleTheme = useCallback(() => {
    setTheme(nextTheme(theme));
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, matrixLayout, setMatrixLayout }),
    [theme, setTheme, toggleTheme, matrixLayout, setMatrixLayout]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
