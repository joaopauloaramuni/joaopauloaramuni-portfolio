import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./FlappyPlaneGame.css";
import "./BotaoVoltar.css";

const achievementsList = [
  "jogo.achievements.phd",
  "jogo.achievements.masters",
  "jogo.achievements.bachelor",
  "jogo.achievements.professorSoftware",
  "jogo.achievements.cto",
  "jogo.achievements.techLead",
  "jogo.achievements.professorSoftwareXP",
  "jogo.achievements.professorNewtonPaiva",
  "jogo.achievements.professorPOOFUMEC",
  "jogo.achievements.professorDestaqueNewtonPaiva",
  "jogo.achievements.patron",
  "jogo.achievements.teamAwardProsegur",
  "jogo.achievements.techSkills",
  "jogo.achievements.consultancy",
  "jogo.achievements.devExperience"
];

// A física é "por segundo", e não "por frame": o jogo tem a mesma velocidade
// numa tela de 60 Hz e numa de 120 Hz (como a do MacBook Pro), em vez de
// correr duas vezes mais rápido nela. Os valores reproduzem o jogo original
// a 60 fps (1% por frame).
const GRAVIDADE = 60; // % da altura por segundo
const IMPULSO = 18; // % que o avião sobe a cada toque
const VELOCIDADE_NUVEM = 60; // % da largura por segundo
const NOVA_NUVEM_S = 2; // uma nuvem nova a cada 2 s de jogo
// Maior passo de tempo de um frame: ao voltar de outra aba, o avião não
// "teleporta" pelo tempo em que o jogo ficou parado
const PASSO_MAX_S = 0.05;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const FlappyPlaneGame = ({ onExit }) => {
  const { t } = useTranslation();
  const gameRef = useRef(null);
  const planeRef = useRef(null);
  const scoreRef = useRef(null);
  const achievementRef = useRef(null);

  // Sempre o t do idioma atual, sem reiniciar o jogo ao trocar PT | EN
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  });

  useEffect(() => {
    const hiddenInput = document.querySelector(".terminal-hidden-input");
    hiddenInput?.blur();

    const game = gameRef.current;
    const planeEl = planeRef.current;
    const scoreEl = scoreRef.current;
    const achEl = achievementRef.current;
    const tr = (key) => tRef.current(key);

    let planeY = 50; // %
    let clouds = []; // { el, left }
    let score = 0;
    let gameOver = false;
    let frame = 0; // requestAnimationFrame em andamento
    let lastTime = null;
    let untilNextCloud = NOVA_NUVEM_S;
    const timeouts = new Set();

    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
    };

    // Uma conquista a cada 2 pontos, em ordem aleatória
    const achievements = {};
    shuffleArray([...achievementsList]).forEach((key, i) => {
      achievements[(i + 1) * 2] = key;
    });

    function createCloud() {
      const cloud = document.createElement("div");
      cloud.classList.add("cloud");
      cloud.innerText = "☁️";
      const minY = Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 80);
      const maxY =
        Math.random() < 0.2 ? 90 : Math.floor(Math.random() * 80) + 10;
      cloud.style.top =
        Math.floor(Math.random() * (maxY - minY + 1) + minY) + "%";
      cloud.style.left = "100%";
      cloud.style.transform = "scale(1.4)";
      game.appendChild(cloud);
      clouds.push({ el: cloud, left: 100 });
    }

    function showAchievement(text) {
      achEl.innerText = text;
      achEl.classList.add("show");
      later(() => achEl.classList.remove("show"), 2000);
    }

    function updateClouds(dt) {
      const planeRect = planeEl.getBoundingClientRect();
      const remaining = [];
      for (const cloud of clouds) {
        cloud.left -= VELOCIDADE_NUVEM * dt;
        cloud.el.style.left = cloud.left + "%";
        const cloudRect = cloud.el.getBoundingClientRect();
        const hit = !(
          planeRect.right < cloudRect.left ||
          planeRect.left > cloudRect.right ||
          planeRect.bottom < cloudRect.top ||
          planeRect.top > cloudRect.bottom
        );
        if (hit) {
          endGame();
          return;
        }
        if (cloud.left < -5) {
          // Passou pelo avião: some e vale um ponto
          cloud.el.remove();
          score++;
          scoreEl.innerText = tr("jogo.pontuacao") + score;
          if (achievements[score]) showAchievement(tr(achievements[score]));
        } else {
          remaining.push(cloud);
        }
      }
      clouds = remaining;
    }

    function endGame() {
      gameOver = true;
      cancelAnimationFrame(frame);
      achEl.innerText = tr("jogo.gameover");
      achEl.classList.add("show");
      planeEl.style.opacity = "0.5";
    }

    function loop(now) {
      if (gameOver) return;
      const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, PASSO_MAX_S);
      lastTime = now;

      planeY = Math.min(90, Math.max(0, planeY + GRAVIDADE * dt));
      planeEl.style.top = planeY + "%";

      untilNextCloud -= dt;
      if (untilNextCloud <= 0) {
        createCloud();
        untilNextCloud += NOVA_NUVEM_S;
      }

      updateClouds(dt);
      if (!gameOver) frame = requestAnimationFrame(loop);
    }

    function start() {
      lastTime = null;
      frame = requestAnimationFrame(loop);
    }

    function resetGame() {
      clouds.forEach((cloud) => cloud.el.remove());
      clouds = [];
      planeY = 50;
      planeEl.style.top = planeY + "%";
      planeEl.style.opacity = "1";
      score = 0;
      untilNextCloud = NOVA_NUVEM_S;
      scoreEl.innerText = tr("jogo.pontuacao") + "0";
      achEl.classList.remove("show");
      gameOver = false;
      start();
    }

    function flap() {
      planeY = Math.max(0, planeY - IMPULSO);
      planeEl.style.filter = "brightness(1.5) drop-shadow(0 0 6px #fff)";
      later(() => {
        planeEl.style.filter = "";
      }, 120);
    }

    function keyHandler(e) {
      if (e.code === "Space") {
        // Sem rolar a página nem "clicar" o botão focado
        e.preventDefault();
        if (!gameOver) flap();
      }
      if ((e.key === "r" || e.key === "R") && gameOver) resetGame();
    }

    // pointerdown cobre mouse, toque e caneta com um evento só (antes,
    // touchend + click davam dois impulsos por toque no celular)
    function pointerHandler(e) {
      if (e.button > 0) return; // só o botão principal
      if (gameOver) resetGame();
      else flap();
    }

    window.addEventListener("keydown", keyHandler);
    game.addEventListener("pointerdown", pointerHandler);
    start();

    // Saiu do jogo ("Voltar ao terminal", "limpar"...): para tudo de verdade
    return () => {
      gameOver = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", keyHandler);
      game.removeEventListener("pointerdown", pointerHandler);
      timeouts.forEach(clearTimeout);
      clouds.forEach((cloud) => cloud.el.remove());
    };
  }, []);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <div id="game" ref={gameRef}>
        <div id="score" ref={scoreRef}>{t("jogo.pontuacao") + "0"}</div>
        <div id="achievement" ref={achievementRef}></div>
        <div className="plane" id="plane" ref={planeRef}>
          ✈️
        </div>
      </div>

      {onExit && (
        <button
          className="btn-voltar-terminal"
          onClick={onExit}
          style={{ marginTop: "12px" }}
        >
          {t("jogo.voltar_terminal")}
        </button>
      )}
    </div>
  );
};

export default FlappyPlaneGame;
