import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { FiActivity, FiCalendar, FiClock, FiCode } from "react-icons/fi";
import WAKATIME_CONFIG from "../config/wakaTimeConfig";
import { SKINS, DEFAULT_SKIN } from "../data/wakaTimeSkins";
import {
  languageStyle,
  OTHERS_STYLE,
  TRANSLATED_NAMES,
} from "../data/wakaTimeLanguages";
import {
  fetchWakaTimeStats,
  getCachedWakaTimeStats,
  WakaTimePendingError,
  splitTop,
  formatDuration,
  formatPercent,
  formatDate,
} from "../lib/wakatime";
import { useCodando, useRelogio, haQuanto } from "../lib/codando";
import useCommandAtTop from "../terminal/useCommandAtTop";
import useOnScreen from "../terminal/useOnScreen";
import { useTheme } from "../theme/themeContext";
import { toHex } from "../theme/colorUtils";
import SkinsFooter from "./SkinsFooter";
import "./WakaTime.css";

const { USERNAME, LIMITS, PROFILE_URL } = WAKATIME_CONFIG;

/* =====================================================================
   wakatime --cards: os dois cards de imagem (helio-github-stats)
   ===================================================================== */

// Cores do card → token do theme.css. A imagem é gerada no servidor do
// helio-github-stats, então não enxerga var(--token): lemos o valor de cada
// token no tema atual e mandamos como hex na URL (sem o "#").
const CARD_COLORS = {
  bg_color: "--surface",
  title_color: "--accent",
  text_color: "--text",
  icon_color: "--accent",
  border_color: "--border",
};

const readCardColors = (element) => {
  const style = getComputedStyle(element);
  return Object.entries(CARD_COLORS)
    .map(([param, token]) => {
      const hex = toHex(style.getPropertyValue(token).trim());
      return hex ? `&${param}=${hex.slice(1)}` : "";
    })
    .join("");
};

const cardUrl = (layout, langsCount, colors) =>
  `https://helio-github-stats.vercel.app/api/wakatime?username=${USERNAME}` +
  `&custom_title=WakaTime+Stats&card_width=466&line_height=25&layout=${layout}` +
  `&display_format=time&disable_animations=false&langs_count=${langsCount}` +
  `&border_radius=10${colors}`;

function WakaTimeCards() {
  const { theme } = useTheme();
  const probe = useRef(null);
  const [colors, setColors] = useState(null);

  // Lê as cores antes da primeira pintura (a imagem já nasce no tema certo)
  // e de novo a cada "tema claro/escuro": os cards trocam junto com o site
  useLayoutEffect(() => {
    setColors(readCardColors(probe.current));
  }, [theme]);

  return (
    <div className="wakatime-container">
      {/* Sonda invisível com o tema atual, só para ler os tokens (como no design) */}
      <span
        ref={probe}
        data-theme={theme}
        className="wakatime-probe"
        aria-hidden="true"
      />
      <div className="wakatime-cards">
        {/* Lado a lado no desktop; um embaixo do outro quando não couber */}
        <div className="wakatime-cards-imgs">
          {colors !== null && (
            <>
              <img
                src={cardUrl("compact", 22, colors)}
                alt="WakaTime Stats"
                width="466"
                loading="lazy"
              />
              <img
                src={cardUrl("default", 12, colors)}
                alt="WakaTime Stats"
                width="466"
                loading="lazy"
              />
            </>
          )}
        </div>
        <SkinsFooter skins={SKINS} active="cards" namespace="wakatime" />
      </div>
    </div>
  );
}

/* =====================================================================
   Dados e formatação compartilhados pelos estilos desenhados aqui
   ===================================================================== */

