import React, { useEffect, useRef, useState } from "react";
import "./BootSequence.css";

// [status, texto]  — status: "ok" | "warn" | "info" | null (linha crua do kernel)
const BOOT_LINES = [
  [null, "AramuniOS 6.18.0-puc #1 SMP PREEMPT_DYNAMIC x86_64"],
  [null, "Command line: BOOT_IMAGE=/vmlinuz-aramuni root=/dev/aramuni ro quiet"],
  ["info", "Detectando CPU: Engenheiro de Software (16 núcleos de café)"],
  ["ok", "Mounting /dev/aramuni..."],
  ["ok", "Started Graduação em Sistemas de Informação"],
  ["ok", "Loading Masters module..."],
  ["ok", "Loading PhD module..."],
  ["ok", "Started PUC Minas teaching daemon (engenharia-de-software.service)"],
  ["warn", "cafe.service: nível de café abaixo de 20%, reabastecendo..."],
  ["ok", "Reached target Projetos e Experiências"],
  ["ok", "Started Supabase guestbook listener"],
  ["ok", "Started i18n (pt-BR, en-US)"],
  ["ok", "Reached target Portfolio Terminal"],
];

const SESSION_KEY = "aramuni-booted";

const alreadyBooted = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
};

export default function BootSequence({ onFinish }) {
  const [visible, setVisible] = useState(0); // quantas linhas já apareceram
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* navegação privada: tudo bem */
    }
    setLeaving(true);
    setTimeout(onFinish, 350); // espera o fade-out
  };

  // Pula direto se o boot já rodou nesta aba
  useEffect(() => {
    if (alreadyBooted()) {
      done.current = true;
      onFinish();
    }
  }, [onFinish]);

  // Linhas aparecendo com atraso irregular (parece boot de verdade)
  useEffect(() => {
    if (done.current) return;
    if (visible < BOOT_LINES.length) {
      const delay = 60 + Math.random() * 160;
      const id = setTimeout(() => setVisible((v) => v + 1), delay);
      return () => clearTimeout(id);
    }
    // Todas as linhas exibidas → barra de progresso
    if (progress < 100) {
      const id = setTimeout(() => setProgress((p) => Math.min(100, p + 7)), 30);
      return () => clearTimeout(id);
    }
    const id = setTimeout(finish, 300);
    return () => clearTimeout(id);
  }, [visible, progress]);

  // Qualquer tecla, clique ou toque pula
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  const bar = Math.round(progress / 5);

  return (
    <div className={`boot-screen ${leaving ? "boot-leaving" : ""}`} aria-hidden="true">
      <div className="boot-lines">
        {BOOT_LINES.slice(0, visible).map(([status, text], i) => (
          <div key={i} className="boot-line">
            {status === "ok" && <span className="boot-tag ok">[  OK  ]</span>}
            {status === "warn" && <span className="boot-tag warn">[ WARN ]</span>}
            {status === "info" && <span className="boot-tag info">[ INFO ]</span>}
            {!status && (
              <span className="boot-time">[{(i * 0.137).toFixed(6).padStart(12, " ")}]</span>
            )}
            <span>{text}</span>
          </div>
        ))}

        {visible >= BOOT_LINES.length && (
          <div className="boot-line boot-progress">
            carregando portfolio [{"#".repeat(bar)}
            {".".repeat(20 - bar)}] {progress}%
          </div>
        )}
        <span className="boot-cursor">▋</span>
      </div>

      <div className="boot-skip">pressione qualquer tecla para pular</div>
    </div>
  );
}