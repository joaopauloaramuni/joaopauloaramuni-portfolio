import { createContext, useContext } from "react";

// Mesma chave usada pelo script inline do index.html (evita piscar o tema)
export const THEME_STORAGE_KEY = "aramuni-theme";
// A ordem é a do ciclo do comando "tema" sem opção: escuro → claro → galo → matrix
export const THEMES = ["dark", "light", "galo", "matrix"];
export const DEFAULT_THEME = "dark";

// Próximo tema do ciclo (depois do último volta ao primeiro)
export const nextTheme = (theme) =>
  THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
  matrixLayout: "chuva",
  setMatrixLayout: () => {},
});

export const useTheme = () => useContext(ThemeContext);
