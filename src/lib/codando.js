// "Codando agora": em que projeto estou mexendo no editor (boas-vindas e
// wakatime --agora). Quem lê os heartbeats do WakaTime, com a chave, é o
// servidor (api/_codando.js); aqui só buscamos o resultado e repetimos a cada
// minuto enquanto a saída está na tela.

import { useEffect, useState } from "react";
import WAKATIME_CONFIG from "../config/wakaTimeConfig";

const { API_PATH, ATUALIZAR_SEGUNDOS } = WAKATIME_CONFIG.AGORA;
const INTERVALO_MS = ATUALIZAR_SEGUNDOS * 1000;

// A boas-vindas e o wakatime --agora podem estar na tela juntos: dentro de
// meio intervalo, os dois reaproveitam a mesma resposta
let ultima = { em: 0, estado: null };
let emAndamento = null;

// Estados: { status: "ok", dados } | { status: "indisponivel" } (sem chave, ou
// Docker/Nginx, onde a rota não existe) | { status: "erro" }
async function buscar() {
  try {
    const resp = await fetch(API_PATH, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    // No Docker/Nginx a rota volta o index.html: confere que é a nossa resposta
    const tipo = resp.headers.get("content-type") ?? "";
    if (!tipo.includes("application/json")) return { status: "indisponivel" };
    if (resp.status === 503) return { status: "indisponivel" };
    if (!resp.ok) return { status: "erro" };
    const dados = await resp.json();
    if (typeof dados?.ativo !== "boolean") return { status: "erro" };
    return { status: "ok", dados };
  } catch {
    return { status: "erro" }; // rede fora, timeout
  }
}

export function obterCodando() {
  if (ultima.estado && Date.now() - ultima.em < INTERVALO_MS / 2) {
    return Promise.resolve(ultima.estado);
  }
  if (!emAndamento) {
    emAndamento = buscar().then((estado) => {
      ultima = { em: Date.now(), estado };
      emAndamento = null;
      return estado;
    });
  }
  return emAndamento;
}

export const codandoGuardado = () => ultima.estado;

// Busca agora e repete a cada minuto enquanto `ativo` (na tela) e a aba está
// visível. Sem a chave (indisponivel), para de perguntar.
export function useCodando(ativo = true) {
  const [estado, setEstado] = useState(() => codandoGuardado() ?? { status: "carregando" });

  useEffect(() => {
    if (!ativo) return;
    let vivo = true;
    let id = null;

    const atualizar = () => {
      if (document.visibilityState === "hidden") return;
      obterCodando().then((novo) => {
        if (!vivo) return;
        setEstado(novo);
        if (novo.status === "indisponivel" && id) {
          clearInterval(id);
          id = null;
        }
      });
    };

    atualizar();
    id = setInterval(atualizar, INTERVALO_MS);
    document.addEventListener("visibilitychange", atualizar);
    return () => {
      vivo = false;
      if (id) clearInterval(id);
      document.removeEventListener("visibilitychange", atualizar);
    };
  }, [ativo]);

  return estado;
}

// Relógio que anda de 30 em 30 s, para "há 2 min" não parar entre buscas
export function useRelogio(ativo = true) {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    if (!ativo) return;
    setAgora(Date.now());
    const id = setInterval(() => setAgora(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [ativo]);
  return agora;
}

// ms → "agora há pouco" | "há 3 min" | "há 2 h" (chaves em wakatime.agora.ha)
export function haQuanto(t, desdeMs, agoraMs) {
  const min = Math.max(0, Math.floor((agoraMs - desdeMs) / 60000));
  if (min < 1) return t("wakatime.agora.ha.instantes");
  if (min < 60) return t("wakatime.agora.ha.minutos", { count: min });
  return t("wakatime.agora.ha.horas", { count: Math.floor(min / 60) });
}
