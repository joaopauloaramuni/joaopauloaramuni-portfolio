import React, { useLayoutEffect, useRef, useState } from "react";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { useTranslation } from "react-i18next";
import { useTheme } from "../theme/themeContext";
import { ARAMUNI_ASCII, PROMPT, TERMINAL_TITLE, WINDOW_BUTTONS } from "../data/brandData";
import {
  allTokenNames,
  breakpoints,
  dataPalettes,
  fontStack,
  radii,
  spacingScale,
  themeSummary,
  tokenGroups,
  typeScale,
} from "../data/designSystemData";
import { contrastRatio, toHex } from "../theme/colorUtils";
import AramuniLogo from "./AramuniLogo";
import "./DesignSystem.css";

const THEMES = ["dark", "light", "galo"];
const SECTIONS = ["marca", "temas", "cores", "tipografia", "medidas"];
const LIGATURES = "=> -> != === >= <= // {}";

// Lê os tokens em um elemento com data-theme="dark", "light" ou "galo". Como
// o theme.css declara as cores nesses seletores, cada sonda enxerga os
// valores de um tema, seja qual for o tema da página.
const readTokens = (element) => {
  const style = getComputedStyle(element);
  return Object.fromEntries(
    allTokenNames.map((name) => [name, style.getPropertyValue(name).trim()])
  );
};

// Texto pede 4.5:1 (AA); entre 3 e 4.5 só serve para texto grande
const contrastLevel = (ratio) => (ratio >= 4.5 ? "ok" : ratio >= 3 ? "grande" : "baixo");

function Section({ id, sectionRefs, children }) {
  const { t } = useTranslation();
  return (
    <section
      className="ds-section"
      ref={(element) => {
        sectionRefs.current[id] = element;
      }}
    >
      <h4 className="ds-section-title">
        <span className="ds-section-hash" aria-hidden="true">
          ##{" "}
        </span>
        {t(`design.secoes.${id}.titulo`)}
      </h4>
      <p className="ds-section-intro">{t(`design.secoes.${id}.intro`)}</p>
      {children}
    </section>
  );
}

// Logo + banner, como na tela de boas-vindas. No galo, o escudo entra no
// lugar da logo.
function Lockup({ theme }) {
  const { t } = useTranslation();
  return (
    <div className="ds-lockup">
      {theme === "galo" ? (
        <img
          src="/galo/escudo-cam.webp"
          alt={t("boasvindas.escudo_alt")}
          className="ds-lockup-logo ds-lockup-escudo"
          width="480"
          height="714"
          loading="lazy"
        />
      ) : (
        <AramuniLogo className="ds-lockup-logo" title="Aramuni" />
      )}
      <pre className="ds-ascii" aria-hidden="true">
        {ARAMUNI_ASCII}
      </pre>
    </div>
  );
}

// Célula de um token em um tema: amostra, hex e, em texto, o contraste
function TokenCell({ token, theme, values }) {
  const { t } = useTranslation();
  const themeValues = values?.[theme];
  const value = themeValues?.[token.name] ?? "";
  const hex = toHex(value);

  let contrast = null;
  if (token.kind === "text" && themeValues && hex) {
    const background = toHex(themeValues[token.on ?? "--bg-terminal"]);
    if (background) {
      const ratio = contrastRatio(hex, background);
      contrast = { ratio, level: contrastLevel(ratio) };
    }
  }

  return (
    <div className="ds-cell">
      {/* Só a amostra leva o data-theme: o hex e o selo ficam nas cores da página */}
      {token.kind === "text" ? (
        <span
          data-theme={theme}
          className="ds-swatch ds-swatch-text"
          style={{
            color: `var(${token.name})`,
            background: `var(${token.on ?? "--bg-terminal"})`,
          }}
          aria-hidden="true"
        >
          Aa
        </span>
      ) : (
        <span
          data-theme={theme}
          className="ds-swatch"
          style={{ background: `var(${token.name})` }}
          aria-hidden="true"
        />
      )}
      <span className="ds-cell-info">
        <code className="ds-value">{hex ?? (value || "…")}</code>
        {contrast && (
          <span
            className={`ds-badge ds-badge-${contrast.level}`}
            title={t(`design.contraste.${contrast.level}`)}
          >
            {contrast.ratio.toFixed(1)}:1
          </span>
        )}
      </span>
    </div>
  );
}