// Busca uma vez por visita; se já veio, o estilo abre sem "carregando"
function useWakaTimeStats() {
  const [state, setState] = useState(() => {
    const data = getCachedWakaTimeStats();
    return data ? { status: "ready", data } : { status: "loading" };
  });

  useEffect(() => {
    if (getCachedWakaTimeStats()) return;
    let active = true;
    fetchWakaTimeStats()
      .then((data) => active && setState({ status: "ready", data }))
      .catch((error) => {
        if (!active) return;
        const pending = error instanceof WakaTimePendingError;
        setState({ status: pending ? "pending" : "error" });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

// Números, datas e nomes no idioma atual (troca junto com a bandeira)
function useFormatters() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  return useMemo(
    () => ({
      duration: formatDuration,
      percent: (value) => formatPercent(value, locale),
      date: (value) => (value ? formatDate(value, locale) : null),
      number: (value) => new Intl.NumberFormat(locale).format(value),
      name: (name) =>
        TRANSLATED_NAMES[name]
          ? t(`wakatime.nomes.${TRANSLATED_NAMES[name]}`)
          : name,
    }),
    [locale, t]
  );
}

// Variáveis CSS de cada item: cor do logo, degradê e posição na lista.
// Cores de token (var(--...)) já seguem o tema e não são escurecidas no light.
const itemStyle = (style, index, extra = {}) => ({
  "--lang": style.color,
  "--lang-from": style.gradient[0],
  "--lang-to": style.gradient[1],
  ...(style.color.startsWith("var(") && { "--lang-ink": style.color }),
  "--i": index,
  ...extra,
});

// Editores, categorias e sistemas usam uma cor só: a de destaque do tema
const ACCENT_STYLE = {
  color: "var(--accent)",
  gradient: ["var(--accent-hover)", "var(--accent)"],
};

// Linha que soma o que passou do limite ("+ 22 linguagens")
const restItem = (rest, label) => ({
  name: label,
  seconds: rest.seconds,
  percent: rest.percent,
  isRest: true,
});

/* =====================================================================
   wakatime --grade: indicadores + cards com anel de progresso
   ===================================================================== */
function Indicadores({ data, f }) {
  const { t } = useTranslation();
  const topEditor = data.editors[0];
  const items = [
    {
      key: "total",
      icon: FiClock,
      value: f.duration(data.totalSeconds),
      note: t("wakatime.notas.total", { count: data.languages.length }),
    },
    {
      key: "mediaDiaria",
      icon: FiActivity,
      value: f.duration(data.dailyAverage),
      note: t("wakatime.notas.mediaDiaria"),
    },
    data.activeDays != null && {
      key: "diasAtivos",
      icon: FiCalendar,
      value: f.number(data.activeDays),
      note:
        data.totalDays != null &&
        t("wakatime.notas.diasAtivos", { total: f.number(data.totalDays) }),
    },
    topEditor && {
      key: "editorPrincipal",
      icon: FiCode,
      value: topEditor.name,
      note: t("wakatime.notas.editorPrincipal", {
        percent: f.percent(topEditor.percent),
      }),
    },
  ].filter(Boolean);

  return (
    <ul className="waka-kpis">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <li key={item.key} className="waka-kpi" style={{ "--i": index }}>
            <span className="waka-kpi-label">
              <Icon aria-hidden="true" />
              {t(`wakatime.indicadores.${item.key}`)}
            </span>
            <span className="waka-kpi-value">{item.value}</span>
            <span className="waka-kpi-note">{item.note}</span>
          </li>
        );
      })}
    </ul>
  );
}

function GradeCard({ lang, index, f }) {
  const gradientId = useId();
  const style = languageStyle(lang.name);
  const Icon = style.icon;
  const name = f.name(lang.name);

  return (
    <li className="waka-card" style={itemStyle(style, index)}>
      <div
        className="waka-ring"
        role="img"
        aria-label={`${name}: ${f.duration(lang.seconds)}, ${f.percent(lang.percent)}`}
      >
        <svg className="waka-ring-svg" viewBox="0 0 80 80" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: style.gradient[0] }} />
              <stop offset="100%" style={{ stopColor: style.gradient[1] }} />
            </linearGradient>
          </defs>
          <circle className="waka-ring-track" cx="40" cy="40" r="34" />
          <circle
            className="waka-ring-fill"
            cx="40"
            cy="40"
            r="34"
            pathLength="100"
            stroke={`url(#${gradientId})`}
            style={{ "--offset": 100 - lang.percent }}
          />
        </svg>
        <Icon className="waka-ring-icon" aria-hidden="true" />
      </div>

      <span className="waka-name" title={name}>
        {name}
      </span>
      <span className="waka-card-time">{f.duration(lang.seconds)}</span>
      <span className="waka-card-pct">{f.percent(lang.percent)}</span>
    </li>
  );
}

