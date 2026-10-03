import React, { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../theme/themeContext";
import {
  ARAMUNI_ASCII,
  LOGO,
  PROMPT,
  TERMINAL_TITLE,
  WINDOW_BUTTONS,
} from "../data/brandData";
import {
  allTokenNames,
  brailleStack,
  breakpoints,
  colorFamilies,
  fontFamilies,
  fontStack,
  radii,
  spacingScale,
  tokenGroups,
  typeScale,
} from "../data/designSystemData";
import { colorFamily, contrastRatio, luminance, toHex } from "../theme/colorUtils";
import "./DesignSystem.css";

const THEMES = ["dark", "light"];
const SECTIONS = ["marca", "cores", "tipografia", "espacamento", "raios", "breakpoints"];
const FONT_SAMPLE = "ABCDEFGHIJKLM abcdefghijklm 0123456789";
const LIGATURE_SAMPLE = "=> -> != === >= <= // {} []";

const toPx = (rem) => `${Number((parseFloat(rem) * 16).toFixed(1))}px`;

// Lê os tokens em um elemento com data-theme="dark" ou "light". Como o
// theme.css declara as cores nesses seletores, cada sonda enxerga os valores
// de um tema, seja qual for o tema da página.
const readTokens = (element) => {
  const style = getComputedStyle(element);
  return Object.fromEntries(
    allTokenNames.map((name) => [
      name,
      style.getPropertyValue(name).replace(/\s+/g, " ").trim(),
    ])
  );
};

// Texto pede 4.5:1 (AA) ou 7:1 (AAA); ícones e bordas pedem 3:1
const contrastLevel = (ratio, kind) => {
  if (kind === "icon") return ratio >= 3 ? "ok" : "baixo";
  if (ratio >= 7) return "aaa";
  if (ratio >= 4.5) return "aa";
  if (ratio >= 3) return "grande";
  return "baixo";
};

// Junta as cores sólidas dos dois temas, agrupa por família e ordena do
// escuro para o claro. Cores repetidas viram um item só.
const buildColorScale = (values, themeLabel) => {
  const colors = new Map();
  THEMES.forEach((theme) => {
    Object.entries(values[theme]).forEach(([name, value]) => {
      const hex = toHex(value);
      if (!hex) return;
      const entry = colors.get(hex) ?? { hex, uses: [] };
      entry.uses.push(`${name} (${themeLabel(theme)})`);
      colors.set(hex, entry);
    });
  });

  return colorFamilies
    .map((family) => ({
      family,
      colors: [...colors.values()]
        .filter((color) => colorFamily(color.hex) === family)
        .sort((a, b) => luminance(a.hex) - luminance(b.hex)),
    }))
    .filter((group) => group.colors.length > 0);
};

function Swatch({ token }) {
  const color = `var(${token.name})`;

  switch (token.kind) {
    case "text":
      return (
        <span
          className="ds-swatch ds-swatch-text"
          style={{ color, background: token.on ? `var(${token.on})` : undefined }}
          aria-hidden="true"
        >
          Aa
        </span>
      );
    case "icon": {
      const Icon = token.icon;
      return (
        <span className="ds-swatch ds-swatch-icon" aria-hidden="true">
          <Icon style={{ color }} />
        </span>
      );
    }
    case "shadow":
      return (
        <span
          className="ds-swatch ds-swatch-shadow"
          style={{ boxShadow: color }}
          aria-hidden="true"
        />
      );
    case "scanline":
      return <span className="ds-swatch ds-swatch-scanline" aria-hidden="true" />;
    default:
      return (
        <span className="ds-swatch" style={{ background: color }} aria-hidden="true" />
      );
  }
}

// Amostra de um token em um tema: o data-theme faz o var() do CSS resolver
// para as cores daquele tema, mesmo com a página no outro
function TokenSample({ token, theme, values }) {
  const { t } = useTranslation();
  const themeValues = values?.[theme];
  const value = themeValues?.[token.name] ?? "";

  let contrast = null;
  if (themeValues && (token.kind === "text" || token.kind === "icon")) {
    const foreground = toHex(value);
    const background = toHex(themeValues[token.on ?? "--bg-terminal"]);
    if (foreground && background) {
      const ratio = contrastRatio(foreground, background);
      contrast = { ratio, level: contrastLevel(ratio, token.kind) };
    }
  }

  return (
    <div className="ds-sample" data-theme={theme}>
      <Swatch token={token} />
      <div className="ds-sample-info">
        <span className="ds-sample-theme">{t(`design.temas.${theme}`)}</span>
        <code className="ds-value">{value || "…"}</code>
        {contrast && (
          <span
            className={`ds-badge ds-badge-${contrast.level}`}
            title={t("design.cores.contraste_titulo", {
              fundo: token.on ?? "--bg-terminal",
            })}
          >
            {contrast.ratio.toFixed(1)}:1 · {t(`design.contraste.${contrast.level}`)}
          </span>
        )}
      </div>
    </div>
  );
}

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

const DesignSystem = () => {
  const { t } = useTranslation();
  const { theme: currentTheme } = useTheme();
  const probes = useRef({});
  const sectionRefs = useRef({});
  const [values, setValues] = useState(null);

  // Lê os valores antes da primeira pintura, para não piscar "…"
  useLayoutEffect(() => {
    setValues({
      dark: readTokens(probes.current.dark),
      light: readTokens(probes.current.light),
    });
  }, []);

  const themeLabel = (theme) => t(`design.temas.${theme}`);
  const colorScale = values ? buildColorScale(values, themeLabel) : [];

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="ds">
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
        <div className="ds-grid-2">
          <figure className="ds-card ds-logo-card">
            <img
              src={LOGO.src}
              width={LOGO.width}
              height={LOGO.height}
              alt={t("design.marca.logo_alt")}
              className="ds-logo"
              loading="lazy"
            />
            <figcaption className="ds-logo-meta">
              <span className="ds-label">{t("design.marca.logo")}</span>
              <code>aramunilogo.png</code>
              <span className="ds-note">
                PNG · {LOGO.width}×{LOGO.height} · {t("design.marca.logo_fundo")}
              </span>
              <span className="ds-note">{t("design.marca.logo_uso")}</span>
            </figcaption>
          </figure>

          <div className="ds-card">
            <p className="ds-label">{t("design.marca.banner")}</p>
            <pre className="ds-ascii" aria-label="ARAMUNI">
              {ARAMUNI_ASCII}
            </pre>
            <p className="ds-note">{t("design.marca.banner_uso")}</p>
          </div>
        </div>

        <h5 className="ds-subtitle">{t("design.marca.janela")}</h5>
        <div className="ds-windows">
          {THEMES.map((theme) => (
            <div key={theme} className="ds-window" data-theme={theme}>
              <div className="ds-window-bar">
                <span className="ds-window-buttons" aria-hidden="true">
                  {WINDOW_BUTTONS.map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </span>
                <span className="ds-window-title">{TERMINAL_TITLE}</span>
              </div>
              <p className="ds-window-line">
                <span className="ds-prompt">{PROMPT}</span>{" "}
                <span className="ds-nowrap">
                  design
                  <span className="ds-cursor" aria-hidden="true" />
                </span>
              </p>
              <p className="ds-window-caption">
                {themeLabel(theme)}
                {theme === currentTheme && ` · ${t("design.atual")}`}
              </p>
            </div>
          ))}
        </div>
        <p className="ds-note">
          {t("design.marca.janela_nota", { cores: WINDOW_BUTTONS.join(", ") })}
        </p>
      </Section>

      {/* ===== Cores ===== */}
      <Section id="cores" sectionRefs={sectionRefs}>
        <h5 className="ds-subtitle">{t("design.cores.escala")}</h5>
        <p className="ds-note ds-spaced">{t("design.cores.escala_intro")}</p>
        <div className="ds-scale">
          {colorScale.map(({ family, colors }) => (
            <div key={family}>
              <p className="ds-family-name">{t(`design.familias.${family}`)}</p>
              <div className="ds-ramp">
                {colors.map((color) => (
                  <figure
                    key={color.hex}
                    className="ds-chip"
                    title={color.uses.join("\n")}
                  >
                    <span
                      className="ds-chip-color"
                      style={{ background: color.hex }}
                      aria-hidden="true"
                    />
                    <figcaption className="ds-chip-hex">{color.hex}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h5 className="ds-subtitle">{t("design.cores.tokens")}</h5>
        <p className="ds-note ds-spaced">{t("design.cores.tokens_intro")}</p>
        <div className="ds-tokens">
          {tokenGroups.map((group) => (
            <div key={group.id} className="ds-token-group">
              <p className="ds-group-title">{t(`design.grupos.${group.id}`)}</p>
              <div className="ds-token-head" aria-hidden="true">
                <span>{t("design.colunas.token")}</span>
                <span>{t("design.colunas.uso")}</span>
                {THEMES.map((theme) => (
                  <span key={theme}>
                    {themeLabel(theme)}
                    {theme === currentTheme && ` · ${t("design.atual")}`}
                  </span>
                ))}
              </div>
              {group.tokens.map((token) => (
                <div key={token.name} className="ds-token-row">
                  <code className="ds-token-name">{token.name}</code>
                  <span className="ds-token-desc">
                    {t(`design.tokens.${token.name.slice(2)}`)}
                  </span>
                  {THEMES.map((theme) => (
                    <TokenSample key={theme} token={token} theme={theme} values={values} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Tipografia ===== */}
      <Section id="tipografia" sectionRefs={sectionRefs}>
        <div className="ds-grid-2">
          {fontFamilies.map((font) => (
            <article key={font.id} className="ds-card">
              <p className="ds-label">{t(`design.tipografia.${font.id}.papel`)}</p>
              <p className="ds-font-name" style={{ fontFamily: `"${font.family}", monospace` }}>
                {font.family}
              </p>
              <p className="ds-note">{font.file}</p>
              <p className="ds-font-sample" style={{ fontFamily: `"${font.family}", monospace` }}>
                {FONT_SAMPLE}
                <br />
                {LIGATURE_SAMPLE}
              </p>
              <p className="ds-text ds-no-liga">{t(`design.tipografia.${font.id}.desc`)}</p>
            </article>
          ))}
        </div>

        <div className="ds-card ds-stack-card">
          <p className="ds-label">{t("design.tipografia.pilha")}</p>
          <code className="ds-code">font-family: {fontStack};</code>
          <p className="ds-label">{t("design.tipografia.braille")}</p>
          <code className="ds-code">font-family: {brailleStack};</code>
          <p className="ds-note">{t("design.tipografia.braille_desc")}</p>
        </div>

        <ul className="ds-rules">
          {["monoespacada", "peso", "base", "input"].map((rule) => (
            <li key={rule}>{t(`design.tipografia.regras.${rule}`)}</li>
          ))}
        </ul>

        <h5 className="ds-subtitle">{t("design.tipografia.escala")}</h5>
        <div className="ds-type-scale">
          {typeScale.map((item) => (
            <div key={item.id} className="ds-type-row">
              <div className="ds-type-meta">
                <code>{item.size}</code>
                <span className="ds-note">{toPx(item.size)}</span>
              </div>
              <div className="ds-type-body">
                <p className="ds-type-sample" style={{ fontSize: item.size }}>
                  {t(`design.tipografia.tamanhos.${item.id}.exemplo`)}
                </p>
                <p className="ds-note">{t(`design.tipografia.tamanhos.${item.id}.uso`)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Espaçamento ===== */}
      <Section id="espacamento" sectionRefs={sectionRefs}>
        <div className="ds-card ds-space-card">
          {spacingScale.map((value) => (
            <div key={value} className="ds-space-row">
              <code>{value}</code>
              <span className="ds-note">{toPx(value)}</span>
              <span className="ds-space-bar" style={{ width: value }} aria-hidden="true" />
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Raios ===== */}
      <Section id="raios" sectionRefs={sectionRefs}>
        <div className="ds-radii">
          {radii.map((radius) => (
            <div key={radius.id} className="ds-radius">
              <span
                className={`ds-radius-shape ${radius.id === "circle" ? "ds-radius-circle" : ""}`}
                style={{ borderRadius: radius.value }}
                aria-hidden="true"
              />
              <code>{radius.value}</code>
              <span className="ds-note">{t(`design.raios.${radius.id}`)}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Breakpoints ===== */}
      <Section id="breakpoints" sectionRefs={sectionRefs}>
        <div className="ds-breakpoints">
          {breakpoints.map((bp) => (
            <div key={bp.id} className="ds-bp-row">
              <span className="ds-bp-value">
                <code>≤ {bp.value}</code>
                {bp.main && <span className="ds-badge ds-badge-main">{t("design.principal")}</span>}
              </span>
              <span className="ds-text">{t(`design.breakpoints.${bp.id}`)}</span>
            </div>
          ))}
        </div>
      </Section>

      <p className="ds-footer">{t("design.rodape")}</p>
    </div>
  );
};

export default DesignSystem;
