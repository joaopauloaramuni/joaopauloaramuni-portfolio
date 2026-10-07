import React from "react";
import { useTheme } from "../theme/themeContext";
import "./GaloFundo.css";

// Fundo do tema "galo": a foto do galo (public/galo/galo-fundo.webp) à
// direita, esmaecendo para o preto do terminal. Fica atrás do terminal e
// não recebe cliques; só existe no tema galo.
const GaloFundo = () => {
  const { theme } = useTheme();
  if (theme !== "galo") return null;

  return (
    <div className="galo-fundo" aria-hidden="true">
      <img className="galo-fundo-galo" src="/galo/galo-fundo.webp" alt="" />
    </div>
  );
};

export default GaloFundo;
