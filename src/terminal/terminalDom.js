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
export function scrollLastCommandToTop() {
  afterPaint(() => {
    const body = document.querySelector(TERMINAL_BODY);
    if (!body) return;
    const commands = body.querySelectorAll(
      ":scope > .react-terminal-input:not(.react-terminal-active-input)"
    );
    const last = commands[commands.length - 1];
    if (!last) return;
    const paddingTop = parseFloat(getComputedStyle(body).paddingTop) || 0;
    body.scrollTop +=
      last.getBoundingClientRect().top -
      body.getBoundingClientRect().top -
      paddingTop;
  });
}
