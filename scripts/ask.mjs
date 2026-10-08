// Monta a base de conhecimento do comando "pergunta" (alias "ask").
//
// Uso:
//   npm run ask
//
// Junta num texto só (Markdown) tudo o que a IA pode saber sobre mim:
//   • o que os comandos do portfólio mostram, em português: sobre,
//     experiências, projetos, prêmios, recomendações, habilidades,
//     disciplinas (docenciaData.js) e o resumo do lattes (lattesData.js);
//   • o texto do currículo em PDF (public/cv-pt.pdf);
//   • o que estiver em src/data/askData.js (EXTRAS), para o que não aparece
//     no site.
// O resultado vai para api/_askPerfil.js, que a função /api/ask manda para a
// IA junto com cada pergunta. Rode de novo sempre que atualizar o currículo,
// o i18n ou os dados dos comandos: a IA só sabe o que estiver lá.
//
// Os arquivos de src/ usam imports sem extensão e o i18n.js mexe no
// document, então o script carrega tudo pelo próprio Vite (ssrLoadModule),
// do mesmo jeito que o site enxerga. O PDF é lido com o pdfjs-dist, que já
// vem com o react-pdf do comando "curriculo".
//
// Telefone fica de fora (sai do texto do PDF): para contato, a IA indica os
// comandos "contato" e "calendly".

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = resolve(ROOT, "api/_askPerfil.js");
const CV_PDF = resolve(ROOT, "public/cv-pt.pdf");

// Comandos que não fazem sentido sugerir numa resposta
const COMANDOS_FORA = new Set(["limpar", "turmas", "canvas", "pergunta"]);

/* =====================================================================
   Carregando os módulos do site
   ===================================================================== */

// O i18n.js acerta o <html lang> ao carregar: no Node não há document
globalThis.document ??= { documentElement: {} };

const vite = await createServer({
  root: ROOT,
  configFile: false,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});

const carregar = (caminho) => vite.ssrLoadModule(caminho);

let modulos;
try {
  modulos = {
    i18n: (await carregar("/src/i18n.js")).default,
    sobre: await carregar("/src/data/sobreData.js"),
    experiencias: await carregar("/src/data/experiencesData.js"),
    projetos: await carregar("/src/data/projectsData.js"),
    premios: await carregar("/src/data/awardsData.js"),
    recomendacoes: await carregar("/src/data/recommendationsData.js"),
    habilidades: await carregar("/src/data/skillsData.js"),
    docenciaData: await carregar("/src/data/docenciaData.js"),
    docencia: await carregar("/src/lib/docencia.js"),
    lattes: await carregar("/src/data/lattesData.js"),
    comandos: await carregar("/src/commands.js"),
    ask: await carregar("/src/data/askData.js"),
  };
} finally {
  await vite.close();
}

const t = modulos.i18n.getFixedT("pt");

