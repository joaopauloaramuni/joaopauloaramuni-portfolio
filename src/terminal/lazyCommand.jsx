import React, { lazy, Suspense } from "react";
import { Aviso, FalhaAoCarregar } from "./CommandFallback";

// Comando carregado sob demanda: o código (e o CSS) de cada comando só é
// baixado na primeira vez que ele roda, em vez de vir todo no bundle inicial.
//
//   const SobreMim = lazyCommand(() => import("../components/SobreMim"));
//   <SobreMim />              → igual a antes, com "Carregando..." no meio
//   SobreMim.preload()        → baixa o código antes (ver App.jsx)
//
// O componente devolvido é sempre o mesmo, então o App continua conseguindo
// perguntar "a última linha é o jogo?" (line.type === FlappyPlaneGame).
//
// Se o download falhar (rede caiu, ou um deploy novo apagou os arquivos da
// versão que o visitante abriu), a saída mostra um aviso em vez de derrubar
// o terminal inteiro, e a próxima vez que o comando rodar tenta de novo.

export default function lazyCommand(loader, { fallbackKey = "comando.carregando" } = {}) {
  let promise = null;
  const load = () => {
    promise ??= loader().catch((error) => {
      promise = null; // a próxima tentativa baixa de novo
      throw error;
    });
    return promise;
  };

  // O React.lazy guarda a falha para sempre: depois de um erro, um novo
  // lazy() deixa a próxima execução do comando tentar outra vez
  let LazyComponent = lazy(load);
  const reset = () => {
    LazyComponent = lazy(load);
  };

  function Command(props) {
    const Loaded = LazyComponent;
    return (
      <FalhaAoCarregar onError={reset}>
        <Suspense fallback={<Aviso chave={fallbackKey} />}>
          <Loaded {...props} />
        </Suspense>
      </FalhaAoCarregar>
    );
  }

  Command.preload = () => load().catch(() => {});
  return Command;
}
