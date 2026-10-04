import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  FiActivity,
  FiAward,
  FiBriefcase,
  FiEye,
  FiGitCommit,
  FiGitPullRequest,
  FiMapPin,
  FiMoon,
  FiStar,
  FiSun,
  FiSunrise,
  FiSunset,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { GoFlame, GoIssueOpened, GoRepo, GoRepoForked } from "react-icons/go";
import GITHUB_STATS_CONFIG from "../config/gitHubStatsConfig";
import {
  SECTIONS,
  SECTION_OPTIONS,
  DEFAULT_SECTION,
  ALL_SECTIONS,
} from "../data/gitHubStatsSections";
import { languageStyle, OTHERS_STYLE } from "../data/wakaTimeLanguages";
import {
  profileSource,
  languagesSource,
  countsSource,
  commitClockSource,
  contributionsSource,
  profileViewsSource,
  repoViewsSource,
  GitHubRateLimitError,
} from "../lib/githubStats";
import { formatPercent, formatDate } from "../lib/wakatime";
import {
  isLastTerminalOutput,
  scrollLastCommandToTop,
} from "../terminal/terminalDom";
import SkinsFooter from "./SkinsFooter";
import "./GitHubStats.css";

const { USERNAME, PROFILE_URL, LIMITS } = GITHUB_STATS_CONFIG;

/* =====================================================================
   Dados, formatação e estados compartilhados pelos grupos
   ===================================================================== */

// Avisa o painel quando uma fonte termina de carregar (ver GitHubStats)
const LoadedContext = createContext(() => {});

// Busca uma vez por visita; se já veio, o gráfico abre sem "carregando"
function useSource(source) {
  const onLoaded = useContext(LoadedContext);
  const [state, setState] = useState(() => {
    const data = source.peek();
    return data ? { status: "ready", data } : { status: "loading" };
  });
  const [progress, setProgress] = useState(() => source.progress());

  useEffect(() => {
    if (source.peek()) return;
    let active = true;
    const unsubscribe = source.subscribe((value) => active && setProgress(value));
    source
      .load()
      .then((data) => {
        if (!active) return;
        setState({ status: "ready", data });
        onLoaded();
      })
      .catch((error) => {
        if (!active) return;
        const limit = error instanceof GitHubRateLimitError;
        setState({ status: limit ? "limit" : "error" });
      });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [source, onLoaded]);

  return { ...state, progress };
}

// Números, datas e horas no idioma atual (troca junto com a bandeira)
function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  return useMemo(() => {
    const number = new Intl.NumberFormat(locale);
    // Mesma precisão do views-counter, que abrevia com 2 casas ("1.23K")
    const compact = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 2,
    });
    const dayMonth = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
    const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
    const hour12 = new Intl.DateTimeFormat(locale, { hour: "numeric", timeZone: "UTC" });
    const isPt = locale.startsWith("pt");
    const noon = (key) => new Date(`${key}T12:00:00Z`);
    // 4 jan 2026 foi um domingo: índice 0 = domingo
    const weekdayDate = (index) => new Date(Date.UTC(2026, 0, 4 + index, 12));
    const strip = (text) => text.replace(/\.$/, "");

    return {
      number: (value) => number.format(Math.round(value)),
      compact: (value) => compact.format(value),
      percent: (value) => formatPercent(value, locale),
      date: (key) => (key ? formatDate(key, locale) : ""),
      dayMonth: (key) => (key ? dayMonth.format(noon(key)) : ""),
      month: (key) => strip(month.format(noon(key))),
      weekday: (index) => strip(weekday.format(weekdayDate(index))),
      weekdayLong: (index) => weekdayLong.format(weekdayDate(index)),
      // 20 → "20h" (pt) / "8 PM" (en)
      hour: (h) =>
        isPt ? `${h}h` : hour12.format(new Date(Date.UTC(2000, 0, 1, h))),
      bytes: (value) => {
        const units = ["byte", "kilobyte", "megabyte", "gigabyte"];
        let index = 0;
        while (value >= 1000 && index < units.length - 1) {
          value /= 1000;
          index++;
        }
        return new Intl.NumberFormat(locale, {
          style: "unit",
          unit: units[index],
          unitDisplay: "short",
          maximumFractionDigits: 1,
        }).format(value);
      },
    };
  }, [locale]);
}

