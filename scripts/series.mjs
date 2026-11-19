// npm run series
//
// Busca no TVmaze (https://www.tvmaze.com/api, grátis e sem chave) o cartaz
// e o link de cada série de src/data/seriesData.js, baixa os cartazes para
// public/series/<id>.jpg e grava src/data/seriesPosters.js. Roda só na
// máquina do desenvolvedor, depois de mexer na lista: o site não chama API
// nenhuma e não depende do TVmaze estar no ar.
//
//   npm run series                 só as séries que ainda não têm cartaz
//   npm run series -- --tudo       busca e baixa tudo de novo
//   npm run series -- --remoto     não baixa: usa a imagem do CDN do TVmaze
//
// Como cada série é achada, nesta ordem:
//   1. `poster` no seriesData.js: cartaz próprio, o TVmaze nem é consultado
//   2. `tvmaze`: o id fixo da série no TVmaze (com `temporada`, o cartaz é o
//      daquela temporada)
//   3. o id do TVmaze guardado na última rodada (seriesPosters.js)
//   4. `imdb`: GET /lookup/shows?imdb=tt...
//   5. busca pelo nome (ou `busca`), escolhendo o resultado do mesmo `ano`
//
// No fim sai um relatório: ⚠ quando o ano ou o nome do TVmaze não batem
// (confira e, se estiver errado, fixe o `tvmaze` certo no seriesData.js),
// ✗ quando não achou nada (ponha um `poster` em public/series/).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SERIES } from "../src/data/seriesData.js";

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const saida = path.join(raiz, "src/data/seriesPosters.js");
const pastaImagens = path.join(raiz, "public/series");

const args = process.argv.slice(2);
const TUDO = args.includes("--tudo") || args.includes("--all");
const REMOTO = args.includes("--remoto") || args.includes("--remote");

const API = "https://api.tvmaze.com";
// O TVmaze aceita 20 chamadas a cada 10 s por IP
const PAUSA_MS = 550;
// Sem resposta em 15 s, desiste daquela série (✗) e segue para a próxima
const TEMPO_LIMITE_MS = 15_000;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(caminho, tentativas = 3) {
  await dormir(PAUSA_MS);
  const resposta = await fetch(`${API}${caminho}`, { signal: AbortSignal.timeout(TEMPO_LIMITE_MS) });
  if (resposta.status === 404) return null;
  if (resposta.status === 429 && tentativas > 0) {
    await dormir(10_000);
    return api(caminho, tentativas - 1);
  }
  if (!resposta.ok) throw new Error(`${resposta.status} em ${caminho}`);
  return resposta.json();
}

const anoDe = (show) => Number(show?.premiered?.slice(0, 4)) || null;
const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

async function acharShow(serie, anterior) {
  const fixo = serie.tvmaze ?? anterior?.tvmaze;
  if (fixo) {
    const show = await api(`/shows/${fixo}`);
    if (show) return { show, como: serie.tvmaze ? "id fixo" : "id salvo" };
  }
  if (serie.imdb) {
    const show = await api(`/lookup/shows?imdb=${serie.imdb}`);
    if (show) return { show, como: "imdb" };
  }
  const resultados = (await api(`/search/shows?q=${encodeURIComponent(serie.busca ?? serie.nome)}`)) ?? [];
  if (!resultados.length) return null;
  const shows = resultados.map((r) => r.show);
  const mesmoAno = shows.find((s) => anoDe(s) === serie.ano);
  const anoPerto = shows.find((s) => serie.ano && Math.abs(anoDe(s) - serie.ano) <= 1);
  return { show: mesmoAno ?? anoPerto ?? shows[0], como: "busca" };
}

async function baixar(url, destino) {
  const resposta = await fetch(url, { signal: AbortSignal.timeout(TEMPO_LIMITE_MS) });
  if (!resposta.ok) throw new Error(`${resposta.status} ao baixar ${url}`);
  fs.writeFileSync(destino, Buffer.from(await resposta.arrayBuffer()));
}

// Resultado da última rodada, para não refazer o que já está pronto
let anteriores = {};
if (fs.existsSync(saida)) {
  ({ POSTERS: anteriores } = await import(pathToFileURL(saida).href));
}

if (!REMOTO) fs.mkdirSync(pastaImagens, { recursive: true });