// Tira as tags dos textos do i18n (<b>, <galo>, <repo>...), mantendo o texto
const limpar = (texto) =>
  String(texto ?? "")
    .replace(/<\/?[a-z][a-z0-9_-]*>/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const tx = (chave, opcoes) => {
  const valor = t(chave, opcoes);
  // Chave que não existe volta como a própria chave: ignora
  return valor === chave ? "" : limpar(valor);
};

const lista = (itens) => itens.filter(Boolean).map((item) => `- ${item}`).join("\n");
const secao = (titulo, corpo) => (corpo?.trim() ? `## ${titulo}\n\n${corpo.trim()}\n` : "");
const periodo = (inicio, fim) =>
  fim === inicio ? `${inicio}` : `${inicio} – ${fim ?? "hoje"}`;

/* =====================================================================
   Seções do portfólio
   ===================================================================== */

function identidade() {
  const { sobre, docencia } = modulos;
  const { NASCIMENTO, DEV_DESDE } = sobre;
  const nascimento = `${String(NASCIMENTO.dia).padStart(2, "0")}/${String(NASCIMENTO.mes).padStart(2, "0")}/${NASCIMENTO.ano}`;
  return lista([
    `Nome: ${tx("sobre.nome")} (nome completo: João Paulo Carneiro Aramuni)`,
    `Cargo: ${tx("sobre.cargo")}`,
    `Lema: ${tx("sobre.lema_1")} ${tx("sobre.lema_2")}`,
    `Moro em: ${tx("sobre.local")}`,
    `Nascimento: ${nascimento} (signo: ${tx("sobre.signo")})`,
    `Desenvolvo sistemas desde ${DEV_DESDE} e ensino tecnologia desde ${docencia.PRIMEIRO_ANO}`,
  ]);
}

function bio() {
  const { DEV_DESDE } = modulos.sobre;
  // Os anos são preenchidos no servidor, na hora da pergunta
  return [
    tx("sobre.bio_1"),
    tx("sobre.bio_2", { dev: "{{anos_dev}}", ensino: "{{anos_ensino}}" }),
    `(Contando desde ${DEV_DESDE}, no Banco do Brasil.)`,
  ].join("\n\n");
}

function numeros() {
  const { TCCS_ORIENTADOS, BANCAS, AES } = modulos.sobre;
  return lista([
    `${TCCS_ORIENTADOS} TCCs orientados`,
    `${BANCAS} bancas examinadoras`,
    `CTO da Agência Experimental de Software (AES): ${AES.times} times, ~${AES.pessoas} pessoas sob minha gestão`,
  ]);
}

function hoje() {
  return lista(
    modulos.sobre.hoje.map((item) => {
      const base = `sobre.hoje.${item.id}`;
      return `${tx(`${base}.cargo`)} ${tx("sobre.hoje.em")} ${tx(`${base}.org`)}: ${tx(`${base}.detalhe`)}${item.url ? ` (${item.url})` : ""}`;
    })
  );
}

function trajetoria() {
  const { trajetoria: dados } = modulos.sobre;
  const coluna = (id) =>
    lista(
      dados[id].map((item) => {
        const base = `sobre.trajetoria.${item.id}`;
        return `${periodo(item.inicio, item.fim)} · ${tx(`${base}.cargo`)} na ${tx(`${base}.org`)}: ${tx(`${base}.detalhe`)}`;
      })
    );
  return [
    `### ${tx("sobre.trajetoria.profissao")} (mercado)\n\n${coluna("profissao")}`,
    `### ${tx("sobre.trajetoria.vocacao")} (docência)\n\n${coluna("vocacao")}`,
  ].join("\n\n");
}

function formacao() {
  return lista(
    modulos.sobre.formacao.map((item) => {
      const base = `sobre.formacao.${item.id}`;
      let linha = `${periodo(item.inicio, item.fim)} · ${tx(`${base}.nivel`)} em ${tx(`${base}.curso`)}, ${tx(`${base}.org`)}`;
      if (item.trabalho) {
        const { tipo, titulo, url, orientador } = item.trabalho;
        linha += `. ${tx(`sobre.formacao.tipos.${tipo}`)}: "${titulo}" (orientador: ${orientador.nome}; ${url})`;
      }
      if (item.modulos) {
        linha += `. Módulos: ${item.modulos.map((m) => tx(`${base}.modulos.${m}`)).join(", ")}`;
      }
      return linha;
    })
  ).concat(`\n\nTrabalhos finais e slides das defesas: ${modulos.sobre.TRABALHOS_FINAIS}`);
}

// "2024.1, 2024.2, 2025.1" → "2024.1 a 2025.1"; com buracos, lista os trechos
function semestres(lista) {
  if (!lista?.length) return "";
  const idx = (s) => {
    const [ano, sem] = s.split(".").map(Number);
    return ano * 2 + sem - 1;
  };
  const nome = (i) => `${Math.floor(i / 2)}.${(i % 2) + 1}`;
  const ordenados = [...new Set(lista.map(idx))].sort((a, b) => a - b);
  const trechos = [];
  for (const i of ordenados) {
    const ultimo = trechos[trechos.length - 1];
    if (ultimo && i === ultimo[1] + 1) ultimo[1] = i;
    else trechos.push([i, i]);
  }
  return trechos.map(([a, b]) => (a === b ? nome(a) : `${nome(a)} a ${nome(b)}`)).join(", ");
}

function disciplinas() {
  const { disciplinas: todas, instituicoes, cargos, GITHUB } = modulos.docenciaData;
  const nomeCurso = (id) => tx(`lattes.cursos.${id}`) || id;
  const blocos = instituicoes.map((inst) => {
    const itens = todas
      .filter((d) => d.instituicao === inst.id)
      .map((d) => {
        const cursos = (d.cursos ?? []).map(nomeCurso).join(", ");
        const quando = d.meses ? d.meses.join(" a ") : `semestres ${semestres(d.semestres)}`;
        const repo = d.repo ? ` · material: ${GITHUB}/${d.repo}` : "";
        return `${d.nome}${cursos ? ` (${cursos})` : ""} · ${quando}${repo}`;
      });
    const papeis = (cargos ?? [])
      .filter((c) => c.instituicao === inst.id)
      .map((c) => `${c.nome} · ${c.meses.join(" a ")}`);
    if (!itens.length && !papeis.length) return "";
    return `### ${inst.nome}\n\n${lista([...itens, ...papeis])}`;
  });
  return [
    'Semestre "AAAA.1" = jan–jun, "AAAA.2" = jul–dez. Disciplinas com o semestre atual são as que leciono agora.',
    ...blocos.filter(Boolean),
  ].join("\n\n");
}

function experiencias() {
  return lista(
    modulos.experiencias.experiencesData.map((xp) => {
      const fim = xp.endDate === "present" ? "atual" : xp.endDate;
      const quando = xp.startDate === xp.endDate ? xp.startDate : `${xp.startDate} – ${fim}`;
      const skills = tx(`experiencias.${xp.skillsId}`);
      return `${tx(`experiencias.${xp.roleId}`)} · ${tx(`experiencias.${xp.companyId}`)} · ${quando}: ${tx(`experiencias.${xp.descriptionId}`)}${skills ? ` Competências: ${skills}` : ""}`;
    })
  );
}

function projetos() {
  return lista(
    modulos.projetos.projectsData.map(
      (p) =>
        `${tx(`projetos.${p.titleId}`)} (${p.technologies.join(", ")}): ${tx(`projetos.${p.descriptionId}`)} ${p.repoLink}`
    )
  );
}

function premios() {
  return lista(
    modulos.premios.awardsData.map((p) => {
      const base = `premios.${p.id}`;
      return `${p.year} · ${tx(`${base}.titulo`)} (${tx(`${base}.org`)}): ${tx(`${base}.desc`)}`;
    })
  );
}

function habilidades() {
  return lista(modulos.habilidades.skillsData.map((s) => `${s.name}: ${s.level}%`));
}

function vivenciaEClientes() {
  const { vivencia, clientes } = modulos.sobre;
  return [
    `Vivência: ${vivencia.map((v) => tx(`sobre.vivencia.${v.id}`)).join(", ")}.`,
    `Já desenvolvi software para: ${clientes
      .map((c) => {
        const desc = tx(`sobre.clientes.${c.id}.desc`);
        return `${tx(`sobre.clientes.${c.id}.nome`)}${desc ? ` (${desc})` : ""}`;
      })
      .join("; ")}.`,
  ].join("\n\n");
}

function pessoal() {
  const { hobbies, serieFavorita, assistindo, continentes } = modulos.sobre;
  const lugares = continentes
    .map(
      (c) =>
        `${tx(`sobre.pessoal.continentes.${c.id}`)}: ${c.lugares
          .map((l) => tx(`sobre.pessoal.lugares.${l.id}`))
          .join(", ")}`
    )
    .join("; ");
  return lista([
    `Time: ${tx("sobre.pessoal.time")} (Clube Atlético Mineiro, o Galo; o site tem até um tema do Galo: tema --galo)`,
    `Hobbies: ${hobbies.map((h) => tx(`sobre.pessoal.hobbies.${h.id}`)).join(", ")}`,
    `Série favorita: ${serieFavorita.nome}`,
    `Assistindo: ${assistindo.map((s) => s.nome).join(", ")}`,
    `Lugares que já visitei: ${lugares}`,
  ]);
}

// Corta um texto longo no fim de uma palavra
const cortar = (texto, max) =>
  texto.length > max ? `${texto.slice(0, max).replace(/\s+\S*$/, "")}…` : texto;

// As recomendações somam mais de 70: as mais recentes vão com um trecho do
// texto e as outras só com o nome, para a base não crescer demais (o comando
// "recomendacoes" mostra todas, completas)
const RECOMENDACOES_COM_TEXTO = 15;
const TAMANHO_TRECHO = 320;

function recomendacoes() {
  const todas = modulos.recomendacoes.recommendationsData;
  // "Em 29 de setembro de 2026, João Gabriel foi cliente de João Paulo"
  const relacao = (r) => tx(`recomendacoes.${r.relationshipId}`).replace(/^Em [^,]+,\s*/, "");
  const comTexto = todas.slice(0, RECOMENDACOES_COM_TEXTO);
  const soNome = todas.slice(RECOMENDACOES_COM_TEXTO);
  return [
    `${todas.length} recomendações no LinkedIn, de alunos, colegas de trabalho e clientes. As mais recentes:`,
    lista(
      comTexto.map(
        (r) =>
          `${r.name} (${r.year}; ${relacao(r)}): "${cortar(tx(`recomendacoes.${r.recommendationId}`), TAMANHO_TRECHO)}"`
      )
    ),
    `Também me recomendaram: ${soNome.map((r) => `${r.name} (${r.year})`).join(", ")}.`,
  ].join("\n\n");
}

function lattes() {
  const { lattesInfo, tccs, interdisciplinares, agencia, bancas } = modulos.lattes;
  const tccsLista = lista(
    tccs.map((tcc) => `${tcc.ano} · "${tcc.titulo}" · ${tcc.alunos.join(", ")} · ${tcc.curso}, ${tcc.instituicao}`)
  );
  const aes = lista(
    agencia.map(
      (p) =>
        `${p.ano} · ${p.nome}${p.parceiro ? ` (parceria: ${p.parceiro})` : ""}: ${p.descricao}${p.tecnologias?.length ? ` Tecnologias: ${p.tecnologias.join(", ")}.` : ""}`
    )
  );
  // Os TIs passam de 60: vão só nome, ano e disciplina (lattes --tis mostra o resto)
  const tis = lista(
    interdisciplinares.map((p) => `${p.ano} · ${p.nome} (TI ${p.disciplina.numero}: ${p.disciplina.nome})`)
  );
  const porNivel = bancas.reduce((total, b) => ({ ...total, [b.nivel]: (total[b.nivel] ?? 0) + 1 }), {});
  return [
    lista([
      `Currículo Lattes: ${lattesInfo.url} (ORCID: ${lattesInfo.orcid}; atualizado em ${lattesInfo.atualizadoEm})`,
      `${tccs.length} TCCs orientados e ${bancas.length} participações em bancas (${Object.entries(porNivel)
        .map(([nivel, n]) => `${n} de ${nivel}`)
        .join(", ")})`,
      `${interdisciplinares.length} trabalhos interdisciplinares (TIs) orientados`,
      `${agencia.length} projetos da Agência Experimental de Software (AES)`,
    ]),
    `### Projetos da Agência Experimental de Software\n\n${aes}`,
    `### TCCs orientados\n\n${tccsLista}`,
    `### Trabalhos interdisciplinares orientados\n\n${tis}`,
  ].join("\n\n");
}

function comandos() {
  return lista(
    Object.values(modulos.comandos.commandList)
      .filter((c) => !COMANDOS_FORA.has(c.name))
      .map((c) => `\`${c.name}\` (ou ${c.aliases.map((a) => `\`${a}\``).join(", ")}): ${tx(`ajuda.${c.name}.desc`)}`)
  );
}

function links() {
  return lista([
    "Portfólio: https://aramuni.dev",
    "GitHub: https://github.com/joaopauloaramuni",
    "LinkedIn: https://www.linkedin.com/in/joaopauloaramuni/",
    `Lattes: ${modulos.lattes.lattesInfo.url}`,
    "E-mail: joaopauloaramuni@gmail.com",
  ]);
}

/* =====================================================================
   Currículo em PDF
   ===================================================================== */

async function textoDoCurriculo() {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await getDocument({
    url: CV_PDF,
    useSystemFonts: true,
    isEvalSupported: false,
    verbosity: 0,
  }).promise;
  const paginas = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const pagina = await pdf.getPage(n);
    const { items } = await pagina.getTextContent();
    paginas.push(items.map((item) => item.str + (item.hasEOL ? "\n" : "")).join(""));
  }
  await pdf.destroy();

  // O cabeçalho (e-mail, GitHub, LinkedIn com ícones) já está em "Links":
  // o texto começa no "Objetivo"
  const texto = paginas.join("\n");
  const inicio = texto.search(/^Objetivo\s*$/m);

  return (
    (inicio > 0 ? texto.slice(inicio) : texto)
      // Ícones da fonte (e-mail, GitHub, LinkedIn...) viram caracteres soltos
      .replace(/[\u{E000}-\u{F8FF}]/gu, "")
      // Telefone: fica de fora da base
      .replace(/\+?\(?\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}\b/g, "")
      // Palavras hifenizadas na quebra de linha: "exper-\niência" → "experiência"
      .replace(/(\p{L})-\n(\p{Ll})/gu, "$1$2")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/* =====================================================================
   Gravando
   ===================================================================== */

const curriculo = await textoDoCurriculo();
const hojeIso = new Date().toISOString().slice(0, 10);

const perfil = [
  `# Base de conhecimento sobre João Paulo Aramuni\n\nGerada por npm run ask em ${hojeIso}. A parte "Portfólio" é a mais atualizada; o "Currículo em PDF" traz mais detalhes de cada experiência. Se os dois discordarem, vale o portfólio.`,
  "# Portfólio (aramuni.dev)",
  secao("Identidade", identidade()),
  secao("Quem sou", bio()),
  secao("Números", numeros()),
  secao("O que faço hoje", hoje()),
  secao("Trajetória", trajetoria()),
  secao("Formação", formacao()),
  secao("Disciplinas que leciono e já lecionei", disciplinas()),
  secao("Experiências profissionais (comando experiencias)", experiencias()),
  secao("Projetos em destaque (comando projetos)", projetos()),
  secao("Prêmios e reconhecimentos (comando premios)", premios()),
  secao("Habilidades em programação (comando skills)", habilidades()),
  secao("Vivência e clientes", vivenciaEClientes()),
  secao("Fora do terminal", pessoal()),
  secao("Recomendações do LinkedIn (comando recomendacoes)", recomendacoes()),
  secao("Lattes (comando lattes)", lattes()),
  secao("Outras informações", modulos.ask.EXTRAS),
  secao("Links", links()),
  secao("Comandos deste portfólio (para indicar ao visitante)", comandos()),
  "# Currículo em PDF (public/cv-pt.pdf, comando curriculo)",
  curriculo,
]
  .filter(Boolean)
  .join("\n\n");

