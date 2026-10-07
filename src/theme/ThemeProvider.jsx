import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ThemeContext,
  THEME_STORAGE_KEY,
  THEMES,
  DEFAULT_THEME,
  nextTheme,
} from "./themeContext";

// Lê o tema salvo; sem escolha anterior (ou sem localStorage) abre no dark
const readStoredTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

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

  // Ciclo escuro → claro → galo → escuro...
  const toggleTheme = useCallback(() => {
    setTheme(nextTheme(theme));
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
