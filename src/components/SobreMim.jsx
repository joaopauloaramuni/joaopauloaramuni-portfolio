import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { TypeAnimation } from "react-type-animation";
import { FaChalkboardTeacher, FaCode, FaRocket, FaUserGraduate } from "react-icons/fa";
import { GiCrossedSwords, GiDragonHead, GiGuitar } from "react-icons/gi";
import {
  IoAirplaneOutline,
  IoBasketballOutline,
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoFootballOutline,
  IoGameControllerOutline,
  IoLocationOutline,
  IoSchoolOutline,
  IoStarOutline,
  IoTvOutline,
} from "react-icons/io5";
import { TbCake, TbCertificate, TbZodiacSagittarius } from "react-icons/tb";
import { GITHUB } from "../data/docenciaData";
import { INSTITUICOES, ITENS, PRIMEIRO_ANO, corStyle, useDocencia } from "../lib/docencia";
import {
  AES,
  BANCAS,
  COMANDO_EN,
  DEV_DESDE,
  GALO_URL,
  NASCIMENTO,
  TCCS_ORIENTADOS,
  TRABALHOS_FINAIS,
  assistindo,
  clientes,
  continentes,
  formacao,
  hobbies,
  hoje,
  serieFavorita,
  trajetoria,
  vejaTambem,
  vivencia,
} from "../data/sobreData";
import "./SobreMim.css";

// A cor de cada bloco vem de um token do theme.css, passada como --serie
// (o mesmo nome usado no lattes): a cor marca o bloco (borda, ícone, ponto),
// os textos ficam sempre nos tokens de texto.
const serie = (token) => ({ "--serie": `var(${token})` });

const ANO_ATUAL = new Date().getFullYear();
const ANOS_DEV = ANO_ATUAL - DEV_DESDE;
const ANOS_ENSINO = ANO_ATUAL - PRIMEIRO_ANO;

// Idade de hoje: um ano a menos enquanto o aniversário deste ano não chegou
const IDADE = (() => {
  const data = new Date();
  const { ano, mes, dia } = NASCIMENTO;
  const mesAtual = data.getMonth() + 1;
  const jaFez = mesAtual > mes || (mesAtual === mes && data.getDate() >= dia);
  return data.getFullYear() - ano - (jaFez ? 0 : 1);
})();

// Empresas da coluna "profissão" (a IN8 aparece duas vezes, conta uma)
const EMPRESAS = new Set(trajetoria.profissao.map((item) => item.logo)).size;

// Semestre de referência para "agora": o semestre atual ou, se o
// docenciaData ainda não tiver disciplinas nele, o último cadastrado
const SEMESTRE_ATUAL = (() => {
  const data = new Date();
  return `${data.getFullYear()}.${data.getMonth() < 6 ? 1 : 2}`;
})();
const SEMESTRES = [...new Set(ITENS.flatMap((item) => item.semestres ?? []))].sort();
const SEMESTRE_REF = SEMESTRES.includes(SEMESTRE_ATUAL)
  ? SEMESTRE_ATUAL
  : SEMESTRES.filter((s) => s <= SEMESTRE_ATUAL).pop();
const ehAgora = (item) => Boolean(item.semestres?.includes(SEMESTRE_REF));

// Disciplinas por instituição: as deste semestre primeiro, depois da mais
// recente para a mais antiga
const DISCIPLINAS = INSTITUICOES.map((instituicao) => ({
  ...instituicao,
  itens: instituicao.itens
    .map((item) => ({ ...item, agora: ehAgora(item) }))
    .sort((a, b) => b.agora - a.agora || b.fim - a.fim || a.ordem - b.ordem),
}));
const DISCIPLINAS_AGORA_PUC = DISCIPLINAS.find((inst) => inst.id === "puc").itens.filter(
  (item) => item.agora,
).length;

const LUGARES = continentes.reduce((total, c) => total + c.lugares.length, 0);