// Template string legível no arquivo: só escapa o que quebraria o literal
const literal = perfil.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const { NASCIMENTO, DEV_DESDE } = modulos.sobre;
const conteudo = `// Gerado por scripts/ask.mjs (npm run ask). Não edite à mão: para mudar o
// que a IA do comando "pergunta" sabe, edite o currículo (public/cv-pt.pdf), os
// dados dos comandos ou o src/data/askData.js e rode de novo.
//
// Base de conhecimento que a função /api/ask manda para a IA junto com cada
// pergunta. Tudo aqui é público: está no site ou no currículo em PDF.

// Para o servidor calcular idade e anos de experiência no dia da pergunta
export const PERFIL_FATOS = ${JSON.stringify(
  { geradoEm: hojeIso, nascimento: NASCIMENTO, devDesde: DEV_DESDE, ensinoDesde: modulos.docencia.PRIMEIRO_ANO },
  null,
  2
)};

export const PERFIL = \`${literal}\n\`;
`;

writeFileSync(OUTPUT, conteudo);

const kb = (Buffer.byteLength(perfil) / 1024).toFixed(1);
// ~4 caracteres por token em português: é só uma ordem de grandeza
const tokens = Math.round(perfil.length / 4 / 1000);
console.log(`✔ api/_askPerfil.js: ${kb} kB, ~${tokens} mil tokens por pergunta`);
