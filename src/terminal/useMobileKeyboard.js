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

const KEYBOARD_THRESHOLD = 80; // px: variação menor é barra de endereço, não teclado

export default function useMobileKeyboard() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return; // navegador antigo: fica no 100dvh do CSS

    const root = document.documentElement;
    let lastHeight = viewport.height;

    const sync = () => {
      const height = viewport.height;
      root.style.setProperty("--app-height", `${Math.round(height)}px`);

      // O iOS "empurra" a página para cima ao focar um input, mesmo com
      // overflow: hidden. Com a altura já ajustada, volta para o topo.
      if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);

      const keyboardOpened = lastHeight - height > KEYBOARD_THRESHOLD;
      lastHeight = height;

      // Teclado abriu com o terminal focado: mostra o que está sendo digitado
      if (keyboardOpened && isTerminalInput(document.activeElement)) {
        scrollActiveInputIntoView();
      }
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      root.style.removeProperty("--app-height");
    };
  }, []);
}