const HOBBY_ICONES = {
  mu: GiCrossedSwords,
  tibia: GiDragonHead,
  basquete: IoBasketballOutline,
  violao: GiGuitar,
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Link({ href, className, children, ...rest }) {
  // Sem endereço (ex.: Álamo TI): texto comum, sem o sublinhado de link
  if (!href) {
    const semLink = className
      ?.split(" ")
      .filter((nome) => !nome.startsWith("sobre-link"))
      .join(" ");
    return <span className={semLink || undefined}>{children}</span>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  );
}

// "$ lattes --tccs": dica do comando que aprofunda o bloco, como no lattes.
// Quebra só entre as palavras, nunca no meio delas.
function Cmd({ children, className = "" }) {
  const partes = children.split(" ");
  return (
    <code className={`sobre-cmd ${className}`}>
      {partes.map((parte, i) => (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span>{parte}</span>
        </React.Fragment>
      ))}
    </code>
  );
}

function Secao({ titulo, cmd, children }) {
  return (
    <section className="sobre-secao">
      <h4 className="sobre-secao-titulo">
        <span>{titulo}</span>
        {cmd && <Cmd>{cmd}</Cmd>}
      </h4>
      {children}
    </section>
  );
}

/* ---------- Cabeçalho ---------- */

// "programador por profissão, professor por vocação", digitado. O texto
// completo fica invisível na mesma célula do grid: a altura não pula.
function Lema() {
  const { t, i18n } = useTranslation();
  const [estatico] = useState(prefersReducedMotion);
  const parte1 = t("sobre.lema_1");
  const completo = `${parte1} ${t("sobre.lema_2")}`;

  return (
    <p className="sobre-lema">
      <span className="sobre-lema-reserva" aria-hidden="true">
        {"// "}
        {completo}
      </span>
      {estatico ? (
        <span className="sobre-lema-texto">
          {"// "}
          {completo}
        </span>
      ) : (
        <>
          <span className="sobre-sr">{completo}</span>
          <TypeAnimation
            key={i18n.language}
            sequence={[`// ${parte1}`, 700, `// ${completo}`]}
            wrapper="span"
            cursor
            repeat={0}
            speed={60}
            className="sobre-lema-texto"
            aria-hidden="true"
          />
        </>
      )}
    </p>
  );
}

function Cabecalho() {
  const { t } = useTranslation();
  return (
    <header className="sobre-cabecalho">
      <img
        src="/avatar.jpeg"
        alt={t("sobre.avatar_alt")}
        className="sobre-avatar"
        width="132"
        height="132"
      />
      <div className="sobre-identidade">
        <h3 className="sobre-nome">{t("sobre.nome")}</h3>
        <p className="sobre-cargo">{t("sobre.cargo")}</p>
        <Lema />
        <ul className="sobre-chips">
          <li style={serie("--icon-book")}>
            <TbCake aria-hidden="true" />
            {t("sobre.idade", { count: IDADE })}
          </li>
          <li style={serie("--icon-location")}>
            <IoLocationOutline aria-hidden="true" />
            {t("sobre.local")}
          </li>
          <li style={serie("--info")}>
            <TbZodiacSagittarius aria-hidden="true" />
            {t("sobre.signo")}
          </li>
        </ul>
      </div>
    </header>
  );
}

/* ---------- Números ---------- */

function Numeros({ comando }) {
  const { t } = useTranslation();
  const cards = [
    {
      id: "dev",
      cor: "--icon-work",
      Icon: IoBriefcaseOutline,
      valor: t("sobre.kpi.anos", { count: ANOS_DEV }),
      detalhe: t("sobre.kpi.dev_detalhe", { count: EMPRESAS }),
      cmd: comando("experiencias"),
    },
    {
      id: "ensino",
      cor: "--icon-school",
      Icon: IoSchoolOutline,
      valor: t("sobre.kpi.anos", { count: ANOS_ENSINO }),
      detalhe: t("sobre.kpi.ensino_detalhe", {
        ano: PRIMEIRO_ANO,
        count: INSTITUICOES.length,
      }),
      cmd: `lattes --${t("lattes.skins.docencia")}`,
    },
    {
      id: "tccs",
      cor: "--lattes-tccs",
      Icon: FaUserGraduate,
      valor: TCCS_ORIENTADOS,
      detalhe: t("sobre.kpi.tccs_detalhe", { count: BANCAS }),
      cmd: `lattes --${t("lattes.skins.tccs")}`,
    },
    {
      id: "aes",
      cor: "--lattes-aes",
      Icon: FaRocket,
      valor: AES.times,
      detalhe: t("sobre.kpi.aes_detalhe", { count: AES.pessoas }),
      cmd: `lattes --${t("lattes.skins.aes")}`,
    },
  ];

  return (
    <ul className="sobre-kpis">
      {cards.map((card) => {
        const { id, cor, valor, detalhe, cmd } = card;
        const Icon = card.Icon;
        return (
          <li key={id} className="sobre-kpi" style={serie(cor)}>
            <Icon className="sobre-kpi-icone" aria-hidden="true" />
            <span className="sobre-kpi-valor">{valor}</span>
            <span className="sobre-kpi-rotulo">{t(`sobre.kpi.${id}_rotulo`)}</span>
            <span className="sobre-kpi-detalhe">{detalhe}</span>
            <Cmd>{cmd}</Cmd>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Hoje ---------- */

// Logo da organização ou, sem logo, um ícone na cor do bloco
function Marca({ logo, cor, alt, icone }) {
  const Icone = icone ?? FaRocket;
  if (logo) {
    return (
      <img src={logo} alt={alt} className="sobre-logo" loading="lazy" width="40" height="40" />
    );
  }
  return (
    <span className="sobre-logo sobre-logo-icone" style={serie(cor)} aria-hidden="true">
      <Icone />
    </span>
  );
}

function Hoje() {
  const { t } = useTranslation();
  const semestre = SEMESTRE_REF?.replace(".", "/");

  return (
    <ul className="sobre-hoje">
      {hoje.map((item) => (
        <li key={item.id} className="sobre-hoje-item">
          <Marca logo={item.logo} cor={item.cor} alt={t(`sobre.hoje.${item.id}.org`)} />
          <div className="sobre-hoje-texto">
            <p className="sobre-hoje-cargo">
              {t(`sobre.hoje.${item.id}.cargo`)}{" "}
              <span className="sobre-hoje-em">{t("sobre.hoje.em")}</span>{" "}
              <Link href={item.url} className="sobre-link-forte">
                {t(`sobre.hoje.${item.id}.org`)}
              </Link>
            </p>
            <p className="sobre-hoje-detalhe">{t(`sobre.hoje.${item.id}.detalhe`)}</p>
            {item.id === "puc" && DISCIPLINAS_AGORA_PUC > 0 && (
              <p className="sobre-hoje-extra">
                <span className="sobre-ponto-agora" aria-hidden="true" />
                {t("sobre.hoje.disciplinas_agora", { count: DISCIPLINAS_AGORA_PUC, semestre })}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Profissão e vocação ---------- */

// "2020 – 2023", "2023", "2024 – hoje" ou, com meses, "mar – out 2020"
function Periodo({ inicio, fim, meses }) {
  const { t, i18n } = useTranslation();
  if (meses) {
    const formato = new Intl.DateTimeFormat(i18n.language.startsWith("en") ? "en-US" : "pt-BR", {
      month: "short",
    });
    const mes = (numero) => formato.format(new Date(inicio, numero - 1, 1)).replace(".", "");
    return (
      <>
        {mes(meses[0])} – {mes(meses[1])} {inicio}
      </>
    );
  }
  if (fim === inicio) return <>{inicio}</>;
  return (
    <>
      {inicio} – {fim ?? t("sobre.trajetoria.hoje")}
    </>
  );
}

function Trajetoria() {
  const { t } = useTranslation();
  const colunas = [
    { id: "profissao", Icon: FaCode, cor: "--icon-work" },
    { id: "vocacao", Icon: FaChalkboardTeacher, cor: "--icon-school" },
  ];

  return (
    <div className="sobre-trajetoria">
      {colunas.map((coluna) => {
        const { id, cor } = coluna;
        const Icon = coluna.Icon;
        return (
          <div key={id} className="sobre-coluna" style={serie(cor)}>
            <p className="sobre-coluna-titulo">
              <Icon aria-hidden="true" />
              {t(`sobre.trajetoria.${id}`)}
            </p>
            <ol className="sobre-linha">
              {trajetoria[id].map((item) => (
                <li
                  key={item.id}
                  className={item.fim === null ? "sobre-marco sobre-marco-atual" : "sobre-marco"}
                >
                  <img
                    src={item.logo}
                    alt=""
                    className="sobre-marco-logo"
                    loading="lazy"
                    width="28"
                    height="28"
                  />
                  <div className="sobre-marco-texto">
                    <span className="sobre-marco-periodo">
                      <Periodo inicio={item.inicio} fim={item.fim} meses={item.meses} />
                    </span>
                    <span className="sobre-marco-cargo">
                      {t(`sobre.trajetoria.${item.id}.cargo`)} ·{" "}
                      <Link href={item.url} className="sobre-link">
                        {t(`sobre.trajetoria.${item.id}.org`)}
                      </Link>
                    </span>
                    <span className="sobre-marco-detalhe">
                      {t(`sobre.trajetoria.${item.id}.detalhe`)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Formação ---------- */

function Trabalho({ trabalho }) {
  const { t } = useTranslation();
  return (
    <div className="sobre-trabalho">
      <span className="sobre-trabalho-tipo">
        <IoDocumentTextOutline aria-hidden="true" />
        {t(`sobre.formacao.tipos.${trabalho.tipo}`)}
      </span>
      <Link href={trabalho.url} className="sobre-link sobre-trabalho-titulo" lang="pt-BR">
        “{trabalho.titulo}”
      </Link>
      <span className="sobre-trabalho-orientador">
        {t("sobre.formacao.orientador")}{" "}
        <Link href={trabalho.orientador.url} className="sobre-link">
          {trabalho.orientador.nome}
        </Link>
      </span>
    </div>
  );
}

function Formacao() {
  const { t } = useTranslation();
  return (
    <>
      <p className="sobre-intro sobre-formacao-intro">
        <Trans
          i18nKey="sobre.formacao.intro"
          components={{ repo: <Link href={TRABALHOS_FINAIS} className="sobre-link" /> }}
        />
      </p>
      <ul className="sobre-formacao">
        {formacao.map((item) => (
          <li key={item.id} className="sobre-diploma">
            <Marca
              logo={item.logo}
              cor={item.cor}
              alt={t(`sobre.formacao.${item.id}.org`)}
              icone={TbCertificate}
            />
            <div className="sobre-diploma-texto">
              <span className="sobre-marco-periodo">
                <Periodo inicio={item.inicio} fim={item.fim} />
              </span>
              <span className="sobre-diploma-nivel">{t(`sobre.formacao.${item.id}.nivel`)}</span>
              <span className="sobre-diploma-curso">{t(`sobre.formacao.${item.id}.curso`)}</span>
              <Link href={item.url} className="sobre-link sobre-diploma-org">
                {t(`sobre.formacao.${item.id}.org`)}
              </Link>
              {item.modulos && (
                <span className="sobre-lista-ponto sobre-diploma-modulos">
                  {item.modulos.map((modulo) => (
                    <span key={modulo}>{t(`sobre.formacao.${item.id}.modulos.${modulo}`)}</span>
                  ))}
                </span>
              )}
              {item.trabalho && <Trabalho trabalho={item.trabalho} />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------- Disciplinas ---------- */

function Disciplinas() {
  const { t } = useTranslation();
  const f = useDocencia();

  return (
    <>
      <p className="sobre-intro">
        <Trans
          i18nKey="sobre.disciplinas.intro"
          values={{ count: ITENS.length, instituicoes: INSTITUICOES.length }}
          components={{ b: <strong /> }}
        />
      </p>
      <p className="sobre-legenda">
        <span className="sobre-ponto-agora" aria-hidden="true" />
        {t("sobre.disciplinas.agora", { semestre: SEMESTRE_REF?.replace(".", "/") })}
      </p>
      <div className="sobre-disciplinas">
        {DISCIPLINAS.map((inst) => (
          <div key={inst.id} className="sobre-inst" style={corStyle(inst.id)}>
            <p className="sobre-inst-nome">
              <span className="sobre-quadrado" aria-hidden="true" />
              <strong>
                {t(`sobre.disciplinas.siglas.${inst.id}`, { defaultValue: inst.sigla })}
              </strong>
              <span className="sobre-inst-conta">
                {t("sobre.disciplinas.contagem", { count: inst.itens.length })}
              </span>
            </p>
            <ul className="sobre-tags">
              {inst.itens.map((item) => {
                const nome = f.disciplina(item);
                const dica = `${f.cursos(item)} · ${f.periodo(item.mesesSet, inst.porMes)}`;
                const classe = item.agora ? "sobre-tag sobre-tag-agora" : "sobre-tag";
                return (
                  <li key={item.key}>
                    {item.repo ? (
                      <Link href={`${GITHUB}/${item.repo}`} className={classe} title={dica}>
                        {item.agora && <span className="sobre-ponto-agora" aria-hidden="true" />}
                        {nome}
                      </Link>
                    ) : (
                      <span className={classe} title={dica}>
                        {nome}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Vivência e clientes ---------- */

function Vivencia() {
  const { t } = useTranslation();
  return (
    <ul className="sobre-tags">
      {vivencia.map(({ id, url }) => (
        <li key={id}>
          {url ? (
            <Link href={url} className="sobre-tag">
              {t(`sobre.vivencia.${id}`)}
            </Link>
          ) : (
            <span className="sobre-tag">{t(`sobre.vivencia.${id}`)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Clientes() {
  const { t } = useTranslation();
  return (
    <ul className="sobre-tags">
      {clientes.map(({ id, url }) => (
        <li key={id}>
          <Link
            href={url}
            className="sobre-tag"
            title={t(`sobre.clientes.${id}.desc`, { defaultValue: "" }) || undefined}
          >
            {t(`sobre.clientes.${id}.nome`)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Fora do terminal ---------- */

function Pessoal() {
  const { t } = useTranslation();
  const linhas = [
    {
      id: "time",
      Icon: IoFootballOutline,
      cor: "--icon-github", // preto e branco, nos dois temas
      valor: (
        <>
          <Trans
            i18nKey="sobre.pessoal.time"
            components={{ galo: <Link href={GALO_URL} className="sobre-link" /> }}
          />{" "}
          <Cmd className="sobre-cmd-inline">neofetch</Cmd>
        </>
      ),
    },
    {
      id: "hobbies",
      Icon: IoGameControllerOutline,
      cor: "--highlight",
      valor: (
        <>
          <span>
            {hobbies.map(({ id, url }) => {
              const Icon = HOBBY_ICONES[id];
              const conteudo = (
                <>
                  <Icon aria-hidden="true" />
                  {t(`sobre.pessoal.hobbies.${id}`)}
                </>
              );
              return url ? (
                <Link key={id} href={url} className="sobre-link sobre-hobby">
                  {conteudo}
                </Link>
              ) : (
                <span key={id} className="sobre-hobby">
                  {conteudo}
                </span>
              );
            })}
          </span>
          <Cmd className="sobre-cmd-inline">game</Cmd>
        </>
      ),
    },
    {
      id: "serie",
      Icon: IoStarOutline,
      cor: "--warn",
      valor: (
        <Link href={serieFavorita.url} className="sobre-link sobre-link-forte">
          {serieFavorita.nome}
        </Link>
      ),
    },
    {
      id: "assistindo",
      Icon: IoTvOutline,
      cor: "--icon-book",
      valor: (
        <span className="sobre-lista-ponto">
          {assistindo.map(({ nome, url }) => (
            <Link key={nome} href={url} className="sobre-link">
              {nome}
            </Link>
          ))}
        </span>
      ),
    },
  ];

  return (
    <dl className="sobre-kv">
      {linhas.map((linha) => {
        const { id, cor, valor } = linha;
        const Icon = linha.Icon;
        return (
          <div key={id} className="sobre-kv-linha" style={serie(cor)}>
            <dt>
              <Icon aria-hidden="true" />
              {t(`sobre.pessoal.rotulos.${id}`)}
            </dt>
            <dd>{valor}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function Passaporte() {
  const { t } = useTranslation();
  return (
    <div className="sobre-passaporte">
      <p className="sobre-passaporte-titulo">
        <IoAirplaneOutline aria-hidden="true" />
        <span>{t("sobre.pessoal.passaporte")}</span>
        <span className="sobre-passaporte-total">
          {t("sobre.pessoal.passaporte_total", {
            lugares: LUGARES,
            continentes: continentes.length,
          })}
        </span>
      </p>

      {/* Uma faixa por continente, do tamanho da quantidade de lugares */}
      <div className="sobre-faixa" aria-hidden="true">
        {continentes.map((c) => (
          <span
            key={c.id}
            className="sobre-faixa-seg"
            style={{ ...serie(c.cor), flexGrow: c.lugares.length }}
            title={`${t(`sobre.pessoal.continentes.${c.id}`)} · ${c.lugares.length}`}
          />
        ))}
      </div>

      <div className="sobre-continentes">
        {continentes.map((c) => (
          <div key={c.id} className="sobre-continente" style={serie(c.cor)}>
            <p className="sobre-continente-nome">
              <span className="sobre-quadrado" aria-hidden="true" />
              {t(`sobre.pessoal.continentes.${c.id}`)}
              <span className="sobre-inst-conta">{c.lugares.length}</span>
            </p>
            <ul className="sobre-carimbos">
              {c.lugares.map((lugar) => {
                const Bandeira = lugar.Bandeira;
                return (
                  <li key={lugar.id} className="sobre-carimbo" title={lugar.sigla}>
                    <Bandeira className="sobre-bandeira" aria-hidden="true" />
                    {t(`sobre.pessoal.lugares.${lugar.id}`)}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Página ---------- */

const SobreMim = () => {
  const { t, i18n } = useTranslation();
  const ingles = i18n.language.startsWith("en");
  const comando = (nome) => (ingles ? (COMANDO_EN[nome] ?? nome) : nome);
  const b = { b: <strong /> };

  return (
    <article className="sobre-painel">
      <Cabecalho />

      <div className="sobre-bio">
        <p>
          <Trans i18nKey="sobre.bio_1" components={b} />
        </p>
        <p>
          <Trans
            i18nKey="sobre.bio_2"
            values={{ dev: ANOS_DEV, ensino: ANOS_ENSINO }}
            components={b}
          />
        </p>
      </div>

      <Numeros comando={comando} />

      <Secao titulo={t("sobre.secoes.hoje")}>
        <Hoje />
      </Secao>

      <Secao titulo={t("sobre.secoes.trajetoria")} cmd={comando("experiencias")}>
        <Trajetoria />
      </Secao>

      <Secao titulo={t("sobre.secoes.formacao")} cmd={comando("curriculo")}>
        <Formacao />
      </Secao>

      <Secao titulo={t("sobre.secoes.disciplinas")} cmd={`lattes --${t("lattes.skins.docencia")}`}>
        <Disciplinas />
      </Secao>

      <Secao titulo={t("sobre.secoes.vivencia")} cmd={comando("habilidades")}>
        <Vivencia />
      </Secao>

      <Secao titulo={t("sobre.secoes.clientes")} cmd={comando("projetos")}>
        <Clientes />
      </Secao>

      <Secao titulo={t("sobre.secoes.pessoal")}>
        <Pessoal />
        <Passaporte />
      </Secao>

      <nav className="sobre-rodape" aria-label={t("sobre.veja_tambem")}>
        <span className="sobre-rodape-rotulo">{t("sobre.veja_tambem")}</span>
        {vejaTambem.map((nome) => (
          <code key={nome}>{comando(nome)}</code>
        ))}
      </nav>
    </article>
  );
};

export default SobreMim;
