// npm run viagens
//
// Desenha a grade de pontos dos mapas do comando "viagens" e grava em
// src/data/viagensMapa.js. Roda só na máquina do desenvolvedor, depois de
// mexer nas cidades ou nas visões de src/data/viagensData.js: o site recebe
// só as linhas de texto da grade (alguns kB), sem o mapa-múndi nem o d3.
//
// Cada linha da grade é uma string, um caractere por ponto:
//   " "  mar
//   "."  terra
//   "a"  país visitado nº 0 de VISITADOS, "b" o nº 1... (ver ALFABETO)
//
// Contornos: world-atlas (Natural Earth 1:50m), em devDependencies.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains, geoDistance } from "d3-geo";
import { CIDADES, VISOES } from "../src/data/viagensData.js";

const require = createRequire(import.meta.url);
const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const saida = path.join(raiz, "src/data/viagensMapa.js");

// Código ISO numérico (o id do world-atlas) de cada sigla do sobreData.js.
// País novo: acrescente aqui (https://en.wikipedia.org/wiki/ISO_3166-1_numeric)
const ISO_NUMERICO = {
  AE: "784", AR: "032", BR: "076", CH: "756", CN: "156", DE: "276",
  FR: "250", HK: "344", ID: "360", IT: "380", JP: "392", KR: "410",
  MO: "446", MY: "458", SG: "702", TH: "764", UY: "858", VA: "336",
};

const ALFABETO = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Um território só fica colorido se estiver a menos disto de uma cidade
// visitada do mesmo país: assim a Guiana Francesa não pinta por causa de
// Paris, mas Hokkaido pinta por causa de Tóquio
const ALCANCE_KM = 4000;
const RAIO_TERRA_KM = 6371;

const VISITADOS = [...new Set(CIDADES.map((c) => c.pais))].sort();
if (VISITADOS.length > ALFABETO.length) throw new Error("Países demais para o ALFABETO");

const semCodigo = VISITADOS.filter((sigla) => !ISO_NUMERICO[sigla]);
if (semCodigo.length) {
  throw new Error(`Falta o código ISO numérico de ${semCodigo.join(", ")} em scripts/viagens.mjs`);
}

const topo = JSON.parse(fs.readFileSync(require.resolve("world-atlas/countries-50m.json"), "utf8"));
const paises = feature(topo, topo.objects.countries).features;
const siglaDoId = Object.fromEntries(Object.entries(ISO_NUMERICO).map(([sigla, id]) => [id, sigla]));

// Quebra cada país em polígonos (ilhas, territórios ultramarinos) e guarda
// a caixa de cada um, para testar só os que podem conter o ponto
const caixa = (aneis) => {
  let [oeste, sul, leste, norte] = [180, 90, -180, -90];
  for (const [lon, lat] of aneis[0]) {
    oeste = Math.min(oeste, lon);
    leste = Math.max(leste, lon);
    sul = Math.min(sul, lat);
    norte = Math.max(norte, lat);
  }
  return [oeste, sul, leste, norte];
};

const pertoDeCidade = (sigla, aneis) => {
  const cidades = CIDADES.filter((c) => c.pais === sigla);
  return aneis[0].some(([lon, lat]) =>
    cidades.some((c) => geoDistance([lon, lat], [c.lon, c.lat]) * RAIO_TERRA_KM < ALCANCE_KM)
  );
};

const poligonos = paises.flatMap((pais) => {
  const { type, coordinates } = pais.geometry ?? {};
  const partes = type === "Polygon" ? [coordinates] : type === "MultiPolygon" ? coordinates : [];
  const sigla = siglaDoId[pais.id];
  const indice = VISITADOS.indexOf(sigla);
  return partes.map((aneis) => ({
    geo: { type: "Polygon", coordinates: aneis },
    caixa: caixa(aneis),
    marca: indice >= 0 && pertoDeCidade(sigla, aneis) ? ALFABETO[indice] : ".",
  }));
});

const pontoEm = (lon, lat) => {
  for (const p of poligonos) {
    const [oeste, sul, leste, norte] = p.caixa;
    if (lon < oeste || lon > leste || lat < sul || lat > norte) continue;
    if (geoContains(p.geo, [lon, lat])) return p.marca;
  }
  return " ";
};

const mapas = {};
for (const [id, v] of Object.entries(VISOES)) {
  const meio = ((v.norte + v.sul) / 2) * (Math.PI / 180);
  const passoLat = v.passo;
  const passoLon = v.corrigir === false ? v.passo : v.passo / Math.cos(meio);
  const linhas = Math.round((v.norte - v.sul) / passoLat);
  const colunas = Math.round((v.leste - v.oeste) / passoLon);
  const grade = [];
  for (let l = 0; l < linhas; l++) {
    let linha = "";
    for (let c = 0; c < colunas; c++) {
      linha += pontoEm(v.oeste + (c + 0.5) * passoLon, v.norte - (l + 0.5) * passoLat);
    }
    grade.push(linha.trimEnd());
  }
  mapas[id] = {
    norte: v.norte,
    oeste: v.oeste,
    passoLat: +passoLat.toFixed(6),
    passoLon: +passoLon.toFixed(6),
    linhas,
    colunas,
    grade,
  };
  console.log(`${id}: ${colunas}×${linhas} pontos`);
}

const js = `// Gerado por scripts/viagens.mjs (npm run viagens). Não edite à mão.
// Grade de pontos dos mapas do comando "viagens": " " mar, "." terra e
// uma letra para cada país visitado (a = VISITADOS[0], b = VISITADOS[1]...).

export const ALFABETO = ${JSON.stringify(ALFABETO)};
export const VISITADOS = ${JSON.stringify(VISITADOS)};

export const MAPAS = ${JSON.stringify(mapas, null, 2)};
`;

fs.writeFileSync(saida, js);
console.log(`${path.relative(raiz, saida)}: ${VISITADOS.length} países, ${(js.length / 1024).toFixed(1)} kB`);
