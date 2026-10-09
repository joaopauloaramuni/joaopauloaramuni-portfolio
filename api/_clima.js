// Clima da cidade do visitante, mostrado discretamente na tela de boas-vindas.
//
// De onde vem a cidade: a Vercel já descobre a localização aproximada de quem
// faz a requisição (pelo IP) e manda nos cabeçalhos x-vercel-ip-*. Não há
// pedido de permissão ao visitante, nem serviço de geolocalização de terceiros,
// nem chave de API. O clima vem do Open-Meteo (grátis, sem chave).
//
// Quem atende:
//   • a Vercel Function api/clima.js, em produção;
//   • o vite.config.js, no npm run dev e no npm run preview. Lá não existem os
//     cabeçalhos da Vercel, então vale o CLIMA_LOCAL_DEV do .env.local (ou a
//     linha simplesmente não aparece).
//   • no Docker (Nginx) não há função: /api/clima cai no index.html e o
//     navegador esconde a linha (ver src/lib/clima.js).
//
// Cuidados para não mostrar a cidade (e o clima) de outra pessoa:
//   • a resposta depende de QUEM pede, não da URL. Por isso ela NUNCA vai para
//     o cache da CDN (Cache-Control: private). Com s-maxage, a Vercel guardaria
//     a resposta do primeiro visitante e serviria a mesma cidade para todos;
//   • sem cidade no cabeçalho (IP sem localização), responde 204 e nada aparece;
//   • a cidade vai sempre escrita na tela ("24°C em Belo Horizonte"): se a
//     estimativa pelo IP errar (VPN, 4G, rede corporativa), o visitante vê que
//     é outra cidade, em vez de ler "na sua cidade" e ser enganado.
//
// Privacidade: as coordenadas são arredondadas (~1 km) antes de ir ao
// Open-Meteo e não são devolvidas ao navegador nem gravadas em lugar nenhum.
//
// O nome começa com "_" para a Vercel não transformar este arquivo em rota.

export const PROXY_PATH = "/api/clima";

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 4000;

// Cache em memória da função, por coordenada arredondada: visitantes da mesma
// cidade dentro de 10 min reaproveitam a consulta ao Open-Meteo
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map();

// Países que usam Fahrenheit
const FAHRENHEIT = new Set(["US", "LR", "MM", "BS", "BZ", "KY", "PW", "FM", "MH"]);

const decodificar = (valor) => {
  if (!valor) return "";
  try {
    return decodeURIComponent(valor).trim();
  } catch {
    return String(valor).trim();
  }
};

const arredondar = (n) => Math.round(Number(n) * 100) / 100;

const coordValida = (lat, lon) =>
  Number.isFinite(lat) &&
  Number.isFinite(lon) &&
  Math.abs(lat) <= 90 &&
  Math.abs(lon) <= 180;

// Lê a localização dos cabeçalhos da Vercel ou, no dev, do CLIMA_LOCAL_DEV
// ("-19.92,-43.94,Belo Horizonte,MG,BR")
export function lerLocal(headers, localDev) {
  const h = (nome) => headers[nome] ?? headers[nome.toLowerCase()];
  let cidade = decodificar(h("x-vercel-ip-city"));
  let regiao = decodificar(h("x-vercel-ip-country-region"));
  let pais = decodificar(h("x-vercel-ip-country")).toUpperCase();
  let lat = Number(h("x-vercel-ip-latitude"));
  let lon = Number(h("x-vercel-ip-longitude"));

  if (!cidade && localDev) {
    const [la, lo, c = "", r = "", p = ""] = localDev.split(",").map((s) => s.trim());
    lat = Number(la);
    lon = Number(lo);
    cidade = c;
    regiao = r;
    pais = p.toUpperCase();
  }

  // Sem cidade não mostramos nada: "24°C" sem dizer onde seria um chute
  if (!cidade || !coordValida(lat, lon)) return null;
  return { cidade, regiao, pais, lat: arredondar(lat), lon: arredondar(lon) };
}

async function consultarOpenMeteo({ lat, lon }, unidade) {
  const chave = `${lat},${lon},${unidade}`;
  const guardado = cache.get(chave);
  if (guardado && Date.now() - guardado.em < CACHE_MS) return guardado.dados;

  const url = new URL(OPEN_METEO);
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("temperature_unit", unidade);
  url.searchParams.set("timezone", "auto");

  const resp = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!resp.ok) throw new Error(`Open-Meteo ${resp.status}`);
  const json = await resp.json();
  const atual = json?.current;
  if (!atual || !Number.isFinite(atual.temperature_2m)) {
    throw new Error("Open-Meteo sem dados");
  }
  const dados = {
    temp: Math.round(atual.temperature_2m),
    codigo: atual.weather_code,
    dia: atual.is_day === 1,
  };
  cache.set(chave, { em: Date.now(), dados });
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return dados;
}

export async function responderClima(headers, localDev) {
  const json = (status, corpo, cacheControl) => ({
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // private: só o navegador do próprio visitante guarda (10 min).
      // Nunca public/s-maxage: a CDN serviria a cidade de um para todos.
      "Cache-Control": cacheControl,
    },
    corpo: corpo == null ? "" : JSON.stringify(corpo),
  });

  const local = lerLocal(headers, localDev);
  if (!local) return json(204, null, "private, no-store");

  const unidade = FAHRENHEIT.has(local.pais) ? "fahrenheit" : "celsius";
  try {
    const clima = await consultarOpenMeteo(local, unidade);
    return json(
      200,
      {
        cidade: local.cidade,
        regiao: local.regiao,
        pais: local.pais,
        unidade: unidade === "fahrenheit" ? "F" : "C",
        ...clima,
      },
      "private, max-age=600"
    );
  } catch (erro) {
    console.error("Clima:", erro?.message ?? erro);
    return json(204, null, "private, no-store");
  }
}

export async function atenderClima(req, res, localDev) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end();
  }
  const resultado = await responderClima(req.headers, localDev);
  res.statusCode = resultado.status;
  Object.entries(resultado.headers).forEach(([nome, valor]) => res.setHeader(nome, valor));
  res.end(req.method === "HEAD" ? undefined : resultado.corpo);
}
