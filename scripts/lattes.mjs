// Importa o currículo Lattes para o comando "lattes".
//
// Uso:
//   npm run lattes -- <CV_xxx.zip | xxx.xml> [curriculo-lattes.pdf]
//
// O primeiro arquivo é a exportação XML do Lattes (o .zip que a Plataforma
// Lattes baixa, ou o .xml já descompactado). O segundo, opcional, é o PDF do
// currículo: ele é copiado para public/lattes.pdf, que o "lattes --pdf"
// oferece para download.
//
// O XML do Lattes traz CPF, RG, data de nascimento, nome dos pais e endereço
// residencial. Nada disso sai daqui: o script grava em src/data/lattesData.js
// só o que o comando mostra (TCCs orientados, trabalhos interdisciplinares,
// projetos da Agência Experimental de Software e bancas). Por isso o XML
// nunca vai para o public/ nem para o repositório.
//
// Sem dependências: o XML do Lattes guarda tudo em atributos, então um
// leitor de tags simples resolve, e o .zip é lido com o zlib do Node.

import { copyFileSync, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DATA = resolve(ROOT, "src/data/lattesData.js");
const OUTPUT_PDF = resolve(ROOT, "public/lattes.pdf");

// Nomes longos das instituições → sigla mostrada no terminal
const INSTITUICOES = {
  "Pontifícia Universidade Católica de Minas Gerais": "PUC Minas",
  "Universidade FUMEC": "FUMEC",
};

// Softwares cadastrados como "Nome (Trabalho Interdisciplinar V: Aplicações
// Distribuídas - PUC Minas)" são os trabalhos interdisciplinares orientados
const TRABALHO_INTERDISCIPLINAR =
  /^(.*?)\s*\(\s*Trabalho Interdisciplinar\s+([IVX]+)\s*:\s*(.+?)\s+-\s+(.+?)\s*\)\s*$/;

// Softwares "Nome (Agência Experimental de Software - PUC Minas)" são os
// projetos da AES. Quando há parceiro, ele vem antes: "Nome (MRV Engenharia e
// Agência Experimental de Software - PUC Minas)"
const AGENCIA_EXPERIMENTAL =
  /^(.*?)\s*\(\s*(?:(.+?)\s+(?:e|-)\s+)?Agência Experimental de Software\s+-\s+(.+?)\s*\)\s*$/;

// Grafias diferentes da mesma tecnologia ("NextJs", "Next.Js", "NextJS")
// viram uma só, para a contagem do resumo. A chave é o nome em minúsculas,
// só com letras e números.
const TECNOLOGIAS = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  html: "HTML",
  css: "CSS",
  php: "PHP",
  nextjs: "Next.js",
  nodejs: "Node.js",
  vuejs: "Vue.js",
  reactnative: "React Native",
  fastapi: "FastAPI",
};

// Tipos de banca de trabalho de conclusão (sufixo da tag) → nível
const NIVEIS_BANCA = {
  "PARTICIPACAO-EM-BANCA-DE-DOUTORADO": "doutorado",
  "PARTICIPACAO-EM-BANCA-DE-EXAME-QUALIFICACAO": "qualificacao",
  "PARTICIPACAO-EM-BANCA-DE-MESTRADO": "mestrado",
  "PARTICIPACAO-EM-BANCA-DE-APERFEICOAMENTO-ESPECIALIZACAO": "especializacao",
  "PARTICIPACAO-EM-BANCA-DE-GRADUACAO": "graduacao",
};

/* ---------------------------------------------------------------------
   Leitura dos arquivos
   --------------------------------------------------------------------- */

// Lê o primeiro .xml de um .zip (método stored ou deflate)
function readXmlFromZip(buffer) {
  // Fim do diretório central: assinatura 0x06054b50, procurada de trás para frente
  let end = buffer.length - 22;
  while (end >= 0 && buffer.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error("O .zip não é válido.");

  const entries = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16);

  for (let i = 0; i < entries; i++) {
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeader = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);
    offset += 46 + nameLength + extraLength + commentLength;

    if (!name.toLowerCase().endsWith(".xml")) continue;

    const dataStart =
      localHeader + 30 + buffer.readUInt16LE(localHeader + 26) + buffer.readUInt16LE(localHeader + 28);
    const data = buffer.subarray(dataStart, dataStart + compressedSize);
    if (method === 0) return data;
    if (method === 8) return inflateRawSync(data);
    throw new Error(`Compressão ${method} não suportada no .zip.`);
  }
  throw new Error("Nenhum .xml dentro do .zip.");
}

