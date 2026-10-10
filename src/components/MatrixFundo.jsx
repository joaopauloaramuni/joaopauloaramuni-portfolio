import React, { useEffect, useRef } from "react";
import { useTheme } from "../theme/themeContext";
import MATRIX_CONFIG from "../config/matrixConfig";
import "./MatrixFundo.css";

// Chuva de código em canvas: cada coluna tem uma "gota" que desce deixando
// rastro. A cabeça é quase branca e o rastro é o verde #42C920, apagado aos
// poucos por um véu preto translúcido a cada quadro (o efeito do filme).
// Com prefers-reduced-motion, desenha um quadro parado e não anima.
function ChuvaDeCodigo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { VERDE, CABECA, FONTE_PX, FPS, CARACTERES } = MATRIX_CONFIG;
    const chars = [...CARACTERES];
    const sorteia = () => chars[Math.floor(Math.random() * chars.length)];
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let gotas = [];
    let anteriores = [];
    let largura = 0;
    let altura = 0;
    let frame = 0;
    let ultimo = 0;

    const redimensiona = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      largura = canvas.clientWidth;
      altura = canvas.clientHeight;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, largura, altura);
      const colunas = Math.ceil(largura / FONTE_PX);
      const linhas = Math.ceil(altura / FONTE_PX);
      // Começam espalhadas acima e dentro da tela, para não cair tudo junto
      gotas = Array.from({ length: colunas }, () => Math.floor(Math.random() * linhas) - linhas);
      anteriores = Array(colunas).fill(null);
    };

    const passo = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, largura, altura);
      ctx.font = `${FONTE_PX}px "MS Gothic", "Hiragino Kaku Gothic Pro", "Noto Sans Mono CJK JP", monospace`;
      ctx.textBaseline = "top";
      const linhas = Math.ceil(altura / FONTE_PX);

      for (let i = 0; i < gotas.length; i++) {
        const y = gotas[i];
        if (y === -Infinity) continue;
        const x = i * FONTE_PX;

        // O caractere da cabeça anterior volta a ser verde (vira rastro)
        const ant = anteriores[i];
        if (ant) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x, ant.y * FONTE_PX, FONTE_PX, FONTE_PX);
          ctx.fillStyle = VERDE;
          ctx.fillText(ant.c, x, ant.y * FONTE_PX);
          anteriores[i] = null;
        }

        if (y >= 0) {
          const c = sorteia();
          ctx.fillStyle = CABECA;
          ctx.fillText(c, x, y * FONTE_PX);
          anteriores[i] = { c, y };
        }

        // Saiu da tela: recomeça do topo, com um atraso aleatório
        if (y * FONTE_PX > altura && Math.random() > 0.975) {
          gotas[i] = -Math.floor(Math.random() * linhas * 0.5);
        } else {
          gotas[i] = y + 1;
        }
      }

      // De vez em quando um caractere do rastro troca, como no filme
      for (let k = 0; k < gotas.length / 6; k++) {
        const i = Math.floor(Math.random() * gotas.length);
        const y = Math.floor(Math.random() * linhas);
        if (gotas[i] === -Infinity || y >= gotas[i] - 1 || y < gotas[i] - 24) continue;
        ctx.fillStyle = "rgba(66, 201, 32, 0.55)";
        ctx.fillText(sorteia(), i * FONTE_PX, y * FONTE_PX);
      }
    };

    const loop = (t) => {
      frame = requestAnimationFrame(loop);
      if (t - ultimo < 1000 / FPS) return;
      ultimo = t;
      passo();
    };

    redimensiona();
    const observer = new ResizeObserver(() => {
      redimensiona();
      if (reduzido) for (let n = 0; n < 80; n++) passo();
    });
    observer.observe(canvas);

    if (reduzido) {
      for (let n = 0; n < 80; n++) passo();
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-chuva" />;
}

// Fundo do tema "matrix". Fica atrás do terminal (que fica transparente
// nesse tema, ver App.css) e não recebe cliques. O layout vem do contexto
// do tema: "tema --matrix --wake" ou ?matrix=wake (ver config/matrixConfig.js).
const MatrixFundo = () => {
  const { theme, matrixLayout } = useTheme();
  if (theme !== "matrix") return null;

  return (
    <div className={`matrix-fundo matrix-fundo-${matrixLayout}`} aria-hidden="true">
      {matrixLayout === "chuva" && <ChuvaDeCodigo />}

      {matrixLayout === "wake" && (
        <img className="matrix-fundo-capa matrix-fundo-wake" src="/matrix/wake-up.webp" alt="" />
      )}

      <div className="matrix-fundo-veu" />
    </div>
  );
};

export default MatrixFundo;