const posters = {};
const relatorio = [];
const anotar = (marca, nome, detalhe) => {
  relatorio.push([marca, nome, detalhe]);
  console.log(`${marca} ${nome.padEnd(46)} ${detalhe}`);
};

console.log(`Buscando ${SERIES.length} séries no TVmaze (na primeira vez leva uns 2 minutos)...\n`);

for (const serie of SERIES) {
  if (serie.poster) {
    anotar("·", serie.nome, "cartaz próprio");
    continue;
  }

  const anterior = anteriores[serie.id];
  const arquivo = path.join(pastaImagens, `${serie.id}.jpg`);
  const pronto = REMOTO
    ? anterior?.poster?.startsWith("http")
    : anterior?.poster === `/series/${serie.id}.jpg` && fs.existsSync(arquivo);
  if (pronto && !TUDO) {
    posters[serie.id] = anterior;
    continue;
  }

  try {
    const achado = await acharShow(serie, anterior);
    if (!achado) {
      anotar("✗", serie.nome, "não encontrada no TVmaze");
      continue;
    }
    const { show, como } = achado;
    let imagem = show.image?.medium ?? show.image?.original;
    if (serie.temporada) {
      const temporadas = (await api(`/shows/${show.id}/seasons`)) ?? [];
      const temporada = temporadas.find((t) => t.number === serie.temporada);
      imagem = temporada?.image?.medium ?? temporada?.image?.original ?? null;
    }
    const url = show.externals?.imdb
      ? `https://www.imdb.com/title/${show.externals.imdb}/`
      : show.url;
    let poster = null;
    if (imagem) {
      if (REMOTO) {
        poster = imagem;
      } else {
        await baixar(imagem, arquivo);
        poster = `/series/${serie.id}.jpg`;
      }
    }
    posters[serie.id] = { poster, url, tvmaze: show.id, ...(serie.temporada && { temporada: serie.temporada }) };

    const rede = show.network?.name ?? show.webChannel?.name ?? "?";
    const encontrado =
      `${show.name} (${anoDe(show) ?? "?"}, ${rede}) via ${como}` +
      (serie.temporada ? `, temporada ${serie.temporada}` : "");
    // Id fixo no seriesData.js: já foi conferido à mão, não precisa de aviso
    const fixo = como === "id fixo";
    const anoBate = fixo || !serie.ano || anoDe(show) === serie.ano;
    const nomeBate =
      fixo ||
      normalizar(show.name).includes(normalizar(serie.busca ?? serie.nome).slice(0, 6)) ||
      normalizar(serie.nome).includes(normalizar(show.name).slice(0, 6));
    const marca = !imagem ? "✗" : anoBate && nomeBate ? "✓" : "⚠";
    anotar(marca, serie.nome, imagem ? encontrado : `${encontrado}, sem cartaz`);
  } catch (erro) {
    anotar("✗", serie.nome, erro.message);
  }
}

const js = `// Gerado pelo \`npm run series\` (scripts/series.mjs): não edite à mão.
// id → { poster, url, tvmaze }. Cartazes e dados: TVmaze (tvmaze.com).
export const POSTERS = ${JSON.stringify(posters, null, 2)};
`;
fs.writeFileSync(saida, js);

// Duas séries no mesmo show do TVmaze (ex.: as fases de Power Rangers, se
// o TVmaze juntar tudo num show só) ficariam com o mesmo cartaz
const porShow = {};
for (const [id, { tvmaze, temporada }] of Object.entries(posters)) {
  (porShow[`${tvmaze}/${temporada ?? ""}`] ??= []).push(id);
}
for (const ids of Object.values(porShow).filter((ids) => ids.length > 1)) {
  const nomes = ids.map((id) => SERIES.find((s) => s.id === id).nome).join(", ");
  anotar("⚠", nomes, "mesmo cartaz: fixe o `tvmaze` ou ponha um `poster` próprio");
}

const avisos = relatorio.filter(([m]) => m === "⚠" || m === "✗").length;
console.log(
  `\n${path.relative(raiz, saida)}: ${Object.keys(posters).length} de ${SERIES.length} séries com cartaz` +
    (avisos ? `, ${avisos} para conferir (⚠ / ✗)` : ""),
);
