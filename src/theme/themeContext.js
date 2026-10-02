import { createContext, useContext } from "react";

// Mesma chave usada pelo script inline do index.html (evita piscar o tema)
export const THEME_STORAGE_KEY = "aramuni-theme";
export const THEMES = ["dark", "light"];
export const DEFAULT_THEME = "dark";

export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
