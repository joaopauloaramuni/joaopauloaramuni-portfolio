import React from "react";
import { useTranslation } from "react-i18next";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "../theme/themeContext";

// Sol no tema escuro (vai para o claro), lua no tema claro (volta ao escuro)
const ThemeToggle = ({ onToggle }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const label = isLight ? t("tema.ativar_escuro") : t("tema.ativar_claro");

  const handleClick = () => {
    toggleTheme();
    if (onToggle) onToggle();
  };

  return (
    <button
      type="button"
      className="themeToggle"
      // Clique com mouse/toque não rouba o foco: senão o próximo Espaço/Enter
      // (ex.: para pular o boot) apertaria o botão de novo e destrocaria o tema
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      {isLight ? <IoMoonOutline /> : <IoSunnyOutline />}
    </button>
  );
};

export default ThemeToggle;