// O Lattes exporta em ISO-8859-1; o cabeçalho diz qual é a codificação
function decodeXml(bytes) {
  const header = bytes.subarray(0, 200).toString("latin1");
  const encoding = /encoding="([^"]+)"/i.exec(header)?.[1]?.toLowerCase() ?? "utf-8";
  if (/^(iso-8859-1|latin-?1)$/.test(encoding)) return bytes.toString("latin1");
  return new TextDecoder(encoding).decode(bytes);
}

/* ---------------------------------------------------------------------
   Leitor de XML (só tags e atributos, que é o que o Lattes usa)
   --------------------------------------------------------------------- */

const ENTIDADES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

// Alguns textos chegam com a entidade escapada duas vezes ("&amp;#10;")
function decodeEntities(text) {
  const once = (value) =>
    value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, code) => {
      if (code[0] !== "#") return ENTIDADES[code.toLowerCase()];
      const isHex = code[1].toLowerCase() === "x";
      return String.fromCodePoint(parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10));
    });
  return once(once(text));
}

function parseXml(xml) {
  const root = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  const tagPattern = /<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
  const attrPattern = /([\w:.-]+)\s*=\s*"([^"]*)"/g;
  let lastIndex = 0;

  for (const match of xml.matchAll(tagPattern)) {
    const [, closing, tag, rawAttrs, selfClosing] = match;
    // Texto entre as tags (ex.: <DISCIPLINA>Projeto de Software</DISCIPLINA>)
    const text = xml.slice(lastIndex, match.index).trim();
    if (text) stack.at(-1).text = decodeEntities(text);
    lastIndex = match.index + match[0].length;

    if (closing) {
      stack.pop();
      continue;
    }
    const attrs = {};
    for (const [, name, value] of rawAttrs.matchAll(attrPattern)) {
      attrs[name] = decodeEntities(value).trim();
    }
    const node = { tag, attrs, children: [] };
    stack.at(-1).children.push(node);
    if (!selfClosing) stack.push(node);
  }
  return root;
}

const child = (node, tag) => node?.children.find((c) => c.tag === tag);
const children = (node, tag) => node?.children.filter((c) => c.tag === tag) ?? [];
const findAll = (node, tag, found = []) => {
  for (const c of node.children) {
    if (c.tag === tag) found.push(c);
    findAll(c, tag, found);
  }
  return found;
};

/* ---------------------------------------------------------------------
   Normalização
   --------------------------------------------------------------------- */

// O XML sai em ISO-8859-1, que não tem aspas curvas nem travessão: o Lattes
// troca esses caracteres por "?" na exportação ("O “Partiu!” é..." vira
// "O ?Partiu!? é..."). Em português, "?" nunca vem depois de espaço, então:
//   " ?texto? " → " “texto” "   e   " ? " → " – "
const restoreLostCharacters = (text) =>
  text
    .replace(/(^|[\s([])\?([^\s?](?:[^?]*?[^\s?])?)\?(?=$|[\s.,;:!)\]])/g, "$1“$2”")
    .replace(/ \? /g, " – ");

const clean = (text = "") => restoreLostCharacters(text.replace(/\s+/g, " ").trim());
const year = (text) => Number.parseInt(text, 10) || null;
const instituicao = (nome) => INSTITUICOES[clean(nome)] ?? (clean(nome) || null);

