// Utilitários de DOM para conversar com o react-terminal-ui.
//
// A lib guarda o texto digitado num estado interno e não expõe uma prop
// controlada (o `startingInputValue` só reage quando o valor muda e ainda
// faz trim). Para o histórico e o autocomplete conseguirem escrever no input,
// usamos o mesmo truque do Testing Library: setter nativo + evento "input".
// O React enxerga isso como digitação e a lib atualiza o próprio estado.

const HIDDEN_INPUT = ".terminal-hidden-input";
const TERMINAL_BODY = ".react-terminal";

const nativeValueSetter = Object.getOwnPropertyDescriptor(
  HTMLInputElement.prototype,
  "value"
).set;

export const isTerminalInput = (element) =>
  element instanceof HTMLInputElement && element.matches(HIDDEN_INPUT);

export function setTerminalInputValue(input, value) {
  nativeValueSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.setSelectionRange(value.length, value.length);

  // A lib desenha o cursor piscante com um deslocamento próprio, que só é
  // recalculado nas setas. Depois que o React renderizar o novo texto, um
  // ArrowRight sintético (com o caret no fim) devolve o cursor para o final.
  requestAnimationFrame(() => {
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );
  });
}

// Espera o React pintar as linhas novas antes de mexer no scroll
const afterPaint = (fn) =>
  requestAnimationFrame(() => requestAnimationFrame(fn));

export function scrollTerminalToBottom() {
  afterPaint(() => {
    const body = document.querySelector(TERMINAL_BODY);
    if (body) body.scrollTop = body.scrollHeight;
  });
}

// Leva a última linha de comando executada para o topo do terminal.
// Usado nos links diretos: o visitante cai direto na saída do comando,
// com as boas-vindas logo acima (é só rolar para cima).
// Distância (px) entre a última linha de comando executada e o topo da
// área visível do terminal: > 0 abaixo do topo, < 0 já passou do topo
function lastCommandOffset() {
  const body = document.querySelector(TERMINAL_BODY);
  if (!body) return null;
  const commands = body.querySelectorAll(
    ":scope > .react-terminal-input:not(.react-terminal-active-input)"
  );
  const last = commands[commands.length - 1];
  if (!last) return null;
  const paddingTop = parseFloat(getComputedStyle(body).paddingTop) || 0;
  const offset =
    last.getBoundingClientRect().top - body.getBoundingClientRect().top - paddingTop;
  return { body, offset };
}

function scrollLastCommandToTopNow() {
  const found = lastCommandOffset();
  if (found) found.body.scrollTop += found.offset;
}

export function scrollLastCommandToTop() {
  afterPaint(scrollLastCommandToTopNow);
}

// A saída é a última do terminal (logo acima do input)? Serve para quem
// carrega dados depois: só mexe no scroll se o visitante ainda estiver nela.
export const isLastTerminalOutput = (element) =>
  Boolean(
    element?.nextElementSibling?.classList.contains("react-terminal-active-input")
  );

// Depois do Enter, a react-terminal-ui espera 500ms e rola até o input
// (scrollIntoView). Numa saída longa isso joga o visitante para o fim dela;
// rolamos de novo logo depois da lib para o comando continuar no topo.
const LIB_ENTER_SCROLL_MS = 500;
export function keepLastCommandAtTop() {
  scrollLastCommandToTop();
  setTimeout(scrollLastCommandToTopNow, LIB_ENTER_SCROLL_MS + 1);
}

// Exceção ao padrão acima: comandos cuja saída termina na base do terminal,
// como num terminal de verdade (ex.: "ajuda"). Assim o input continua
// visível logo abaixo da saída e dá para ver o que está sendo digitado.
// Repete depois do scroll que a lib faz 500ms após o Enter.
export function keepTerminalAtBottom() {
  scrollTerminalToBottom();
  setTimeout(() => {
    const body = document.querySelector(TERMINAL_BODY);
    if (body) body.scrollTop = body.scrollHeight;
  }, LIB_ENTER_SCROLL_MS + 1);
}

// Garante que a linha do input (onde as letras digitadas aparecem) esteja
// visível. Chamado a cada tecla: se o visitante rolou para cima para ler uma
// saída longa e volta a digitar, o terminal desce até o input, como no bash.
export function scrollActiveInputIntoView() {
  afterPaint(() => {
    const body = document.querySelector(TERMINAL_BODY);
    const line = body?.querySelector(".react-terminal-active-input");
    if (!line) return;
    const style = getComputedStyle(body);
    const bodyRect = body.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();
    const visibleTop = bodyRect.top + (parseFloat(style.paddingTop) || 0);
    const visibleBottom =
      bodyRect.bottom - (parseFloat(style.paddingBottom) || 0);

    if (lineRect.bottom > visibleBottom) {
      // O input é a última linha: descer até o fim deixa ele inteiro na tela
      body.scrollTop = body.scrollHeight;
    } else if (lineRect.top < visibleTop) {
      body.scrollTop -= visibleTop - lineRect.top;
    }
  });
}

// Saída que cresceu depois do comando (código lazy que chegou, dados de uma
// API, imagens, PDF): se ela ainda é a última do terminal, leva o comando de
// volta para o topo. Só desce, e só com o comando na tela: se o visitante já
// rolou para ler a saída (comando acima do topo) ou subiu para ver outro
// comando (comando abaixo da tela), o scroll fica onde ele deixou.
export function keepCommandAtTopIfLast(element) {
  if (!isLastTerminalOutput(element)) return;
  afterPaint(() => {
    const found = lastCommandOffset();
    if (!found) return;
    const { body, offset } = found;
    if (offset > 1 && offset < body.clientHeight) body.scrollTop += offset;
  });
}