function GradeSkin({ data, f }) {
  const { top } = splitTop(data.languages, LIMITS.grade);
  return (
    <>
      <Indicadores data={data} f={f} />
      <ul className="waka-grid">
        {top.map((lang, index) => (
          <GradeCard key={lang.name} lang={lang} index={index} f={f} />
        ))}
      </ul>
    </>
  );
}

/* =====================================================================
   wakatime --lista: fatia de cada linguagem + ranking com barras
   ===================================================================== */

// Barra única dividida por linguagem (parte do todo). As linhas abaixo
// trazem os mesmos valores em texto, então ela fica fora do leitor de tela.
const STACK_SEGMENTS = 7;
function FatiasLinguagens({ languages, f }) {
  const { t } = useTranslation();
  const { top, rest } = splitTop(languages, STACK_SEGMENTS);
  const segments = rest
    ? [...top, restItem(rest, t("wakatime.maisLinguagens", { count: rest.count }))]
    : top;

  return (
    <div className="waka-stack" aria-hidden="true">
      {segments.map((item, index) => {
        const style = item.isRest ? OTHERS_STYLE : languageStyle(item.name);
        const name = item.isRest ? item.name : f.name(item.name);
        return (
          <span
            key={item.name}
            className="waka-stack-seg"
            style={itemStyle(style, index, { flexGrow: item.seconds })}
            title={`${name} · ${f.duration(item.seconds)} · ${f.percent(item.percent)}`}
          />
        );
      })}
    </div>
  );
}

