import { useEffect } from "react";
import { keepCommandAtTopIfLast } from "./terminalDom";

// Padrão de scroll de todos os comandos: o comando que acabou de rodar fica
// no topo do terminal, com a saída logo abaixo (como num terminal de verdade
// depois de um "clear"), em vez de o visitante cair no fim da saída.
//
//   1. App.jsx chama keepLastCommandAtTop() ao executar qualquer comando
//      (inclusive depois do scroll que a react-terminal-ui faz no Enter).
//   2. Cada comando chama este hook com a ref do elemento raiz da saída:
//
//        const ref = useRef(null);
//        useCommandAtTop(ref);
//        return <div ref={ref}>...</div>;
//
//      Ele repete o ajuste quando a saída monta (na primeira vez o código
//      chega depois do comando, ver lazyCommand.jsx) e sempre que ela cresce
//      depois (dados de API, imagens, PDF, resposta da IA sendo escrita).
//      Nada a fazer nos componentes quando os dados chegam: o
//      ResizeObserver percebe sozinho.
//
// O ajuste só acontece enquanto a saída é a última do terminal e nunca puxa
// o visitante de volta (ver keepCommandAtTopIfLast em terminalDom.js).
export default function useCommandAtTop(ref) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    keepCommandAtTopIfLast(element);

    if (typeof ResizeObserver === "undefined") return undefined;
    let height = element.offsetHeight;
    const observer = new ResizeObserver(() => {
      const next = element.offsetHeight;
      const grew = next > height;
      height = next;
      if (grew) keepCommandAtTopIfLast(element);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}
