import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useCommandAtTop from "../terminal/useCommandAtTop";
import "./QuakeGame.css";
import "./BotaoVoltar.css";

// "jogo --doom" / "doom": o Doom shareware original (episódio 1) dentro do
// terminal. Mesmo desenho do Quake (ver QuakeGame.jsx): o jogo roda num
// iframe (public/doom/index.html), isolado do React, e sair do comando
// desmonta o iframe e encerra tudo de uma vez: wasm, som e mouse. A moldura
// também é a mesma (QuakeGame.css), em 4:3 como no monitor da época.
//
// Os ~6 MB (motor + doom1.wad) só descem quando o comando roda.
const DoomGame = ({ onExit }) => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const frameRef = useRef(null);
  useCommandAtTop(ref);

  // O idioma só vale na abertura: trocar PT | EN não reinicia o jogo
  const srcRef = useRef(`/doom/index.html?lang=${i18n.language}`);

  // "Quit Game" no menu do Doom volta ao terminal
  const onExitRef = useRef(onExit);
  useEffect(() => {
    onExitRef.current = onExit;
  });

  useEffect(() => {
    function onMessage(e) {
      if (e.origin !== window.location.origin) return;
      if (e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.origem === "doom" && e.data.tipo === "sair") onExitRef.current?.();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Teclado direto no jogo: o terminal está em pausa enquanto ele está aberto
  const focusGame = () => frameRef.current?.focus();

  const fullscreen = () => {
    const frame = frameRef.current;
    if (!frame) return;
    const request = frame.requestFullscreen ?? frame.webkitRequestFullscreen;
    request?.call(frame)?.catch?.(() => {});
    focusGame();
  };

  return (
    <div className="quake-container" ref={ref}>
      <div className="quake-titulo">{t("jogo.doom.titulo")}</div>
      <div className="quake-moldura">
        <iframe
          ref={frameRef}
          className="quake-frame"
          src={srcRef.current}
          title={t("jogo.doom.titulo")}
          allow="fullscreen; autoplay"
          allowFullScreen
          onLoad={focusGame}
        />
      </div>
      <p className="quake-ajuda">{t("jogo.doom.ajuda")}</p>
      <div className="jogo-botoes quake-botoes">
        <button type="button" className="btn-voltar-terminal" onClick={fullscreen}>
          {t("jogo.doom.tela_cheia")}
        </button>
        {onExit && (
          <button type="button" className="btn-voltar-terminal" onClick={onExit}>
            {t("jogo.voltar_terminal")}
          </button>
        )}
      </div>
      <p className="quake-creditos">{t("jogo.doom.creditos")}</p>
    </div>
  );
};

export default DoomGame;
