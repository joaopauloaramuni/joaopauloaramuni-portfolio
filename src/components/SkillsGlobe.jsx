import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useTranslation } from "react-i18next";
import { useTheme } from "../theme/themeContext";
import "./SkillsGlobe.css";

/* =====================================================================
   skills --globo: as skills numa esfera 3D que gira e pode ser arrastada
   (inspirado no "Skills.json" de abdulmomin.dev).

   - Recebe a lista de data/globeSkills.js (skillsData + ferramentas extras).
   - A grade, o brilho e a névoa leem --accent e --bg-terminal do tema,
     então acompanham o "tema --claro | --escuro | --galo".
   - Os ícones são uma única camada HTML reposicionada a cada frame (em vez
     de um <Html> do drei por ícone, que no @react-three/fiber 9.8 faz o
     primeiro ícone não aparecer).
   - Fora da tela o globo para de renderizar e, pouco depois, desmonta o
     <Canvas>, liberando o contexto WebGL. As saídas antigas continuam no
     terminal, e o Chrome aceita só uns 16 contextos vivos: sem isso, depois
     de umas 16 execuções de "skills --globo" ele derrubava os mais antigos e
     o globo ficava em branco. A rotação e a câmera ficam guardadas: ao rolar
     de volta, o globo reaparece onde estava.
   - Este arquivo (e o three.js) só é baixado quando o estilo é aberto.
   ===================================================================== */

// Espiral de Fibonacci: N pontos bem distribuídos numa esfera
function fibonacciSphere(n, radius) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius);
  });
}

const ICON_PX = 40; // tamanho do ícone no CSS (ver SkillsGlobe.css)
const RADIUS = 3.3;
const DRAG_THRESHOLD = 6; // px: acima disso o clique vira arrasto e não abre o link
// Quanto tempo fora da tela antes de desmontar o <Canvas> (rolar rápido para
// cima e para baixo não fica recriando o WebGL)
const UNMOUNT_DELAY_MS = 1500;

const _world = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _ndc = new THREE.Vector3();
const _view = new THREE.Vector3();

