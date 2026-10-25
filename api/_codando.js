// "Codando agora": em que projeto estou mexendo no editor neste momento.
//
// De onde vem: a extensão do WakaTime (VS Code, Cursor...) manda um
// heartbeat a cada ~2 min enquanto eu digito, com projeto, linguagem, branch
// e arquivo. Aqui lemos os heartbeats do dia (GET /users/current/heartbeats)
// e olhamos o último: se chegou há até AGORA.ATIVO_MINUTOS, estou codando.
//
// Heartbeats são privados: precisam de um token OAuth (WAKATIME_ACCESS_TOKEN,
// escopo read_heartbeats), sem o prefixo VITE_, que fica só no servidor. Desde 01/11/2026 a API key do WakaTime só
// serve para os plugins mandarem dados. O token sai do
// scripts/wakatime-oauth.mjs (npm run wakatime:oauth). Quem atende:
//   • a Vercel Function api/codando.js, em produção;
//   • o vite.config.js, no npm run dev e no npm run preview;
//   • no Docker (Nginx) não há função: /api/codando cai no index.html e o
//     navegador esconde a linha (ver src/lib/codando.js).
//
// Privacidade:
//   • o arquivo (entity) nunca sai daqui: ele traz o caminho completo;
//   • todo projeto aparece com nome e branch, menos os de HIDDEN_PROJECTS
//     (src/config/wakaTimeConfig.js, a mesma lista do wakatime --projetos),
//     que viram "projeto privado", sem nome e sem branch;
//   • só heartbeats de arquivo (type "file") contam: os de navegador
//     (domínios visitados) são descartados.
//
// Custo: a resposta é a mesma para todo mundo, então fica 60 s no cache da
// CDN e 60 s na memória da função. O token é usado no máximo uma vez por
// minuto, por mais visitantes que estejam com a tela aberta.
//
// Token expirado (401): a renovação automática fica em api/_wakatimeOAuth.js,
// compartilhada com as estatísticas (api/_wakatime.js).
//
// O nome começa com "_" para a Vercel não transformar este arquivo em rota.

import WAKATIME_CONFIG from "../src/config/wakaTimeConfig.js";
import { chamarWakaTime, temToken } from "./_wakatimeOAuth.js";

const { AGORA, HIDDEN_PROJECTS } = WAKATIME_CONFIG;
export const PROXY_PATH = AGORA.API_PATH;

const USUARIO = "/users/current";
const TIMEOUT_MS = 6000;
const CACHE_MS = 60 * 1000;
const CACHE_EDITORES_MS = 60 * 60 * 1000;

const ATIVO_S = AGORA.ATIVO_MINUTOS * 60;
const PAUSA_S = AGORA.PAUSA_MINUTOS * 60;

// Nome do editor como o WakaTime manda → como aparece na tela
const EDITORES = {
  vscode: "VS Code",
  cursor: "Cursor",
  windsurf: "Windsurf",
  vscodium: "VSCodium",
  zed: "Zed",
  vim: "Vim",
  neovim: "Neovim",
  emacs: "Emacs",
  sublime: "Sublime Text",
  intellij: "IntelliJ IDEA",
  idea: "IntelliJ IDEA",
  pycharm: "PyCharm",
  webstorm: "WebStorm",
  androidstudio: "Android Studio",
  xcode: "Xcode",
  eclipse: "Eclipse",
  visualstudio: "Visual Studio",
  jupyter: "Jupyter",
};

const nomeDoEditor = (editor) => {
  if (!editor) return null;
  const chave = String(editor).toLowerCase().replace(/[\s_-]/g, "");
  return EDITORES[chave] ?? String(editor).charAt(0).toUpperCase() + String(editor).slice(1);
};

// "2026-10-09" no fuso da conta do WakaTime
const diaNoFuso = (ms) =>
  new Date(ms).toLocaleDateString("en-CA", { timeZone: AGORA.TIMEZONE });

// Minutos passados desde a meia-noite no fuso da conta
function minutosDoDia(ms) {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: AGORA.TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  const valor = (tipo) => Number(partes.find((p) => p.type === tipo)?.value ?? 0);
  return valor("hour") * 60 + valor("minute");
}

// Projetos que não aparecem pelo nome (o resto aparece)
const OCULTOS = new Set(HIDDEN_PROJECTS.map((nome) => nome.toLowerCase()));

