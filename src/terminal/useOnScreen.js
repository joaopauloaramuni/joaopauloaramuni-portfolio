import { useEffect, useState } from "react";

// A saída do terminal está na tela (ou perto dela)?
//
// As saídas antigas continuam montadas no terminal: rodar "canvas" dez vezes
// deixa dez painéis vivos lá em cima. Quem tem relógio, timer ou animação usa
// este hook para parar quando o visitante rola para longe e voltar quando ele
// rola de volta.
//
// A raiz do IntersectionObserver é o corpo do terminal (.react-terminal), que
// é quem rola: assim a margem vale dentro dele (sem ela, só a página contaria).
export default function useOnScreen(ref, { margin = "0px" } = {}) {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { root: element.closest(".react-terminal"), rootMargin: margin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, margin]);

  return onScreen;
}