const DesignSystem = () => {
  const { t } = useTranslation();
  const { theme: currentTheme, setTheme } = useTheme();
  const probes = useRef({});
  const sectionRefs = useRef({});
  const ref = useRef(null);
  useCommandAtTop(ref);
  const [values, setValues] = useState(null);

  // Lê os valores antes da primeira pintura, para não piscar "…"
  useLayoutEffect(() => {
    setValues(Object.fromEntries(THEMES.map((th) => [th, readTokens(probes.current[th])])));
  }, []);

  const themeLabel = (theme) => t(`design.temas.${theme}`);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="ds" ref={ref}>
      {/* Sondas invisíveis: uma por tema, só para ler os tokens */}
      {THEMES.map((theme) => (
        <span
          key={theme}
          ref={(element) => {
            probes.current[theme] = element;
          }}
          data-theme={theme}
          className="ds-probe"
          aria-hidden="true"
        />
      ))}

      <h3 className="ds-title">{t("design.titulo")}</h3>
      <p className="ds-intro">{t("design.intro")}</p>

      <nav className="ds-nav" aria-label={t("design.nav")}>
        <span className="ds-nav-prompt" aria-hidden="true">
          $ ls design/
        </span>
        {SECTIONS.map((id) => (
          <button key={id} type="button" onClick={() => scrollTo(id)}>
            {t(`design.secoes.${id}.titulo`).toLowerCase()}/
          </button>
        ))}
      </nav>

      {/* ===== Marca ===== */}
      <Section id="marca" sectionRefs={sectionRefs}>
        <div className="ds-card ds-brand">
          <Lockup theme={currentTheme} />
          <img
            src="/favicon.svg"
            alt={t("design.marca.favicon_alt")}
            className="ds-favicon"
            width="64"
            height="64"
          />
        </div>
        <ul className="ds-rules">
          <li>{t("design.marca.vetor")}</li>
          <li>{t("design.marca.cor")}</li>
          <li>{t("design.marca.galo")}</li>
          <li>{t("design.marca.favicon")}</li>
        </ul>
        <p className="ds-files">
          <code>src/components/AramuniLogo.jsx</code>
          <code>public/aramuni-logo.svg</code>
          <code>public/aramuni-logo-full.svg</code>
          <code>public/favicon.svg</code>
        </p>
      </Section>

      {/* ===== Temas ===== */}
      <Section id="temas" sectionRefs={sectionRefs}>
        <div className="ds-themes">
          {THEMES.map((theme) => {
            const active = theme === currentTheme;
            return (
              <div key={theme} className="ds-window" data-theme={theme}>
                <div className="ds-window-bar">
                  <span className="ds-window-buttons" aria-hidden="true">
                    {WINDOW_BUTTONS.map((color) => (
                      <span key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <span className="ds-window-title">{TERMINAL_TITLE}</span>
                </div>
                <div className="ds-window-body">
                  <Lockup theme={theme} />
                  <p className="ds-window-line">
                    <span className="ds-prompt">{PROMPT}</span>{" "}
                    <span className="ds-nowrap">
                      tema {theme}
                      <span className="ds-cursor" aria-hidden="true" />
                    </span>
                  </p>
                  <div className="ds-summary" aria-hidden="true">
                    {themeSummary.map((name) => (
                      <span key={name} style={{ background: `var(${name})` }} title={name} />
                    ))}
                  </div>
                  <p className="ds-window-desc">{t(`design.temas_desc.${theme}`)}</p>
                  <button
                    type="button"
                    className="ds-theme-btn"
                    onClick={() => setTheme(theme)}
                    disabled={active}
                    aria-pressed={active}
                  >
                    {active ? `● ${t("design.atual")}` : t("design.usar", { tema: themeLabel(theme) })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ===== Cores ===== */}
      <Section id="cores" sectionRefs={sectionRefs}>
        <div className="ds-table" role="table" aria-label={t("design.secoes.cores.titulo")}>
          <div className="ds-row ds-row-head" role="row">
            <span role="columnheader">{t("design.colunas.token")}</span>
            {THEMES.map((theme) => (
              <span key={theme} role="columnheader">
                {themeLabel(theme)}
              </span>
            ))}
          </div>
          {tokenGroups.map((group) => (
            <React.Fragment key={group.id}>
              <p className="ds-group-title" role="row">
                <span role="cell">{t(`design.grupos.${group.id}`)}</span>
              </p>
              {group.tokens.map((token) => (
                <div key={token.name} className="ds-row" role="row">
                  <span className="ds-token" role="rowheader">
                    <code>{token.name}</code>
                    <span className="ds-note">{t(`design.tokens.${token.name.slice(2)}`)}</span>
                  </span>
                  {THEMES.map((theme) => (
                    <span key={theme} role="cell">
                      <TokenCell token={token} theme={theme} values={values} />
                    </span>
                  ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <p className="ds-note">{t("design.cores.contraste_nota")}</p>

        <h5 className="ds-subtitle">{t("design.cores.paletas")}</h5>
        <p className="ds-note ds-spaced">{t("design.cores.paletas_intro")}</p>
        <div className="ds-palettes">
          {dataPalettes.map((palette) => (
            <div key={palette.id} className="ds-palette">
              <code className="ds-palette-name">{palette.id}</code>
              <span className="ds-palette-chips">
                {palette.tokens.map((name) => (
                  <span key={name} style={{ background: `var(${name})` }} title={name} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Tipografia ===== */}
      <Section id="tipografia" sectionRefs={sectionRefs}>
        <div className="ds-card">
          <p className="ds-font-name">Fira Code</p>
          <p className="ds-font-sample">{LIGATURES}</p>
          <code className="ds-code">font-family: {fontStack};</code>
        </div>
        <div className="ds-type-scale">
          {typeScale.map((item) => (
            <div key={item.id} className="ds-type-row">
              <code className="ds-type-size">{item.size}</code>
              <span className="ds-type-sample" style={{ fontSize: item.size }}>
                {t(`design.tipografia.tamanhos.${item.id}`)}
              </span>
            </div>
          ))}
        </div>
        <ul className="ds-rules">
          {["peso", "base", "input"].map((rule) => (
            <li key={rule}>{t(`design.tipografia.regras.${rule}`)}</li>
          ))}
        </ul>
      </Section>

      {/* ===== Medidas ===== */}
      <Section id="medidas" sectionRefs={sectionRefs}>
        <div className="ds-grid-3">
          <div className="ds-card">
            <p className="ds-label">{t("design.medidas.espacamento")}</p>
            {spacingScale.map((value) => (
              <div key={value} className="ds-space-row">
                <code>{value}</code>
                <span className="ds-space-bar" style={{ width: value }} aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="ds-card">
            <p className="ds-label">{t("design.medidas.raios")}</p>
            <div className="ds-radii">
              {radii.map((radius) => (
                <div key={radius.id} className="ds-radius">
                  <span
                    className={`ds-radius-shape${radius.id === "circulo" ? " ds-radius-circle" : ""}`}
                    style={{ borderRadius: radius.value }}
                    aria-hidden="true"
                  />
                  <code>{radius.value}</code>
                </div>
              ))}
            </div>
          </div>
          <div className="ds-card">
            <p className="ds-label">{t("design.medidas.breakpoints")}</p>
            {breakpoints.map((bp) => (
              <div key={bp.id} className="ds-bp-row">
                <code>≤ {bp.value}</code>
                <span className="ds-note">{t(`design.medidas.${bp.id}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <p className="ds-footer">{t("design.rodape")}</p>
    </div>
  );
};

export default DesignSystem;
