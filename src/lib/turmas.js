// Contas do comando "turmas" sobre os dados do npm run turmas
// (data/turmasData.js). Sem React, para dar para testar sozinho.

const DIA_MS = 86_400_000;
const SEMANA_MS = 7 * DIA_MS;

// Quando um grupo merece atenção
export const LIMITES = {
  diasParado: 7, // dias sem commit
  fatiaConcentrada: 0.5, // um integrante com metade ou mais dos commits
  integrantesParaConcentrar: 3, // em dupla, metade é o esperado
};

// Grupo com métricas (os que falharam na última vez mas tinham dados antes
// continuam com eles, com um "aviso")
export const temDados = (g) => Boolean(g.codigo);

// Ordem padrão de todos os gráficos: primeiro o campus (na ordem em que
// aparece na lista de turmasRepos.js), depois quem tem mais linhas de código.
// Dentro de cada campus, os grupos sem dados vão para o fim, na ordem da lista.
export function ordenarPorCampusELinhas(grupos, lista) {
  const campi = [...new Set(lista.map((g) => g.campus))];
  const linhas = (g) => (temDados(g) ? g.codigo.linhas : -1);
  return [...grupos].sort(
    (a, b) => campi.indexOf(a.campus) - campi.indexOf(b.campus) || linhas(b) - linhas(a)
  );
}

// Os dias contam a partir da coleta de cada grupo, não de hoje: com dados
// de uma semana atrás, "parado há 2 dias" continua certo
const referenciaDe = (g, info) => Date.parse(g.atualizadoEm ?? info.geradoEm);

export function diasSemCommit(g, info) {
  if (!g.ultimoCommit) return null;
  return Math.max(0, Math.floor((referenciaDe(g, info) - Date.parse(g.ultimoCommit)) / DIA_MS));
}

export function alertasDo(g, info) {
  if (!temDados(g)) return [];
  const alertas = [];
  const dias = diasSemCommit(g, info);
  if (g.commits === 0) alertas.push({ tipo: "semCommits" });
  else if (dias !== null && dias > LIMITES.diasParado) alertas.push({ tipo: "parado", dias });

  const ativos = g.autores.length;
  if (g.integrantes && ativos > 0 && ativos < g.integrantes) {
    alertas.push({ tipo: "inativos", count: g.integrantes - ativos });
  }
  const maior = g.autores[0]?.c ?? 0;
  const tamanho = Math.max(g.integrantes ?? 0, ativos);
  if (tamanho >= LIMITES.integrantesParaConcentrar && maior >= LIMITES.fatiaConcentrada) {
    alertas.push({ tipo: "concentrado", fatia: maior });
  }
  return alertas;
}

const soma = (valores) => valores.reduce((total, n) => total + (n ?? 0), 0);

export function totaisDe(grupos, info) {
  const comDados = grupos.filter(temDados);
  const comApi = comDados.filter((g) => g.prs);
  return {
    grupos: grupos.length,
    comDados: comDados.length,
    commits: soma(comDados.map((g) => g.commits)),
    linhas: soma(comDados.map((g) => g.codigo.linhas)),
    temApi: comApi.length > 0,
    prs: {
      mergeados: soma(comApi.map((g) => g.prs.mergeados)),
      abertos: soma(comApi.map((g) => g.prs.abertos)),
      fechados: soma(comApi.map((g) => g.prs.fechados)),
    },
    issues: {
      fechadas: soma(comApi.map((g) => g.issues?.fechadas)),
      abertas: soma(comApi.map((g) => g.issues?.abertas)),
    },
    parados: comDados.filter((g) =>
      alertasDo(g, info).some((a) => a.tipo === "parado" || a.tipo === "semCommits")
    ).length,
  };
}

// Linhas por linguagem somando os grupos: [[nome, linhas], ...], maior primeiro
export function linguagensDe(grupos) {
  const total = new Map();
  grupos.filter(temDados).forEach((g) =>
    g.codigo.linguagens.forEach(([nome, linhas]) => total.set(nome, (total.get(nome) ?? 0) + linhas))
  );
  return [...total].sort((a, b) => b[1] - a[1]);
}

// Cores das linguagens de uma disciplina: as CORES maiores (somando todos os
// grupos dela, sem filtro) ganham uma cor fixa, na ordem; o resto é "outras".
// Assim um filtro (turmas ti5 coreu) não troca a cor de nenhuma linguagem.
export const CORES_DE_LINGUAGEM = 6;
export function paletaDaDisciplina(todosOsGrupos, disciplina) {
  const nomes = linguagensDe(todosOsGrupos.filter((g) => g.disciplina === disciplina))
    .slice(0, CORES_DE_LINGUAGEM)
    .map(([nome]) => nome);
  return {
    nomes,
    cor: (nome) => {
      const i = nomes.indexOf(nome);
      return i < 0 ? "var(--text-dim)" : `var(--turmas-ling-${i + 1})`;
    },
  };
}

// Linhas das linguagens `principais` e o resto somado
export function dobrarResto(linguagens, principais) {
  const nomes = new Set(principais);
  const top = linguagens.filter(([nome]) => nomes.has(nome));
  const resto = soma(linguagens.filter(([nome]) => !nomes.has(nome)).map(([, n]) => n));
  return { top, resto };
}

// Número de semanas desde o início do semestre (a última pode estar em andamento)
export function semanasDe(info) {
  const inicio = Date.parse(`${info.inicio}T00:00:00-03:00`);
  const fim = Date.parse(`${info.fim}T23:59:59-03:00`);
  const ate = Math.min(Date.parse(info.geradoEm), fim);
  return Math.max(1, Math.floor((ate - inicio) / SEMANA_MS) + 1);
}

// Segunda e domingo da semana n (1, 2...), como "AAAA-MM-DD"
export function datasDaSemana(info, n) {
  const inicio = Date.parse(`${info.inicio}T12:00:00Z`) + (n - 1) * SEMANA_MS;
  const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
  return { de: iso(inicio), ate: iso(inicio + 6 * DIA_MS) };
}

// Commits de todos os grupos em cada semana
export function commitsPorSemana(grupos, semanas) {
  const total = new Array(semanas).fill(0);
  grupos.filter(temDados).forEach((g) =>
    g.semanas.forEach((n, i) => {
      if (i < semanas) total[i] += n;
    })
  );
  return total;
}
