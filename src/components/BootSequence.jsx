import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "./BootSequence.css";

// [status, texto]  — status: "ok" | "warn" | "info" | null (linha crua do kernel)
// Textos que começam com "boot." são chaves do i18n (mudam com o seletor PT | EN)
const BOOT_LINES = [
  [null, "AramuniOS 6.18.0-puc #1 SMP PREEMPT_DYNAMIC x86_64"],
  [null, "Command line: BOOT_IMAGE=/vmlinuz-aramuni root=/dev/aramuni ro quiet"],
  ["info", "boot.cpu"],
  ["ok", "Mounting /dev/aramuni..."],
  ["ok", "boot.graduacao"],
  ["ok", "Loading Masters module..."],
  ["ok", "Loading PhD module..."],
  ["ok", "boot.teaching"],
  ["warn", "boot.cafe"],
  ["ok", "boot.projetos"],
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
  const { t } = useTranslation();
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
    // Cliques no seletor de idioma (cabeçalho) não pulam o boot
    const skip = (e) => {
      if (e.target instanceof Element && e.target.closest(".switcherContainer")) return;
      finish();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  const bar = Math.round(progress / 5);

  return (
    <div className={`boot-screen ${leaving ? "boot-leaving" : ""}`}>
      {/* Cabeçalho igual ao do terminal: botões da janela, título e seletor PT | EN */}
      <div className="react-terminal-window-buttons" aria-hidden="true">
        <button className="red-btn" disabled tabIndex={-1} />
        <button className="yellow-btn" disabled tabIndex={-1} />
        <button className="green-btn" disabled tabIndex={-1} />
      </div>
      <div className="boot-title" aria-hidden="true">Portfolio terminal</div>
      <LanguageSwitcher />

      <div className="boot-lines" aria-hidden="true">
        {BOOT_LINES.slice(0, visible).map(([status, text], i) => (
          <div key={i} className="boot-line">
            {status === "ok" && <span className="boot-tag ok">[  OK  ]</span>}
            {status === "warn" && <span className="boot-tag warn">[ WARN ]</span>}
            {status === "info" && <span className="boot-tag info">[ INFO ]</span>}
            {!status && (
              <span className="boot-time">[{(i * 0.137).toFixed(6).padStart(12, " ")}]</span>
            )}
            <span>{text.startsWith("boot.") ? t(text) : text}</span>
          </div>
        ))}

        {visible >= BOOT_LINES.length && (
          <div className="boot-line boot-progress">
            {t("boot.carregando")} [{"#".repeat(bar)}
            {".".repeat(20 - bar)}] {progress}%
          </div>
        )}
        <span className="boot-cursor">▋</span>
      </div>

      <div className="boot-skip">{t("boot.pular")}</div>
    </div>
  );
}