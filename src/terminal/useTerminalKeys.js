import { useCallback, useEffect, useRef } from "react";
import { autocomplete } from "./autocomplete";
import {
  isTerminalInput,
  scrollActiveInputIntoView,
  setTerminalInputValue,
} from "./terminalDom";

// Histórico (↑/↓) e autocomplete (Tab) para o input do terminal.
//
// O listener fica no document, na fase de captura: ele roda antes do React e,
// quando trata a tecla, chama stopPropagation para a lib não reagir também
// (por padrão ela usa ↑ para mover o cursor para o início da linha).

const HISTORY_KEY = "aramuni-history";
const HISTORY_MAX = 50;
const MODIFIER_KEYS = ["Shift", "Control", "Alt", "Meta"];

// O histórico sobrevive a recarregamentos, como o ~/.bash_history
const loadHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return Array.isArray(saved)
      ? saved.filter((item) => typeof item === "string").slice(-HISTORY_MAX)
      : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* navegação privada: o histórico vale só para esta visita */
  }
};

export default function useTerminalKeys({ enabled, commands, onShowOptions }) {
  const history = useRef(null);
  if (history.current === null) history.current = loadHistory();

  const position = useRef(null); // índice no histórico; null = linha nova
  const draft = useRef(""); // o que estava digitado antes de apertar ↑
  const lastTab = useRef(null); // texto no último Tab ambíguo (Tab duplo)

  const showOptions = useRef(onShowOptions);
  useEffect(() => {
    showOptions.current = onShowOptions;
  });

  const addToHistory = useCallback((input) => {
    position.current = null;
    draft.current = "";
    lastTab.current = null;

    const command = input.trim();
    const entries = history.current;
    // Igual ao HISTCONTROL=ignoredups: não repete o último comando
    if (!command || entries[entries.length - 1] === command) return;
    entries.push(command);
    if (entries.length > HISTORY_MAX) entries.shift();
    saveHistory(entries);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const browseHistory = (event, input) => {
      const entries = history.current;
      const goingUp = event.key === "ArrowUp";

      // ↓ fora do histórico continua com o comportamento normal da lib
      if (!goingUp && position.current === null) return;

      event.preventDefault();
      event.stopPropagation();

      if (goingUp) {
        if (position.current === null) {
          if (entries.length === 0) return;
          draft.current = input.value;
          position.current = entries.length - 1;
        } else if (position.current > 0) {
          position.current -= 1;
        } else {
          return; // já está no comando mais antigo
        }
        setTerminalInputValue(input, entries[position.current]);
        return;
      }

      if (position.current < entries.length - 1) {
        position.current += 1;
        setTerminalInputValue(input, entries[position.current]);
      } else {
        // Passou do mais recente: devolve o que estava sendo digitado
        position.current = null;
        setTerminalInputValue(input, draft.current);
      }
    };

    const complete = (event, input) => {
      // Com a linha vazia (ou Shift+Tab) o Tab segue navegando pela página,
      // para quem usa teclado chegar no seletor de idioma e no tema
      if (event.shiftKey || !input.value.trim()) return;

      event.preventDefault();
      event.stopPropagation();

      const typed = input.value;
      const result = autocomplete(typed, commands);

      if (result.value !== undefined) {
        lastTab.current = null;
        setTerminalInputValue(input, result.value);
      } else if (result.options) {
        // Como no bash: o primeiro Tab não faz nada, o segundo lista as opções
        if (lastTab.current === typed) {
          lastTab.current = null;
          showOptions.current?.(typed, result.options);
        } else {
          lastTab.current = typed;
        }
      }
    };

    const onKeyDown = (event) => {
      // Ignora eventos sintéticos (inclusive o ArrowRight do terminalDom)
      if (!event.isTrusted || !isTerminalInput(event.target)) return;
      if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey)
        return;

      if (event.key !== "Tab" && !MODIFIER_KEYS.includes(event.key)) {
        lastTab.current = null;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        browseHistory(event, event.target);
      } else if (event.key === "Tab") {
        complete(event, event.target);
      }
    };

    // Qualquer coisa digitada (tecla, colar, histórico, autocomplete) leva o
    // scroll até a linha do input, para o visitante ver o que está escrevendo
    const onInput = (event) => {
      if (isTerminalInput(event.target)) scrollActiveInputIntoView();
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("input", onInput, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("input", onInput, true);
    };
  }, [enabled, commands]);

  return { addToHistory };
}
