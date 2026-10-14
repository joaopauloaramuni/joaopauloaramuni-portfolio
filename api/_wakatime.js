// Estatísticas do comando wakatime (--terminal, --grade e --lista):
// GET /api/wakatime → stats do período WAKATIME_CONFIG.RANGE (all_time).
//
// Autenticado sempre que der: com o token OAuth (WAKATIME_ACCESS_TOKEN,
// escopo read_stats) lemos /users/current/stats, que funciona mesmo com o
// perfil PRIVADO e traz campos que a rota pública não manda (start, end...).
// Sem o token, ou se ele falhar (401 sem renovação, 403 sem o escopo
// read_stats), cai na rota pública /users/<usuário>/stats, que só funciona
// com o perfil público. O usuário é o WAKATIME_USERNAME (opcional) ou, sem
// ele, o USERNAME de src/config/wakaTimeConfig.js. O campo "fonte" da resposta diz de onde os números
// vieram ("oauth" ou "publico").
//
// Quem atende:
//   • a Vercel Function api/wakatime.js, em produção;
//   • o vite.config.js, no npm run dev e no npm run preview;
//   • no Docker (Nginx) não há função: o nginx.conf repassa /api/wakatime
//     direto para a rota pública (o perfil precisa estar público).
//
// Privacidade: com o token, a API devolve também projetos, máquinas e
// dependências. Nada disso sai daqui: a resposta leva só os campos que os
// estilos usam (ver src/lib/wakatime.js).
//
// Custo: a resposta é a mesma para todo mundo, então fica 10 min no cache da
// CDN e 10 min na memória da função.
//
// O nome começa com "_" para a Vercel não transformar este arquivo em rota.

import WAKATIME_CONFIG from "../src/config/wakaTimeConfig.js";
import { chamarWakaTime, temToken } from "./_wakatimeOAuth.js";

export const PROXY_PATH = WAKATIME_CONFIG.API_PATH;

const { USERNAME, RANGE } = WAKATIME_CONFIG;

// Usuário do perfil público: a variável, se existir, vence o config
const usuarioPublico = (env) => String(env.WAKATIME_USERNAME ?? "").trim() || USERNAME;
const TIMEOUT_MS = 10_000;
const CACHE_MS = 10 * 60 * 1000;

// Só o que src/lib/wakatime.js usa
const CAMPOS = [
  "status",
  "total_seconds",
  "total_seconds_including_other_language",
  "daily_average",
  "daily_average_including_other_language",
  "days_minus_holidays",
  "days_including_holidays",
  "start",
  "human_readable_range",
];
const LISTAS = ["languages", "editors", "categories", "operating_systems"];

function enxugar(data = {}) {
  const saida = {};
  for (const campo of CAMPOS) if (data[campo] !== undefined) saida[campo] = data[campo];
  for (const lista of LISTAS) {
    if (!Array.isArray(data[lista])) continue;
    saida[lista] = data[lista].map(({ name, total_seconds, percent }) => ({
      name,
      total_seconds,
      percent,
    }));
  }
  return saida;
}

class Pendente extends Error {}

// Uma chamada às stats. Devolve os dados enxutos, lança Pendente (WakaTime
// ainda calculando) ou um erro com o status HTTP.
async function buscarStats(env, autenticado) {
  const usuario = autenticado ? "current" : encodeURIComponent(usuarioPublico(env));
  const resp = await chamarWakaTime(`/users/${usuario}/stats/${RANGE}`, env, {
    autenticado,
    timeout: TIMEOUT_MS,
  });
  if (resp.status === 202) throw new Pendente();
  if (!resp.ok) {
    const erro = new Error(`WakaTime ${resp.status} em /users/${usuario}/stats`);
    erro.status = resp.status;
    throw erro;
  }
  const { data } = await resp.json();
  if (data?.status === "pending_update" || !Array.isArray(data?.languages)) throw new Pendente();
  return enxugar(data);
}

async function montar(env) {
  if (temToken(env)) {
    try {
      return { fonte: "oauth", data: await buscarStats(env, true) };
    } catch (erro) {
      if (erro instanceof Pendente) throw erro;
      // 403 costuma ser token sem o escopo read_stats (gerado antes desta
      // mudança): rode npm run wakatime:oauth de novo
      console.error("WakaTime (stats com token), usando o perfil público:", erro?.message ?? erro);
    }
  }
  return { fonte: "publico", data: await buscarStats(env, false) };
}

let cache = { em: 0, dados: null, promessa: null };

async function obter(env) {
  if (cache.dados && Date.now() - cache.em < CACHE_MS) return cache.dados;
  // Vários visitantes no mesmo instante: uma chamada só ao WakaTime
  if (!cache.promessa) {
    cache.promessa = montar(env)
      .then((dados) => {
        cache = { em: Date.now(), dados, promessa: null };
        return dados;
      })
      .catch((erro) => {
        cache.promessa = null;
        throw erro;
      });
  }
  return cache.promessa;
}

export async function responderWakaTime(env) {
  const json = (status, corpo, cacheControl) => ({
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
    },
    corpo: JSON.stringify(corpo),
  });

  try {
    const dados = await obter(env);
    // Igual para todos os visitantes: pode ficar na CDN
    return json(200, dados, "public, max-age=0, s-maxage=600, stale-while-revalidate=3600");
  } catch (erro) {
    // 202 com status pending_update: o front mostra "WakaTime ainda está calculando"
    if (erro instanceof Pendente) {
      return json(202, { data: { status: "pending_update" } }, "no-store");
    }
    console.error("WakaTime:", erro?.message ?? erro);
    return json(502, { erro: "wakatime" }, "no-store");
  }
}

export async function atenderWakaTime(req, res, env) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end();
  }
  const resultado = await responderWakaTime(env);
  res.statusCode = resultado.status;
  Object.entries(resultado.headers).forEach(([nome, valor]) => res.setHeader(nome, valor));
  res.end(req.method === "HEAD" ? undefined : resultado.corpo);
}
