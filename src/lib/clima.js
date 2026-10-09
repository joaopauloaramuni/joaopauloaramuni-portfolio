// Clima da cidade aproximada do visitante (tela de boas-vindas).
// Quem descobre a cidade e consulta o Open-Meteo é o servidor (api/_clima.js);
// aqui só buscamos o resultado e traduzimos o código do tempo.

const URL_CLIMA = "/api/clima";
const CHAVE = "portfolio:clima";
const VALIDADE_MS = 10 * 60 * 1000;

function lerGuardado() {
  try {
    const salvo = JSON.parse(sessionStorage.getItem(CHAVE));
    if (salvo && Date.now() - salvo.em < VALIDADE_MS) return salvo.dados;
  } catch {
    // storage bloqueado ou vazio
  }
  return undefined;
}

function guardar(dados) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify({ em: Date.now(), dados }));
  } catch {
    // sem storage: busca de novo no próximo carregamento
  }
}

// Uma promessa por carregamento: o StrictMode e o `clear` (que monta o
// BoasVindas de novo) reaproveitam o mesmo resultado
let promessa = null;

export function obterClima() {
  if (promessa) return promessa;

  promessa = (async () => {
    const guardado = lerGuardado();
    if (guardado !== undefined) return guardado;

    try {
      const resp = await fetch(URL_CLIMA, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(6000),
      });
      // 204 = sem cidade. No Docker/Nginx a rota não existe e volta o
      // index.html: o content-type confere que é mesmo a nossa resposta.
      const tipo = resp.headers.get("content-type") ?? "";
      if (resp.status !== 200 || !tipo.includes("application/json")) {
        guardar(null);
        return null;
      }
      const dados = await resp.json();
      const valido =
        dados && typeof dados.cidade === "string" && Number.isFinite(dados.temp);
      guardar(valido ? dados : null);
      return valido ? dados : null;
    } catch {
      return null; // rede fora, timeout: a linha só não aparece
    }
  })();

  return promessa;
}

// Códigos WMO do Open-Meteo → grupo (ícone + descrição no i18n)
// https://open-meteo.com/en/docs#weathervariables
export function grupoDoTempo(codigo) {
  if (codigo === 0) return "limpo";
  if (codigo === 1 || codigo === 2) return "poucas_nuvens";
  if (codigo === 3) return "nublado";
  if (codigo === 45 || codigo === 48) return "neblina";
  if (codigo >= 51 && codigo <= 57) return "garoa";
  if ((codigo >= 61 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) return "chuva";
  if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) return "neve";
  if (codigo >= 95) return "tempestade";
  return "nublado";
}
