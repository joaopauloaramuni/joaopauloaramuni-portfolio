import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useCommandAtTop from "../terminal/useCommandAtTop";
import "./QuakeGame.css";
import "./BotaoVoltar.css";

// "jogo" / "quake": o Quake shareware original (episódio 1) dentro do terminal.
//
// O jogo roda num iframe (public/quake/index.html) e não no React: o motor é
// o WinQuake em WebAssembly, com variáveis globais, o próprio laço de frames,
// teclado, áudio e pointer lock. No iframe ele fica isolado do terminal, e
// sair do comando ("Voltar ao terminal", "limpar"...) desmonta o iframe e
// encerra tudo de uma vez: wasm, som e mouse.
//
// Os ~10 MB (motor + quake106.zip) só descem quando o comando roda.
const QuakeGame = ({ onExit }) => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const frameRef = useRef(null);
  useCommandAtTop(ref);

  // O idioma só vale na abertura: trocar PT | EN não reinicia o jogo
  const srcRef = useRef(`/quake/index.html?lang=${i18n.language}`);

  // "quit" no console do Quake volta ao terminal
  const onExitRef = useRef(onExit);
  useEffect(() => {
    onExitRef.current = onExit;
  });

  useEffect(() => {
    function onMessage(e) {
      if (e.origin !== window.location.origin) return;
      if (e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.origem === "quake" && e.data.tipo === "sair") onExitRef.current?.();
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
      <div className="quake-titulo">{t("jogo.quake.titulo")}</div>
      <div className="quake-moldura">
        <iframe
          ref={frameRef}
          className="quake-frame"
          src={srcRef.current}
          title={t("jogo.quake.titulo")}
          allow="fullscreen; autoplay"
          allowFullScreen
          onLoad={focusGame}
        />
      </div>
      <p className="quake-ajuda">{t("jogo.quake.ajuda")}</p>
      <div className="jogo-botoes quake-botoes">
        <button type="button" className="btn-voltar-terminal" onClick={fullscreen}>
          {t("jogo.quake.tela_cheia")}
        </button>
        {onExit && (
          <button type="button" className="btn-voltar-terminal" onClick={onExit}>
            {t("jogo.voltar_terminal")}
          </button>
        )}
      </div>
      <p className="quake-creditos">{t("jogo.quake.creditos")}</p>
    </div>
  );
};

export default QuakeGame;
