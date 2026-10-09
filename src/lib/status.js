// Status da tela de boas-vindas: "em aula agora", "disponível", fim de
// semana, feriado ou férias (funções puras, sem React, fáceis de testar).
//
// Usa os mesmos dados do comando "cal": as aulas de data/horarioData.js e os
// feriados, recessos e semestres do calendário da PUC (data/feriados.js).
// Tudo no fuso de Belo Horizonte, como o cal: quem abre de fora do Brasil vê
// o mesmo status.

import { agoraEmBH, aulasNaData, isoDoDia, minutosDe, proximaAula } from "./horario";
import { diaEspecialEm, ehLetivo } from "../data/feriados";

// Quantos minutos antes da aula o status vira "indo para a aula"
export const MINUTOS_A_CAMINHO = 15;

// Feriado e recesso escolar mostram o nome do dia; recesso docente e férias
// coletivas caem fora do semestre, então viram "de férias"
const COM_NOME = new Set(["feriado", "recesso"]);

// Qual é o status agora? Devolve um destes:
//   { tipo: "aula", aula }                    aula em andamento
//   { tipo: "a_caminho", aula, proxima }      a próxima aula começa em até 15 min
//   { tipo: "disponivel", proxima }           ainda tem aula hoje, mais tarde
//   { tipo: "encerradas", proxima }           as aulas de hoje já acabaram
//   { tipo: "sem_aulas", proxima }            dia letivo, mas sem aula
//   { tipo: "feriado" | "recesso", chave, proxima }
//   { tipo: "sabado" | "domingo", proxima }
//   { tipo: "ferias", proxima }               fora do semestre letivo
// proxima vem de proximaAula(): { aula, diaMs, faltam } ou null
export function statusAgora(agora = agoraEmBH()) {
  const proxima = proximaAula(agora);
  const iso = isoDoDia(agora.diaMs);

  // Feriado vem antes do fim de semana: um sábado de feriado mostra o nome
  const especial = diaEspecialEm(iso);
  if (especial) {
    return COM_NOME.has(especial.tipo)
      ? { tipo: especial.tipo, chave: especial.chave, proxima }
      : { tipo: "ferias", proxima };
  }
  if (agora.diaSemana === 6) return { tipo: "sabado", proxima };
  if (agora.diaSemana === 0) return { tipo: "domingo", proxima };
  if (!ehLetivo(iso)) return { tipo: "ferias", proxima };

  const aulas = aulasNaData(agora.diaMs);
  const atual = aulas.find(
    (a) => agora.minutos >= minutosDe(a.inicio) && agora.minutos < minutosDe(a.fim)
  );
  if (atual) return { tipo: "aula", aula: atual };

  if (!aulas.length) return { tipo: "sem_aulas", proxima };

  const hoje = proxima && proxima.diaMs === agora.diaMs;
  if (hoje && proxima.faltam <= MINUTOS_A_CAMINHO) {
    return { tipo: "a_caminho", aula: proxima.aula, proxima };
  }
  return { tipo: hoje ? "disponivel" : "encerradas", proxima };
}

// Grupo da bolinha colorida: ocupado, saindo, livre ou folga
export function corDoStatus(tipo) {
  if (tipo === "aula") return "ocupado";
  if (tipo === "a_caminho") return "saindo";
  if (tipo === "disponivel" || tipo === "encerradas" || tipo === "sem_aulas") return "livre";
  return "folga";
}

// Comando do cal que mostra mais sobre o status: a agenda do dia num dia
// letivo, a semana (no fim de semana, já é a próxima) num feriado ou fim de
// semana, e o mês nas férias
export function visaoDoCal(tipo) {
  if (tipo === "ferias") return "mes";
  if (tipo === "sabado" || tipo === "domingo" || tipo === "feriado" || tipo === "recesso") {
    return "semana";
  }
  return "hoje";
}

// Quando é a próxima aula, em relação a hoje: "hoje", "amanha", "semana"
// (nos próximos 6 dias, mostra o dia da semana) ou "data"
export function quandoRelativo(diaMs, hojeMs) {
  const dias = Math.round((diaMs - hojeMs) / (24 * 60 * 60 * 1000));
  if (dias <= 0) return "hoje";
  if (dias === 1) return "amanha";
  if (dias < 7) return "semana";
  return "data";
}

// "21:40" → "21h40" e "07:00" → "7h" em português; "9:40 PM" em inglês
// (com espaço sem quebra antes do AM/PM)
export function formatarHora(hhmm, lang) {
  const [h, m] = hhmm.split(":").map(Number);
  if (lang === "en") {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    })
      .format(Date.UTC(2000, 0, 1, h, m))
      .replace(/\s/g, "\u00a0"); // "10:40 AM" não quebra no meio
  }
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}