// Token OAuth no Authorization: Bearer (ver api/_wakatimeOAuth.js)
async function chamar(caminho, env) {
  const resp = await chamarWakaTime(`${USUARIO}${caminho}`, env, { timeout: TIMEOUT_MS });
  if (!resp.ok) throw new Error(`WakaTime ${resp.status} em ${caminho.split("?")[0]}`);
  const json = await resp.json();
  return Array.isArray(json?.data) ? json.data : [];
}

// id do user agent → editor. Muda pouco: 1 h de cache. Se falhar, a linha
// só fica sem o nome do editor.
let editores = { em: 0, mapa: new Map() };
async function mapaDeEditores(env) {
  if (Date.now() - editores.em < CACHE_EDITORES_MS) return editores.mapa;
  try {
    const lista = await chamar("/user_agents", env);
    const mapa = new Map(lista.map((ua) => [ua.id, nomeDoEditor(ua.editor)]));
    editores = { em: Date.now(), mapa };
  } catch (erro) {
    console.error("Codando (editores):", erro?.message ?? erro);
  }
  return editores.mapa;
}

const heartbeatsDoDia = async (dia, env) =>
  (await chamar(`/heartbeats?date=${dia}`, env))
    .filter((hb) => hb.type === "file" && Number.isFinite(hb.time))
    .sort((a, b) => a.time - b.time);

// Tempo somado como o WakaTime faz: intervalos entre heartbeats seguidos
// contam se forem menores que a pausa. É aproximado (o dashboard pode
// diferir em alguns minutos).
function somarSegundos(heartbeats) {
  let total = 0;
  for (let i = 1; i < heartbeats.length; i += 1) {
    const intervalo = heartbeats[i].time - heartbeats[i - 1].time;
    if (intervalo < PAUSA_S) total += intervalo;
  }
  return Math.round(total);
}

// Começo da sessão atual: volta do último heartbeat até achar uma pausa
function inicioDaSessao(heartbeats) {
  let i = heartbeats.length - 1;
  while (i > 0 && heartbeats[i].time - heartbeats[i - 1].time < PAUSA_S) i -= 1;
  return heartbeats[i].time;
}

async function montar(env) {
  const agora = Date.now();
  const hoje = diaNoFuso(agora);

  const [deHoje, mapa] = await Promise.all([
    heartbeatsDoDia(hoje, env),
    mapaDeEditores(env),
  ]);

  // Logo depois da meia-noite, a sessão pode ter começado ontem
  let heartbeats = deHoje;
  if (minutosDoDia(agora) < AGORA.PAUSA_MINUTOS + AGORA.ATIVO_MINUTOS) {
    const ontem = diaNoFuso(agora - 24 * 60 * 60 * 1000);
    heartbeats = [...(await heartbeatsDoDia(ontem, env)), ...deHoje];
  }

  const ultimo = heartbeats.at(-1);
  const hojeS = somarSegundos(deHoje);

  if (!ultimo) return { ativo: false, ultimo: null, hojeSegundos: hojeS };

  const publico = Boolean(ultimo.project) && !OCULTOS.has(ultimo.project.toLowerCase());

  const ativo = agora / 1000 - ultimo.time <= ATIVO_S;

  return {
    ativo,
    hojeSegundos: hojeS,
    ultimo: {
      publico,
      projeto: publico ? ultimo.project : null,
      branch: publico ? ultimo.branch || null : null,
      linguagem: ultimo.language || null,
      editor: mapa.get(ultimo.user_agent_id) ?? null,
      em: Math.round(ultimo.time * 1000),
      sessaoDesde: Math.round(inicioDaSessao(heartbeats) * 1000),
      // Tempo de hoje só neste projeto (sem os heartbeats de ontem)
      projetoHojeSegundos: somarSegundos(
        deHoje.filter((hb) => hb.project === ultimo.project)
      ),
    },
  };
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

export async function responderCodando(env) {
  const json = (status, corpo, cacheControl) => ({
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
    },
    corpo: JSON.stringify(corpo),
  });

  if (!temToken(env)) {
    return json(503, { erro: "nao_configurado" }, "no-store");
  }
  try {
    const dados = await obter(env);
    // Igual para todos os visitantes: pode ficar na CDN
    return json(200, dados, "public, max-age=0, s-maxage=60, stale-while-revalidate=60");
  } catch (erro) {
    console.error("Codando:", erro?.message ?? erro);
    return json(502, { erro: "wakatime" }, "no-store");
  }
}

export async function atenderCodando(req, res, env) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end();
  }
  const resultado = await responderCodando(env);
  res.statusCode = resultado.status;
  Object.entries(resultado.headers).forEach(([nome, valor]) => res.setHeader(nome, valor));
  res.end(req.method === "HEAD" ? undefined : resultado.corpo);
}
