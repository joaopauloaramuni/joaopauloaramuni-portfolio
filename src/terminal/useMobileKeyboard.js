import { useEffect } from "react";
import { isTerminalInput, scrollActiveInputIntoView } from "./terminalDom";

// Teclado virtual no celular.
//
// No iOS Safari (e no Chrome Android desde a versão 108) o teclado não
// encolhe a página: ele só reduz o visualViewport e fica POR CIMA do
// conteúdo. Como o terminal ocupa 100dvh, a linha do input (a última do
// terminal) ficava escondida atrás do teclado.
//
// Aqui o tamanho da área realmente visível vai para a variável CSS
// --app-height (usada no App.css e na altura do <Terminal>). Quando o
// teclado abre, o terminal encolhe até a borda dele e o input é levado de
// volta para a tela, como num app de chat.
//
// O teclado do Android abre com animação: o resize chega em vários passos
// pequenos (20-40px cada). Por isso a comparação é com a altura CHEIA da
// tela (sem teclado), e não com a do evento anterior. Enquanto o teclado
// estiver aberto, cada passo da animação traz o input de volta.

const KEYBOARD_THRESHOLD = 80; // px: variação menor é barra de endereço, não teclado
const FOCUS_SETTLE_MS = 350; // tempo para o teclado terminar de abrir após o foco

export default function useMobileKeyboard() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return; // navegador antigo: fica no 100dvh do CSS

    const root = document.documentElement;
    let fullHeight = viewport.height; // maior altura vista nesta largura
    let lastWidth = viewport.width;
    let lastHeight = viewport.height;

    const terminalFocused = () => isTerminalInput(document.activeElement);

    const sync = () => {
      const { width, height } = viewport;
      root.style.setProperty("--app-height", `${Math.round(height)}px`);

      // O iOS "empurra" a página para cima ao focar um input, mesmo com
      // overflow: hidden. Com a altura já ajustada, volta para o topo.
      if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);

      // Girou a tela: recomeça a referência da altura cheia
      if (Math.abs(width - lastWidth) > 1) {
        lastWidth = width;
        fullHeight = height;
      }
      if (height > fullHeight) fullHeight = height;

      const keyboardOpen = fullHeight - height > KEYBOARD_THRESHOLD;
      const shrinking = height < lastHeight;
      lastHeight = height;

      // Teclado abrindo (qualquer passo da animação) com o terminal focado
      if (keyboardOpen && shrinking && terminalFocused()) {
        scrollActiveInputIntoView();
      }
    };

    // Rede de segurança: alguns navegadores não disparam resize no
    // visualViewport (ou disparam antes do layout). Depois do foco, quando o
    // teclado já terminou de abrir, garante o input na tela.
    let focusTimer;
    const onFocusIn = (event) => {
      if (!isTerminalInput(event.target)) return;
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => {
        sync();
        // Só com teclado aberto: no desktop, clicar no terminal para ler uma
        // saída longa não pode jogar o scroll para o input
        const keyboardOpen = fullHeight - viewport.height > KEYBOARD_THRESHOLD;
        if (keyboardOpen && terminalFocused()) scrollActiveInputIntoView();
      }, FOCUS_SETTLE_MS);
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      clearTimeout(focusTimer);
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      document.removeEventListener("focusin", onFocusIn);
      root.style.removeProperty("--app-height");
    };
  }, []);
}