// "Ciência da Computação" → "ciencia_da_computacao" (chave do i18n)
const slug = (text) =>
  clean(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

// "Java, Dart" / "HTML, CSS e JavaScript" → ["Java", "Dart"] / ["HTML", "CSS", "JavaScript"]
const tecnologias = (text) =>
  clean(text)
    .split(/\s*,\s*|\s+e\s+/)
    .map(clean)
    .filter(Boolean)
    .map((tech) => TECNOLOGIAS[tech.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? tech);

// "Ana Souza e Bruno Lima" → ["Ana Souza", "Bruno Lima"]. Só separa no " e "
// quando os dois lados têm nome e sobrenome, para não partir "Fulano e Silva".
const pessoas = (text) => {
  const parts = clean(text).split(/\s+e\s+/);
  const isFullName = (part) => part.split(" ").length >= 2;
  return parts.length > 1 && parts.every(isFullName) ? parts : [clean(text)].filter(Boolean);
};

const autoresDe = (node, ownerId) =>
  children(node, "AUTORES")
    .sort((a, b) => a.attrs["ORDEM-DE-AUTORIA"] - b.attrs["ORDEM-DE-AUTORIA"])
    .filter((a) => a.attrs["NRO-ID-CNPQ"] !== ownerId)
    .map((a) => clean(a.attrs["NOME-COMPLETO-DO-AUTOR"]));

// Finalidade do software → descrição. Um link no fim do texto ("... períodos.
// https://icei.pucminas.br/...") vira o link do projeto. Algumas fichas têm
// só "Sistema" na finalidade: aí não vale mostrar.
const descricaoDe = (detail) => {
  const finalidade = clean(detail.FINALIDADE);
  const url = /\s*(https?:\/\/\S+)$/.exec(finalidade);
  const descricao = url ? finalidade.slice(0, url.index).trim() : finalidade;
  return { descricao: descricao.length >= 20 ? descricao : null, url: url?.[1] ?? null };
};

// "29092026" → "2026-09-29"
const isoDate = (ddmmyyyy = "") =>
  /^\d{8}$/.test(ddmmyyyy)
    ? `${ddmmyyyy.slice(4)}-${ddmmyyyy.slice(2, 4)}-${ddmmyyyy.slice(0, 2)}`
    : null;

const linkOf = (homePage, doi) => {
  if (homePage) return /^https?:\/\//.test(homePage) ? homePage : `https://${homePage}`;
  if (doi) return `https://doi.org/${doi}`;
  return null;
};

// Ordem: ano mais recente primeiro, depois alfabética
const byYearThenTitle = (key) => (a, b) =>
  (b.ano ?? 0) - (a.ano ?? 0) || a[key].localeCompare(b[key], "pt-BR");

/* ---------------------------------------------------------------------
   Seções do currículo
   --------------------------------------------------------------------- */

function extractTccs(cv) {
  return findAll(cv, "OUTRAS-ORIENTACOES-CONCLUIDAS")
    .map((node) => {
      const basic = child(node, "DADOS-BASICOS-DE-OUTRAS-ORIENTACOES-CONCLUIDAS")?.attrs ?? {};
      const detail = child(node, "DETALHAMENTO-DE-OUTRAS-ORIENTACOES-CONCLUIDAS")?.attrs ?? {};
      if (basic.NATUREZA !== "TRABALHO_DE_CONCLUSAO_DE_CURSO_GRADUACAO") return null;
      return {
        ano: year(basic.ANO),
        titulo: clean(basic.TITULO),
        alunos: pessoas(detail["NOME-DO-ORIENTADO"]),
        instituicao: instituicao(detail["NOME-DA-INSTITUICAO"]),
        curso: clean(detail["NOME-DO-CURSO"]) || null,
        cursoId: slug(detail["NOME-DO-CURSO"]) || null,
        link: linkOf(basic["HOME-PAGE"], basic.DOI),
      };
    })
    .filter(Boolean)
    .sort(byYearThenTitle("titulo"));
}

// O software não diz o curso, mas as atividades de ensino dizem: a disciplina
// "Trabalho Interdisciplinar II: Front-End" aparece em Ciência da Computação.
// Devolve { "trabalho_interdisciplinar_ii_front_end": "Ciência da Computação", ... }
function cursosDasDisciplinas(cv) {
  const cursos = {};
  for (const ensino of findAll(cv, "ENSINO")) {
    const curso = clean(ensino.attrs["NOME-CURSO"]);
    if (!curso) continue;
    for (const disciplina of children(ensino, "DISCIPLINA")) {
      cursos[slug(disciplina.text ?? "")] = curso;
    }
  }
  return cursos;
}

function extractInterdisciplinares(cv, ownerId) {
  const cursos = cursosDasDisciplinas(cv);
  return findAll(cv, "SOFTWARE")
    .map((node) => {
      const basic = child(node, "DADOS-BASICOS-DO-SOFTWARE")?.attrs ?? {};
      const detail = child(node, "DETALHAMENTO-DO-SOFTWARE")?.attrs ?? {};
      const match = TRABALHO_INTERDISCIPLINAR.exec(clean(basic["TITULO-DO-SOFTWARE"]));
      if (!match) return null;

      const [, nome, numero, disciplina, local] = match;
      const curso = cursos[slug(`Trabalho Interdisciplinar ${numero} ${disciplina}`)] ?? null;
      return {
        ano: year(basic.ANO),
        nome: clean(nome),
        disciplina: { numero, nome: clean(disciplina), id: slug(disciplina) },
        instituicao: instituicao(local),
        curso,
        cursoId: curso ? slug(curso) : null,
        descricao: descricaoDe(detail).descricao,
        tecnologias: tecnologias(detail.PLATAFORMA),
        autores: autoresDe(node, ownerId),
        link: linkOf(basic["HOME-PAGE-DO-TRABALHO"], basic.DOI) ?? descricaoDe(detail).url,
      };
    })
    .filter(Boolean)
    .sort(byYearThenTitle("nome"));
}

function extractAgencia(cv, ownerId) {
  return findAll(cv, "SOFTWARE")
    .map((node) => {
      const basic = child(node, "DADOS-BASICOS-DO-SOFTWARE")?.attrs ?? {};
      const detail = child(node, "DETALHAMENTO-DO-SOFTWARE")?.attrs ?? {};
      const match = AGENCIA_EXPERIMENTAL.exec(clean(basic["TITULO-DO-SOFTWARE"]));
      if (!match) return null;

      const [, nome, parceiro, local] = match;
      return {
        ano: year(basic.ANO),
        nome: clean(nome),
        parceiro: parceiro ? clean(parceiro) : null,
        instituicao: instituicao(local),
        descricao: descricaoDe(detail).descricao,
        tecnologias: tecnologias(detail.PLATAFORMA),
        autores: autoresDe(node, ownerId),
        link: linkOf(basic["HOME-PAGE-DO-TRABALHO"], basic.DOI) ?? descricaoDe(detail).url,
      };
    })
    .filter(Boolean)
    .sort(byYearThenTitle("nome"));
}

function extractBancas(cv, ownerId) {
  const group = findAll(cv, "PARTICIPACAO-EM-BANCA-TRABALHOS-CONCLUSAO")[0];
  if (!group) return [];

  return group.children
    .filter((node) => NIVEIS_BANCA[node.tag])
    .map((node) => {
      const suffix = node.tag.replace("PARTICIPACAO-EM-", "");
      const basic = child(node, `DADOS-BASICOS-DA-PARTICIPACAO-EM-${suffix}`)?.attrs ?? {};
      const detail = child(node, `DETALHAMENTO-DA-PARTICIPACAO-EM-${suffix}`)?.attrs ?? {};
      return {
        nivel: NIVEIS_BANCA[node.tag],
        ano: year(basic.ANO),
        titulo: clean(basic.TITULO),
        candidato: clean(detail["NOME-DO-CANDIDATO"]),
        instituicao: instituicao(detail["NOME-INSTITUICAO"]),
        curso: clean(detail["NOME-CURSO"]) || null,
        cursoId: slug(detail["NOME-CURSO"]) || null,
        banca: children(node, "PARTICIPANTE-BANCA")
          .sort((a, b) => a.attrs["ORDEM-PARTICIPANTE"] - b.attrs["ORDEM-PARTICIPANTE"])
          .filter((p) => p.attrs["NRO-ID-CNPQ"] !== ownerId)
          .map((p) => clean(p.attrs["NOME-COMPLETO-DO-PARTICIPANTE-DA-BANCA"])),
        link: linkOf(basic["HOME-PAGE"], basic.DOI),
      };
    })
    .sort(byYearThenTitle("titulo"));
}

// Páginas do PDF: conta os objetos /Type /Page. Se o PDF guardar os objetos
// comprimidos (object streams), a contagem dá 0 e o card não mostra páginas.
function pdfInfo(path) {
  if (!existsSync(path)) return null;
  const bytes = readFileSync(path);
  const pages = bytes.toString("latin1").match(/\/Type\s*\/Page(?![\w])/g)?.length ?? 0;
  return { arquivo: "/lattes.pdf", bytes: statSync(path).size, paginas: pages || null };
}

/* ---------------------------------------------------------------------
   Execução
   --------------------------------------------------------------------- */

function main() {
  const [xmlPath, pdfPath] = process.argv.slice(2);
  if (!xmlPath) {
    console.error("Uso: npm run lattes -- <CV_xxx.zip | xxx.xml> [curriculo-lattes.pdf]");
    process.exit(1);
  }

  const raw = readFileSync(resolve(xmlPath));
  const bytes = extname(xmlPath).toLowerCase() === ".zip" ? readXmlFromZip(raw) : raw;
  const cv = child(parseXml(decodeXml(Buffer.from(bytes))), "CURRICULO-VITAE");
  if (!cv) throw new Error("Este arquivo não parece uma exportação XML do Lattes.");

  const id = cv.attrs["NUMERO-IDENTIFICADOR"];
  const gerais = child(cv, "DADOS-GERAIS")?.attrs ?? {};

  if (pdfPath) copyFileSync(resolve(pdfPath), OUTPUT_PDF);

  const info = {
    id,
    nome: clean(gerais["NOME-COMPLETO"]),
    url: `http://lattes.cnpq.br/${id}`,
    orcid: gerais["ORCID-ID"] || null,
    atualizadoEm: isoDate(cv.attrs["DATA-ATUALIZACAO"]),
    pdf: pdfInfo(OUTPUT_PDF),
  };
  const tccs = extractTccs(cv);
  const interdisciplinares = extractInterdisciplinares(cv, id);
  const agencia = extractAgencia(cv, id);
  const bancas = extractBancas(cv, id);

  // Um item por linha: o diff de uma atualização mostra só o que mudou
  const list = (items) => `[\n${items.map((item) => `  ${JSON.stringify(item)},`).join("\n")}\n]`;
  const file = `// Gerado por scripts/lattes.mjs a partir da exportação XML do Lattes.
// Não edite à mão: para atualizar, rode de novo
//   npm run lattes -- <CV_xxx.zip> [curriculo-lattes.pdf]
// Só entram dados públicos do currículo (nada de CPF, RG ou endereço).

export const lattesInfo = ${JSON.stringify(info, null, 2)};

// Orientações concluídas de trabalho de conclusão de curso (graduação)
export const tccs = ${list(tccs)};

// Softwares cadastrados como "Nome (Trabalho Interdisciplinar N: Disciplina - Instituição)"
export const interdisciplinares = ${list(interdisciplinares)};

// Softwares cadastrados como "Nome ([Parceiro e] Agência Experimental de Software - Instituição)"
export const agencia = ${list(agencia)};

// Participação em bancas de trabalhos de conclusão
export const bancas = ${list(bancas)};
`;
  writeFileSync(OUTPUT_DATA, file);

  console.log(`Lattes ${id} (atualizado em ${info.atualizadoEm})`);
  console.log(`  ${tccs.length} TCCs orientados`);
  console.log(`  ${interdisciplinares.length} trabalhos interdisciplinares`);
  console.log(`  ${agencia.length} projetos da Agência Experimental de Software`);
  console.log(`  ${bancas.length} bancas`);
  console.log(info.pdf ? `  PDF: public/lattes.pdf (${info.pdf.paginas ?? "?"} páginas)` : "  PDF: nenhum em public/lattes.pdf");
  console.log("→ src/data/lattesData.js");
}

try {
  main();
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}