// Carregando / limite da API / erro, no lugar do gráfico
function Status({ status, progress }) {
  const { t } = useTranslation();
  return (
    <div className={`ghs-status ${status}`} role="status">
      <p>
        {t(`stats.status.${status}`)}
        {status === "loading" && progress && (
          <span className="ghs-status-progress">
            {" "}
            · {t("stats.progresso", { done: progress.done, total: progress.total })}
          </span>
        )}
      </p>
      {status === "loading" && progress && (
        <span
          className="ghs-progress"
          style={{ "--p": `${(progress.done / progress.total) * 100}%` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Se a API mandar algo num formato inesperado, o erro fica só no grupo.
// Sem isso, um erro de renderização derruba o terminal inteiro (tela vazia).
class SectionErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("GitHub stats:", error);
  }

  render() {
    return this.state.failed ? <Status status="error" /> : this.props.children;
  }
}

// Variáveis CSS de cada linguagem: cor do logo e degradê (mesmo mapa do WakaTime)
const langVars = (style, index, extra = {}) => ({
  "--lang": style.color,
  "--lang-from": style.gradient[0],
  "--lang-to": style.gradient[1],
  ...(style.color.startsWith("var(") && { "--lang-ink": style.color }),
  "--i": index,
  ...extra,
});

// Índice do maior valor (o primeiro, em caso de empate)
const indexOfMax = (values) =>
  values.reduce((best, value, index) => (value > values[best] ? index : best), 0);

/* =====================================================================
   Colunas (contribuições por ano, commits por hora)
   ===================================================================== */

// O maior valor fica destacado e com o número em cima. Passar o mouse, tocar
// ou usar ← → (com o gráfico focado) mostra o valor de cada coluna na linha
// de leitura; a tabela escondida leva os mesmos valores ao leitor de tela.
function Columns({ items, value, readout, axis, cap, caption, className = "" }) {
  const [active, setActive] = useState(null);
  const values = items.map(value);
  const max = Math.max(...values, 0) || 1;
  const peak = indexOfMax(values);
  const shown = active ?? peak;

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    setActive((current) =>
      Math.min(items.length - 1, Math.max(0, (current ?? peak) + step))
    );
  };

  return (
    <figure className={`ghs-cols ${className}`}>
      <figcaption className="ghs-readout" aria-hidden="true">
        {readout(items[shown], shown)}
      </figcaption>
      <div
        className="ghs-cols-plot"
        role="img"
        aria-label={caption}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        style={{ "--n": items.length }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={[
              "ghs-col",
              index === peak && "pico",
              index === shown && "ativo",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ "--h": `${(values[index] / max) * 100}%`, "--i": index }}
            onPointerEnter={() => setActive(index)}
            onPointerDown={() => setActive(index)}
          >
            {index === peak && <span className="ghs-col-cap">{cap(item)}</span>}
            <span className="ghs-col-bar" />
          </div>
        ))}
      </div>
      <div className="ghs-cols-axis" aria-hidden="true" style={{ "--n": items.length }}>
        {items.map((item, index) => (
          <span key={index}>{axis(item, index)}</span>
        ))}
      </div>
      <table className="ghs-sr">
        <caption>{caption}</caption>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{readout(item, index)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/* =====================================================================
   stats / stats --resumo: perfil + indicadores
   ===================================================================== */

function Perfil({ user }) {
  const { t } = useTranslation();
  const meta = [
    user.company && { key: "company", icon: FiBriefcase, text: user.company },
    user.location && { key: "location", icon: FiMapPin, text: user.location },
    user.createdAt && {
      key: "since",
      icon: GoRepo,
      text: t("stats.perfil.desde", { ano: user.createdAt.slice(0, 4) }),
    },
  ].filter(Boolean);

  return (
    <div className="ghs-perfil">
      <img
        className="ghs-avatar"
        src={`${user.avatarUrl}${user.avatarUrl.includes("?") ? "&" : "?"}s=128`}
        alt=""
        width="56"
        height="56"
        loading="lazy"
      />
      <div className="ghs-perfil-texto">
        <p className="ghs-perfil-nome">
          {user.name}{" "}
          <a href={user.url} target="_blank" rel="noopener noreferrer">
            @{user.login}
          </a>
        </p>
        {user.bio && <p className="ghs-perfil-bio">{user.bio}</p>}
        {meta.length > 0 && (
          <p className="ghs-perfil-meta">
            {meta.map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.key}>
                  <Icon aria-hidden="true" />
                  {item.text}
                </span>
              );
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function Kpi({ tile, index }) {
  const { t } = useTranslation();
  const { state } = tile;
  const Icon = tile.icon;
  const ready = state.status === "ready";

  return (
    <li
      className={`ghs-kpi ${state.status}`}
      style={{ "--i": index, "--tone": `var(--${tile.tone})` }}
    >
      <span className="ghs-kpi-label">
        <Icon aria-hidden="true" />
        {t(`stats.indicadores.${tile.key}`)}
      </span>
      <span className="ghs-kpi-value">
        {ready ? tile.value(state.data) : state.status === "loading" ? "…" : "—"}
      </span>
      <span className="ghs-kpi-note">
        {ready
          ? tile.note(state.data)
          : state.status === "loading"
            ? " "
            : t(`stats.status.curto.${state.status}`)}
      </span>
    </li>
  );
}

function Resumo({ f }) {
  const { t } = useTranslation();
  const profile = useSource(profileSource);
  const counts = useSource(countsSource);
  const contributions = useSource(contributionsSource);
  const visits = useSource(profileViewsSource);
  const days = (count) => t("stats.dias", { count, valor: f.number(count) });

  const tiles = [
    {
      key: "contribuicoes",
      icon: FiActivity,
      tone: "accent",
      state: contributions,
      value: (c) => f.number(c.total),
      note: (c) => t("stats.notas.desde", { ano: c.firstDate?.slice(0, 4) ?? "" }),
    },
    {
      key: "commits",
      icon: FiGitCommit,
      tone: "info",
      state: counts,
      value: (c) => f.number(c.commits),
      note: () => t("stats.notas.ultimos12"),
    },
    {
      key: "pullRequests",
      icon: FiGitPullRequest,
      tone: "accent",
      state: counts,
      value: (c) => f.number(c.pullRequests),
      note: () => t("stats.notas.total"),
    },
    {
      key: "issues",
      icon: GoIssueOpened,
      tone: "success",
      state: counts,
      value: (c) => f.number(c.issues),
      note: () => t("stats.notas.total"),
    },
    {
      key: "estrelas",
      icon: FiStar,
      tone: "icon-school",
      state: profile,
      value: (p) => f.number(p.stars),
      note: (p) => t("stats.notas.emRepos", { count: p.repos.length }),
    },
    {
      key: "forks",
      icon: GoRepoForked,
      tone: "info",
      state: profile,
      value: (p) => f.number(p.forks),
      note: (p) => t("stats.notas.emRepos", { count: p.repos.length }),
    },
    {
      key: "seguidores",
      icon: FiUsers,
      tone: "icon-mail-puc",
      state: profile,
      value: (p) => f.number(p.user.followers),
      note: (p) => t("stats.notas.seguindo", { valor: f.number(p.user.following) }),
    },
    {
      key: "repositorios",
      icon: GoRepo,
      tone: "accent",
      state: profile,
      value: (p) => f.number(p.repos.length),
      note: () => t("stats.notas.publicos"),
    },
    {
      key: "sequenciaAtual",
      icon: GoFlame,
      tone: "icon-work",
      state: contributions,
      value: (c) => days(c.currentStreak.length),
      note: (c) =>
        c.currentStreak.length
          ? t("stats.notas.desdeData", { data: f.dayMonth(c.currentStreak.start) })
          : t("stats.notas.semSequencia"),
    },
    {
      key: "maiorSequencia",
      icon: FiAward,
      tone: "highlight",
      state: contributions,
      value: (c) => days(c.longestStreak.length),
      note: (c) =>
        c.longestStreak.length
          ? `${f.dayMonth(c.longestStreak.start)} – ${f.date(c.longestStreak.end)}`
          : "",
    },
    {
      key: "melhorDia",
      icon: FiZap,
      tone: "icon-school",
      state: contributions,
      value: (c) => f.number(c.bestDay?.count ?? 0),
      note: (c) => (c.bestDay ? f.date(c.bestDay.date) : ""),
    },
    {
      key: "visitas",
      icon: FiEye,
      tone: "icon-mail-puc",
      state: visits,
      value: (views) => f.number(views),
      note: () => t("stats.notas.visitas"),
    },
  ];

  return (
    <>
      {profile.status === "ready" && <Perfil user={profile.data.user} />}
      <ul className="ghs-kpis">
        {tiles.map((tile, index) => (
          <Kpi key={tile.key} tile={tile} index={index} />
        ))}
      </ul>
    </>
  );
}

/* =====================================================================
   stats --linguagens: fatia de cada linguagem + anéis com o logo
   ===================================================================== */

// Primeiros `limit` itens + uma linha "+ N linguagens" com a soma do resto
function foldRest(items, limit, label) {
  const top = items.slice(0, limit);
  const rest = items.slice(limit);
  if (rest.length === 0) return top;
  return [
    ...top,
    {
      name: label(rest.length),
      value: rest.reduce((sum, item) => sum + item.value, 0),
      percent: rest.reduce((sum, item) => sum + item.percent, 0),
      isRest: true,
    },
  ];
}

const STACK_SEGMENTS = 7;

function LangCard({ item, index, amount, f }) {
  const gradientId = useId();
  const style = item.isRest ? OTHERS_STYLE : languageStyle(item.name);
  const Icon = style.icon;

  return (
    <li className={item.isRest ? "ghs-lang resto" : "ghs-lang"} style={langVars(style, index)}>
      <div
        className="ghs-ring"
        role="img"
        aria-label={`${item.name}: ${f.percent(item.percent)} (${amount(item)})`}
      >
        <svg className="ghs-ring-svg" viewBox="0 0 80 80" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: style.gradient[0] }} />
              <stop offset="100%" style={{ stopColor: style.gradient[1] }} />
            </linearGradient>
          </defs>
          <circle className="ghs-ring-track" cx="40" cy="40" r="34" />
          <circle
            className="ghs-ring-fill"
            cx="40"
            cy="40"
            r="34"
            pathLength="100"
            stroke={`url(#${gradientId})`}
            style={{ "--offset": 100 - item.percent }}
          />
        </svg>
        <Icon className="ghs-ring-icon" aria-hidden="true" />
      </div>
      <span className="ghs-name" title={item.name}>
        {item.name}
      </span>
      <span className="ghs-lang-pct">{f.percent(item.percent)}</span>
      <span className="ghs-lang-amount">{amount(item)}</span>
    </li>
  );
}

function Linguagens({ f }) {
  const { t } = useTranslation();
  const langs = useSource(languagesSource);
  const profile = useSource(profileSource);
  if (langs.status !== "ready") {
    return <Status status={langs.status} progress={langs.progress} />;
  }

  const { items, unit, total } = langs.data;
  const moreLabel = (count) => t("stats.linguagens.outras", { count });
  const cards = foldRest(items, LIMITS.languages, moreLabel);
  const segments = foldRest(items, STACK_SEGMENTS, moreLabel);
  const repoCount = profile.data?.repos.length ?? 0;
  const amount = (item) =>
    unit === "bytes"
      ? f.bytes(item.value)
      : t("stats.linguagens.repos", { count: item.value });

  return (
    <>
      <p className="ghs-resumo">
        <Trans
          i18nKey={unit === "bytes" ? "stats.linguagens.porBytes" : "stats.linguagens.porRepos"}
          values={{ total: unit === "bytes" ? f.bytes(total) : total, repos: repoCount }}
          components={{ b: <strong /> }}
        />
      </p>

      {/* Barra única dividida por linguagem; os cards abaixo trazem os mesmos valores */}
      <div className="ghs-stack" aria-hidden="true">
        {segments.map((item, index) => {
          const style = item.isRest ? OTHERS_STYLE : languageStyle(item.name);
          return (
            <span
              key={item.name}
              className="ghs-stack-seg"
              style={langVars(style, index, { flexGrow: item.value })}
              title={`${item.name} · ${f.percent(item.percent)} · ${amount(item)}`}
            />
          );
        })}
      </div>

      <ul className="ghs-langs">
        {cards.map((item, index) => (
          <LangCard key={item.name} item={item} index={index} amount={amount} f={f} />
        ))}
      </ul>
    </>
  );
}

/* =====================================================================
   stats --atividade: sequências, calendário, anos e dias da semana
   ===================================================================== */

// Card no formato do github-readme-streak-stats: total | atual | maior
function Sequencias({ data, f }) {
  const { t } = useTranslation();
  const { total, firstDate, currentStreak, longestStreak, today } = data;
  const range = (streak, withYear) =>
    streak.length
      ? `${f.dayMonth(streak.start)} – ${
          streak.end === today
            ? t("stats.atividade.hoje")
            : withYear
              ? f.date(streak.end)
              : f.dayMonth(streak.end)
        }`
      : t("stats.notas.semSequencia");
  const unit = (count) => t("stats.diasUnidade", { count });

  return (
    <div className="ghs-streak">
      <div className="ghs-streak-col">
        <span className="ghs-streak-value">{f.number(total)}</span>
        <span className="ghs-streak-label">{t("stats.atividade.total")}</span>
        <span className="ghs-streak-note">
          {firstDate && `${f.date(firstDate)} – ${t("stats.atividade.hoje")}`}
        </span>
      </div>
      <div className="ghs-streak-col atual">
        <span className="ghs-streak-ring">
          <GoFlame className="ghs-streak-flame" aria-hidden="true" />
          <span className="ghs-streak-value">{f.number(currentStreak.length)}</span>
          <span className="ghs-unit">{unit(currentStreak.length)}</span>
        </span>
        <span className="ghs-streak-label">{t("stats.indicadores.sequenciaAtual")}</span>
        <span className="ghs-streak-note">{range(currentStreak, false)}</span>
      </div>
      <div className="ghs-streak-col">
        <span className="ghs-streak-value">
          {f.number(longestStreak.length)}
          <span className="ghs-unit">{unit(longestStreak.length)}</span>
        </span>
        <span className="ghs-streak-label">{t("stats.indicadores.maiorSequencia")}</span>
        <span className="ghs-streak-note">{range(longestStreak, true)}</span>
      </div>
    </div>
  );
}

// Calendário dos últimos 12 meses, como o do perfil do GitHub. Passar o mouse,
// tocar ou usar as setas (com o calendário focado) mostra o dia na linha de baixo.
function Calendario({ calendar, f }) {
  const { t } = useTranslation();
  const cells = useMemo(() => calendar.weeks.flat(), [calendar]);
  const [active, setActive] = useState(null);

  // Mês no topo da coluna em que ele começa (o primeiro some se ficar espremido)
  const months = useMemo(() => {
    const starts = [];
    calendar.weeks.forEach((week, index) => {
      const month = week[0].date.slice(0, 7);
      if (index === 0 || month !== calendar.weeks[index - 1][0].date.slice(0, 7)) {
        starts.push({ index, date: week[0].date });
      }
    });
    return starts.filter((m, i) => !starts[i + 1] || starts[i + 1].index - m.index >= 3);
  }, [calendar]);

  const best = cells.reduce((top, cell) => (cell.count > top.count ? cell : top), cells[0]);
  const describe = (cell) =>
    cell.count
      ? t("stats.atividade.celula", {
          count: cell.count,
          valor: f.number(cell.count),
          data: f.date(cell.date),
        })
      : t("stats.atividade.celulaZero", { data: f.date(cell.date) });

  const onKeyDown = (event) => {
    const step = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[event.key];
    if (!step) return;
    event.preventDefault();
    setActive((current) => {
      const next = (current ?? cells.length - 1) + step;
      return next < 0 || next >= cells.length ? current ?? cells.length - 1 : next;
    });
  };

  const pick = (event) => {
    const index = event.target.dataset?.index;
    if (index !== undefined) setActive(Number(index));
  };

  return (
    <figure className="ghs-cal">
      <div className="ghs-cal-head">
        <p className="ghs-resumo">
          <Trans
            i18nKey="stats.atividade.calendario"
            values={{ valor: f.number(calendar.total) }}
            components={{ b: <strong /> }}
          />
        </p>
        <span className="ghs-cal-legend" aria-hidden="true">
          {t("stats.atividade.menos")}
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className="ghs-cell" data-level={level} />
          ))}
          {t("stats.atividade.mais")}
        </span>
      </div>

      <div className="ghs-cal-body">
        <div className="ghs-cal-months" aria-hidden="true">
          {months.map((m) => (
            <span key={m.date} style={{ gridColumn: `${m.index + 1} / span 3` }}>
              {f.month(m.date)}
            </span>
          ))}
        </div>
        <div className="ghs-cal-days" aria-hidden="true">
          {[1, 3, 5].map((day) => (
            <span key={day} style={{ gridRow: day + 1 }}>
              {f.weekday(day)}
            </span>
          ))}
        </div>
        <div
          className="ghs-cal-grid"
          role="img"
          aria-label={`${t("stats.atividade.calendario", {
            valor: f.number(calendar.total),
          }).replace(/<\/?b>/g, "")}. ${t("stats.atividade.melhorDoPeriodo", {
            texto: describe(best),
          })}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerOver={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
        >
          {cells.map((cell, index) => (
            <span
              key={cell.date}
              className={index === active ? "ghs-cell ativo" : "ghs-cell"}
              data-level={cell.level}
              data-index={index}
            />
          ))}
        </div>
      </div>

      <figcaption className="ghs-readout" aria-hidden="true">
        {active !== null
          ? describe(cells[active])
          : best.count > 0 && t("stats.atividade.melhorDoPeriodo", { texto: describe(best) })}
      </figcaption>
    </figure>
  );
}

function PorAno({ years, today, f }) {
  const { t } = useTranslation();
  const currentYear = Number(today.slice(0, 4));
  const readout = (item) =>
    `${item.year} · ${t("stats.atividade.contribuicoes", {
      count: item.total,
      valor: f.number(item.total),
    })}${item.year === currentYear ? ` (${t("stats.atividade.ateHoje")})` : ""}`;

  return (
    <div className="ghs-bloco">
      <h5 className="ghs-bloco-titulo">{t("stats.atividade.porAno")}</h5>
      <Columns
        className="anos"
        items={years}
        value={(item) => item.total}
        readout={readout}
        axis={(item) => item.year}
        cap={(item) => f.number(item.total)}
        caption={t("stats.atividade.porAno")}
      />
    </div>
  );
}

function PorDiaDaSemana({ weekdays, f }) {
  const { t } = useTranslation();
  const total = weekdays.reduce((sum, value) => sum + value, 0) || 1;
  const max = Math.max(...weekdays) || 1;
  const peak = indexOfMax(weekdays);
  // Segunda primeiro, domingo no fim
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="ghs-bloco">
      <h5 className="ghs-bloco-titulo">{t("stats.atividade.porDia")}</h5>
      <ul className="ghs-semana">
        {order.map((day, index) => (
          <li
            key={day}
            className={day === peak ? "ghs-dia pico" : "ghs-dia"}
            style={{ "--rel": `${(weekdays[day] / max) * 100}%`, "--i": index }}
            title={`${f.weekdayLong(day)} · ${f.number(weekdays[day])} · ${f.percent(
              (weekdays[day] / total) * 100
            )}`}
          >
            <span className="ghs-dia-nome">{f.weekday(day)}</span>
            <span className="ghs-dia-trilho" aria-hidden="true">
              <span className="ghs-dia-barra" />
            </span>
            <span className="ghs-dia-valor">{f.number(weekdays[day])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Atividade({ f }) {
  const contributions = useSource(contributionsSource);
  if (contributions.status !== "ready") return <Status status={contributions.status} />;
  const { data } = contributions;

  return (
    <>
      <Sequencias data={data} f={f} />
      <Calendario calendar={data.calendar} f={f} />
      <div className="ghs-duo">
        <PorAno years={data.years} today={data.today} f={f} />
        <PorDiaDaSemana weekdays={data.weekdays} f={f} />
      </div>
    </>
  );
}

/* =====================================================================
   stats --horarios: commits por hora do dia e por período
   ===================================================================== */

const PERIOD_STYLE = {
  madrugada: { icon: FiMoon, tone: "info" },
  manha: { icon: FiSunrise, tone: "icon-school" },
  tarde: { icon: FiSun, tone: "icon-work" },
  noite: { icon: FiSunset, tone: "highlight" },
};

function Horarios({ f }) {
  const { t } = useTranslation();
  const clock = useSource(commitClockSource);
  if (clock.status !== "ready") return <Status status={clock.status} />;

  const { hours, periods, peakHour, sampled, total } = clock.data;
  if (peakHour === null) return <p className="ghs-resumo">{t("stats.horarios.vazio")}</p>;

  const topPeriod = periods[indexOfMax(periods.map((p) => p.percent))];
  const span = (from, to) => `${f.hour(from)}–${f.hour(to)}`;
  const readout = (item, hour) =>
    t("stats.horarios.leitura", {
      faixa: span(hour, (hour + 1) % 24),
      percent: f.percent(item.percent),
      valor: f.number(item.estimate),
    });

  return (
    <>
      <p className="ghs-resumo">
        <Trans
          i18nKey="stats.horarios.resumo"
          values={{
            hora: f.hour(peakHour),
            percent: f.percent(topPeriod.percent),
            quando: t(`stats.horarios.quando.${topPeriod.key}`),
          }}
          components={{ b: <strong /> }}
        />
      </p>

      <Columns
        className="horas"
        items={hours}
        value={(item) => item.percent}
        readout={readout}
        axis={(item, hour) => (hour % 3 === 0 ? f.hour(hour) : "")}
        cap={(item) => f.percent(item.percent)}
        caption={t("stats.horarios.legenda")}
      />

      <ul className="ghs-periodos">
        {periods.map((period, index) => {
          const { icon: Icon, tone } = PERIOD_STYLE[period.key];
          return (
            <li
              key={period.key}
              className={period === topPeriod ? "ghs-periodo pico" : "ghs-periodo"}
              style={{ "--tone": `var(--${tone})`, "--p": `${period.percent}%`, "--i": index }}
            >
              <Icon className="ghs-periodo-icon" aria-hidden="true" />
              <span className="ghs-periodo-nome">
                {t(`stats.horarios.periodos.${period.key}`)}
              </span>
              <span className="ghs-periodo-faixa">{span(period.from, (period.to + 1) % 24)}</span>
              <span className="ghs-periodo-pct">{f.percent(period.percent)}</span>
              <span className="ghs-periodo-trilho" aria-hidden="true">
                <span className="ghs-periodo-barra" />
              </span>
            </li>
          );
        })}
      </ul>

      <p className="ghs-nota">
        {t("stats.horarios.nota", { amostra: f.number(sampled), total: f.number(total) })}
      </p>
    </>
  );
}

/* =====================================================================
   stats --repos: ranking de visitas (views-counter) de cada repositório
   ===================================================================== */

// Repositório sem linguagem (só material de aula, PDFs...): ícone de repo
const REPO_STYLE = {
  icon: GoRepo,
  color: "var(--text-muted)",
  gradient: ["var(--text-dim)", "var(--text-muted)"],
};

function Repos({ f }) {
  const { t } = useTranslation();
  const views = useSource(repoViewsSource);
  if (views.status !== "ready") {
    return <Status status={views.status} progress={views.progress} />;
  }

  const { items, total, counted, approximate } = views.data;
  const max = items[0]?.views?.value || 1;
  const viewsLabel = (v) => (v.approximate ? f.compact(v.value) : f.number(v.value));

  return (
    <>
      <p className="ghs-resumo">
        <Trans
          i18nKey="stats.repos.resumo"
          values={{
            valor: `${approximate ? "≈ " : ""}${f.number(total)}`,
            count: counted,
          }}
          components={{ b: <strong /> }}
        />
      </p>

      <ol className="ghs-repos">
        {items.map((repo, index) => {
          const style = repo.language ? languageStyle(repo.language) : REPO_STYLE;
          const Icon = style.icon;
          return (
            <li
              key={repo.name}
              className={repo.views ? "ghs-repo" : "ghs-repo sem-dados"}
              style={langVars(style, index, {
                "--rel": `${((repo.views?.value ?? 0) / max) * 100}%`,
              })}
            >
              <span className="ghs-repo-rank">{index + 1}</span>
              <span
                className="ghs-tile"
                title={repo.language ?? t("stats.repos.semLinguagem")}
                aria-hidden="true"
              >
                <Icon />
              </span>
              <div className="ghs-repo-body">
                <div className="ghs-repo-head">
                  <a
                    className="ghs-name"
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={repo.description || repo.name}
                  >
                    {repo.name}
                  </a>
                  <span className="ghs-repo-meta">
                    <span title={t("stats.indicadores.estrelas")}>
                      <FiStar aria-hidden="true" /> {f.number(repo.stars)}
                    </span>
                    <span title={t("stats.indicadores.forks")}>
                      <GoRepoForked aria-hidden="true" /> {f.number(repo.forks)}
                    </span>
                  </span>
                  <span className="ghs-repo-views">
                    {repo.views ? viewsLabel(repo.views) : "—"}
                  </span>
                </div>
                <div className="ghs-bar" aria-hidden="true" />
              </div>
            </li>
          );
        })}
      </ol>

      <p className="ghs-nota">{t("stats.repos.nota")}</p>
    </>
  );
}

/* =====================================================================
   Moldura: título, grupos escolhidos e rodapé "Gráficos:"
   ===================================================================== */

const SECTION_VIEWS = {
  resumo: Resumo,
  linguagens: Linguagens,
  atividade: Atividade,
  horarios: Horarios,
  repos: Repos,
};

export default function GitHubStats({ section = DEFAULT_SECTION }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const panelRef = useRef(null);
  const sections = section === ALL_SECTIONS ? SECTIONS : [section];

  // Os dados chegam depois do comando e a saída cresce: se ela ainda é a
  // última do terminal, leva o comando de volta para o topo
  const onLoaded = useCallback(() => {
    if (isLastTerminalOutput(panelRef.current)) scrollLastCommandToTop();
  }, []);

  return (
    <LoadedContext.Provider value={onLoaded}>
      <div className="ghs-painel" ref={panelRef}>
        <h3 className="ghs-titulo">{t("stats.titulo")}</h3>
        <p className="ghs-subtitulo">
          <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
            github.com/{USERNAME}
          </a>
        </p>

        {sections.map((key) => {
          const View = SECTION_VIEWS[key];
          return (
            <section key={key} className="ghs-secao">
              {sections.length > 1 && (
                <h4 className="ghs-secao-titulo">{t(`stats.secoes.${key}`)}</h4>
              )}
              <SectionErrorBoundary>
                <View f={f} />
              </SectionErrorBoundary>
            </section>
          );
        })}

        <SkinsFooter skins={SECTION_OPTIONS} active={section} namespace="stats" />
      </div>
    </LoadedContext.Provider>
  );
}
