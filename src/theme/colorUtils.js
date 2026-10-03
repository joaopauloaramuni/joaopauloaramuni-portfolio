// Utilitários de cor do comando "design": normalizam qualquer cor CSS
// e calculam o contraste pela fórmula do WCAG 2.

let context;

// "#0f0", "gray" ou "rgb(0 255 0)" → "#00ff00". O canvas devolve a cor já
// normalizada. Retorna null para cores com transparência, gradientes,
// sombras e qualquer valor que não seja uma cor sólida.
export function toHex(value) {
  if (!value || !CSS.supports("color", value)) return null;
  context ??= document.createElement("canvas").getContext("2d");
  context.fillStyle = "#000000";
  context.fillStyle = value;
  const normalized = context.fillStyle;
  return normalized.startsWith("#") ? normalized : null;
}

const channels = (hex) =>
  [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);

export function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}

// Família da cor pela matiz. Cores com pouca saturação (os cinzas azulados
// do tema, por exemplo) contam como neutras.
export function colorFamily(hex) {
  const [r, g, b] = channels(hex);
  const max = Math.max(r, g, b);
  const chroma = max - Math.min(r, g, b);
  if (chroma < 0.2) return "neutros";

  let hue;
  if (max === r) hue = ((g - b) / chroma) % 6;
  else if (max === g) hue = (b - r) / chroma + 2;
  else hue = (r - g) / chroma + 4;
  hue = (hue * 60 + 360) % 360;

  if (hue < 15 || hue >= 330) return "vermelhos";
  if (hue < 65) return "amarelos";
  if (hue < 170) return "verdes";
  if (hue < 260) return "azuis";
  return "outros";
}