function ListaSkin({ data, f }) {
  const { t } = useTranslation();
  const { top, rest } = splitTop(data.languages, LIMITS.lista);
  const rows = rest
    ? [...top, restItem(rest, t("wakatime.maisLinguagens", { count: rest.count }))]
    : top;
  // Barras proporcionais ao tempo, com a maior linguagem ocupando a largura toda
  const max = top[0]?.seconds || 1;

  return (
    <>
      <p className="waka-resumo">
        <Trans
          i18nKey="wakatime.resumo"
          values={{
            total: f.duration(data.totalSeconds),
            media: f.duration(data.dailyAverage),
          }}
          components={{ b: <strong /> }}
        />
      </p>

      <FatiasLinguagens languages={data.languages} f={f} />

      <ul className="waka-list">
        {rows.map((lang, index) => {
          const style = lang.isRest ? OTHERS_STYLE : languageStyle(lang.name);
          const Icon = style.icon;
          return (
            <li
              key={lang.name}
              className={lang.isRest ? "waka-row resto" : "waka-row"}
              style={itemStyle(style, index, {
                "--rel": `${(lang.seconds / max) * 100}%`,
              })}
            >
              <span className="waka-tile" aria-hidden="true">
                <Icon />
              </span>
              <div className="waka-row-body">
                <div className="waka-row-head">
                  <span className="waka-name">
                    {lang.isRest ? lang.name : f.name(lang.name)}
                  </span>
                  <span className="waka-row-time">{f.duration(lang.seconds)}</span>
                  <span className="waka-pct">{f.percent(lang.percent)}</span>
                </div>
                <div className="waka-bar" aria-hidden="true" />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* =====================================================================
   wakatime / wakatime --terminal (padrão): resumo + barras em blocos, estilo CLI
   ===================================================================== */
const SEGMENTS = 20;

function TerminalRow({ item, style, index, showIcon, f }) {
  const Icon = style.icon;
  const name = item.isRest ? item.name : f.name(item.name);
  const filled = Math.round((item.percent / 100) * SEGMENTS);

  return (
    <li
      className={item.isRest ? "waka-term-row resto" : "waka-term-row"}
      style={itemStyle(style, index)}
    >
      {showIcon ? (
        <Icon className="waka-term-icon" aria-hidden="true" />
      ) : (
        <span className="waka-term-bullet" aria-hidden="true">
          ›
        </span>
      )}
      <span className="waka-name" title={name}>
        {name}
      </span>
      <span
        className="waka-term-bar"
        role="img"
        aria-label={`${name}: ${f.percent(item.percent)}`}
      >
        {Array.from({ length: SEGMENTS }, (_, s) => (
          <span
            key={s}
            className={s < filled ? "waka-seg on" : "waka-seg"}
            style={{ "--s": s }}
          />
        ))}
      </span>
      <span className="waka-term-time">{f.duration(item.seconds)}</span>
      <span className="waka-pct">{f.percent(item.percent)}</span>
    </li>
  );
}

function TerminalSkin({ data, f }) {
  const { t } = useTranslation();
  const limits = LIMITS.terminal;

  const info = [
    ["total", f.duration(data.totalSeconds)],
    ["mediaDiaria", f.duration(data.dailyAverage)],
    data.activeDays != null && [
      "diasAtivos",
      data.totalDays != null
        ? `${f.number(data.activeDays)} / ${f.number(data.totalDays)}`
        : f.number(data.activeDays),
    ],
  ].filter(Boolean);

  const sections = [
    { key: "linguagens", items: data.languages, limit: limits.languages, icons: true },
    { key: "editores", items: data.editors, limit: limits.editors },
    { key: "categorias", items: data.categories, limit: limits.categories },
    { key: "sistemas", items: data.operatingSystems, limit: limits.operatingSystems },
  ].filter((section) => section.items.length > 0);

  return (
    <div className="waka-term">
      <dl className="waka-term-info">
        {info.map(([key, value]) => (
          <div key={key} className="waka-term-kv">
            <dt>{t(`wakatime.indicadores.${key}`)}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {/* Uma grade só para todas as seções: as barras ficam alinhadas */}
      <div className="waka-term-table">
        {sections.map(({ key, items, limit, icons }) => {
          const { top, rest } = splitTop(items, limit);
          const label = icons
            ? t("wakatime.maisLinguagens", { count: rest?.count })
            : t("wakatime.maisOutros", { count: rest?.count });
          const rows = rest ? [...top, restItem(rest, label)] : top;

          return (
            <section key={key} className="waka-term-section">
              <h4 className="waka-term-heading">{t(`wakatime.secoes.${key}`)}</h4>
              <ul className="waka-term-list">
                {rows.map((item, index) => {
                  const style = !icons
                    ? { ...ACCENT_STYLE, icon: null }
                    : item.isRest
                      ? OTHERS_STYLE
                      : languageStyle(item.name);
                  return (
                    <TerminalRow
                      key={item.name}
                      item={item}
                      style={style}
                      index={index}
                      showIcon={icons}
                      f={f}
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================================
   Moldura dos estilos com dados: título, carregando/erro e rodapé
   ===================================================================== */
const SKIN_VIEWS = {
  grade: GradeSkin,
  lista: ListaSkin,
  terminal: TerminalSkin,
};

// Se a API mandar algo num formato inesperado, o erro fica só neste painel.
// Sem isso, um erro de renderização derruba o terminal inteiro (tela vazia).
class PainelErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("WakaTime:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function WakaTimeStats({ skin }) {
  const { t } = useTranslation();
  const state = useWakaTimeStats();
  const f = useFormatters();
  const containerRef = useRef(null);
  const Skin = SKIN_VIEWS[skin];
  const since = state.data && f.date(state.data.since);
  const errorMessage = (
    <p className="wakatime-status error" role="status">
      {t("wakatime.status.error")}
    </p>
  );

  // Comando no topo, com a saída abaixo. Os dados chegam depois e a saída
  // cresce: o hook percebe e repete o ajuste (ver terminal/useCommandAtTop.js)
  useCommandAtTop(containerRef);

  return (
    <div className="wakatime-painel" ref={containerRef}>
      <h3 className="wakatime-titulo">{t("wakatime.titulo")}</h3>

      {state.status === "ready" ? (
        <PainelErrorBoundary fallback={errorMessage}>
          <p className="wakatime-subtitulo">
            {since && `${t("wakatime.desde", { data: since })} · `}
            <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              wakatime.com/@{USERNAME}
            </a>
          </p>
          <Skin data={state.data} f={f} />
        </PainelErrorBoundary>
      ) : (
        <p className={`wakatime-status ${state.status}`} role="status">
          {t(`wakatime.status.${state.status}`)}
        </p>
      )}

      <SkinsFooter skins={SKINS} active={skin} namespace="wakatime" />
    </div>
  );
}

/* =====================================================================
   wakatime --agora: em que projeto estou mexendo no editor agora
   Heartbeats do WakaTime, lidos no servidor com a chave (api/_codando.js).
   Atualiza a cada minuto enquanto está na tela.
   ===================================================================== */
function WakaTimeAgora() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const naTela = useOnScreen(containerRef);
  const estado = useCodando(naTela);
  const agora = useRelogio(naTela);
  const f = useFormatters();

  useCommandAtTop(containerRef);

  const hora = (ms) =>
    new Intl.DateTimeFormat(i18n.language, { hour: "2-digit", minute: "2-digit" }).format(ms);

  let corpo;
  if (estado.status !== "ok") {
    corpo = (
      <p
        className={`wakatime-status ${estado.status === "carregando" ? "loading" : "error"}`}
        role="status"
      >
        {t(`wakatime.agora.status.${estado.status}`)}
      </p>
    );
  } else {
    const { ativo, ultimo, hojeSegundos } = estado.dados;
    const linguagem = ultimo?.linguagem && languageStyle(ultimo.linguagem);
    const IconeLinguagem = linguagem?.icon;
    const sessaoS = ultimo ? (ultimo.em - ultimo.sessaoDesde) / 1000 : 0;

    const linhas = ultimo
      ? [
          ["projeto", ultimo.publico ? ultimo.projeto : t("wakatime.agora.privado")],
          ultimo.linguagem && [
            "linguagem",
            <span className="waka-agora-lang" key="lang">
              {IconeLinguagem && (
                <IconeLinguagem
                  aria-hidden="true"
                  style={{ color: `var(--lang-ink, ${linguagem.color})` }}
                />
              )}
              {f.name(ultimo.linguagem)}
            </span>,
          ],
          ultimo.editor && ["editor", ultimo.editor],
          ultimo.branch && ["branch", ultimo.branch],
          ativo &&
            sessaoS >= 60 && [
              "sessao",
              t("wakatime.agora.desde", {
                duracao: f.duration(sessaoS),
                hora: hora(ultimo.sessaoDesde),
              }),
            ],
          [ativo ? "ultimoSinal" : "ultimaAtividade", haQuanto(t, ultimo.em, agora)],
          ultimo.projetoHojeSegundos >= 60 && [
            "hojeProjeto",
            f.duration(ultimo.projetoHojeSegundos),
          ],
        ]
      : [];
    if (hojeSegundos >= 60) linhas.push(["hojeTotal", f.duration(hojeSegundos)]);

    corpo = (
      <div className="waka-term">
        <p className={ativo ? "waka-agora-estado ativo" : "waka-agora-estado"} role="status">
          <span className="waka-agora-dot" aria-hidden="true" />
          {t(ativo ? "wakatime.agora.ativo" : "wakatime.agora.parado")}
        </p>
        {linhas.filter(Boolean).length > 0 ? (
          <dl className="waka-term-info">
            {linhas.filter(Boolean).map(([chave, valor]) => (
              <div key={chave} className="waka-term-kv">
                <dt>{t(`wakatime.agora.campos.${chave}`)}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="waka-agora-nota">{t("wakatime.agora.nadaHoje")}</p>
        )}
        <p className="waka-agora-nota">{t("wakatime.agora.nota")}</p>
      </div>
    );
  }

  return (
    <div className="wakatime-painel" ref={containerRef}>
      <h3 className="wakatime-titulo">{t("wakatime.agora.titulo")}</h3>
      <p className="wakatime-subtitulo">
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
          wakatime.com/@{USERNAME}
        </a>
      </p>
      {corpo}
      <SkinsFooter skins={SKINS} active="agora" namespace="wakatime" />
    </div>
  );
}

export default function WakaTime({ skin = DEFAULT_SKIN }) {
  if (skin === "agora") return <WakaTimeAgora />;
  return SKIN_VIEWS[skin] ? <WakaTimeStats skin={skin} /> : <WakaTimeCards />;
}