function Globe({ count, radius, accent, items, motion, light, pose }) {
  const group = useRef(null);
  const points = useMemo(() => fibonacciSphere(count, radius), [count, radius]);
  const shell = radius * 0.85;
  // Tamanho do ícone na cena 3D: diminui conforme a quantidade de skills
  // (≈0.45 com ~30 skills; aumente o 0.8 para ícones maiores)
  const iconWorld = THREE.MathUtils.clamp((radius * 0.8) / Math.sqrt(count), 0.32, 0.6);

  // Remontou (voltou para a tela): continua do giro em que parou
  useLayoutEffect(() => {
    if (group.current) group.current.rotation.y = pose.current.rotationY;
  }, [pose]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { camera } = state;
    const { width, height } = state.size;

    if (motion) g.rotation.y += delta * 0.06; // giro lento, independente do FPS
    // Guarda o giro e a câmera (que o OrbitControls move) para a remontagem
    pose.current.rotationY = g.rotation.y;
    (pose.current.camera ??= new THREE.Vector3()).copy(camera.position);
    g.updateWorldMatrix(true, false);
    camera.updateMatrixWorld();
    _camDir.copy(camera.position).normalize();
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

    // Projeta cada ponto 3D na tela e move o ícone direto no DOM (sem re-render)
    points.forEach((p, i) => {
      const el = items.current[i];
      if (!el) return;
      _world.copy(p).applyMatrix4(g.matrixWorld);

      // 1 = de frente para a câmera, 0 = atrás do globo
      const t = THREE.MathUtils.clamp((_dir.copy(_world).normalize().dot(_camDir) - 0.1) * 2, 0, 1);

      _ndc.copy(_world).project(camera);
      const x = (_ndc.x + 1) * 0.5 * width;
      const y = (1 - _ndc.y) * 0.5 * height;
      const depth = -_view.copy(_world).applyMatrix4(camera.matrixWorldInverse).z;
      const pxPerUnit = height / (2 * tanHalfFov * depth); // perspectiva: longe = menor
      const scale = ((iconWorld * pxPerUnit) / ICON_PX) * (0.8 + 0.4 * t);

      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = String(t);
      el.style.zIndex = String(Math.round(t * 100));
      el.style.pointerEvents = t > 0.8 ? "auto" : "none";
      // Ícones atrás do globo saem da ordem do Tab
      el.style.visibility = t < 0.02 ? "hidden" : "visible";
    });
  });

  return (
    <group ref={group}>
      {/* grade: frente mais visível, fundo bem fraco */}
      <mesh>
        <icosahedronGeometry args={[shell, 2]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={light ? 0.35 : 0.1} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[shell, 2]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={light ? 0.1 : 0.03} side={THREE.BackSide} />
      </mesh>
      {/* núcleo: escurece no tema escuro, clareia no claro */}
      <mesh>
        <sphereGeometry args={[shell * 0.98, 32, 32]} />
        <meshBasicMaterial
          color={light ? "#fff" : "#000"}
          transparent
          opacity={light ? 0.25 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* halo (blending aditivo) */}
      <mesh>
        <sphereGeometry args={[shell * 1.035, 32, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Afasta a câmera o suficiente para o globo caber (inclusive no celular).
// Na remontagem, volta para a posição guardada antes de ajustar a distância.
function FitCamera({ radius, pose }) {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);

  useLayoutEffect(() => {
    if (pose.current.camera) camera.position.copy(pose.current.camera);
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    camera.position.setLength(radius / Math.sin(Math.min(vFov, hFov) / 2));
  }, [camera, aspect, radius, pose]);

  return null;
}

// Lê um token do tema (ex.: --accent) já resolvido no elemento
const readToken = (el, name, fallback) =>
  getComputedStyle(el).getPropertyValue(name).trim() || fallback;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function SkillsGlobe({ skills }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const container = useRef(null);
  const items = useRef([]);
  const dragStart = useRef(null);
  const [colors, setColors] = useState({ accent: "#00ff9d", bg: "#252a33" });
  const [visible, setVisible] = useState(true); // renderiza os frames
  const [mounted, setMounted] = useState(true); // <Canvas> montado (WebGL vivo)
  const pose = useRef({ rotationY: 0, camera: null });
  const [motion] = useState(() => !prefersReducedMotion());
  // Sai do mesmo <html data-theme> que as cores (ver abaixo)
  const light = theme === "light";

  // Cores do tema atual. O ThemeProvider troca o <html data-theme> num
  // useEffect (depois deste componente), então observa o próprio atributo.
  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const read = () =>
      setColors({
        accent: readToken(el, "--accent", "#00ff9d"),
        bg: readToken(el, "--bg-terminal", "#252a33"),
      });
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  // Saiu da tela (rolou o terminal): para de renderizar na hora e desmonta o
  // <Canvas> pouco depois, liberando o contexto WebGL. A margem remonta um
  // pouco antes de o globo voltar a aparecer.
  useEffect(() => {
    const el = container.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let timer;
    const io = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
        else timer = setTimeout(() => setMounted(false), UNMOUNT_DELAY_MS);
      },
      { root: el.closest(".react-terminal"), rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  // Arrastar em cima de um ícone gira o globo; só abre o link num clique "parado"
  const onPointerDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const onClickCapture = (e) => {
    const start = dragStart.current;
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="skills-globe">
      <div
        ref={container}
        className="skills-globe__stage"
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {/* eventSource = container: o arrasto funciona também em cima dos ícones */}
        {mounted && (
          <Canvas
            eventSource={container}
            frameloop={visible ? "always" : "never"}
            camera={{ position: [0, 0, 9], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
          >
            {/* a névoa apaga o fundo do globo no escuro; no claro ela só acinzentaria */}
            {!light && <fog attach="fog" args={[colors.bg, 10, 25]} />}
            <FitCamera radius={RADIUS * 1.2} pose={pose} />
            <Float
              speed={motion ? 1 : 0}
              rotationIntensity={motion ? 0.2 : 0}
              floatIntensity={motion ? 0.2 : 0}
            >
              <Globe
                count={skills.length}
                radius={RADIUS}
                accent={colors.accent}
                items={items}
                motion={motion}
                light={light}
                pose={pose}
              />
            </Float>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={motion}
              autoRotateSpeed={0.8}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        )}

        <ul className="skills-globe__layer">
          {skills.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <li key={skill.name} className="skills-globe__li">
                <a
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  className="skills-globe__item"
                  style={{ "--skill": skill.color }}
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  aria-label={
                    skill.link.includes("github.com")
                      ? t("habilidades.verRepositorio", { name: skill.name })
                      : skill.name
                  }
                >
                  <Icon className="skills-globe__icon" aria-hidden="true" />
                  <span className="skills-globe__label">{skill.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* fora do palco: os nomes das skills não passam por cima da dica */}
      <p className="skills-globe__hint">{t("habilidades.globoDica")}</p>
    </div>
  );
}
