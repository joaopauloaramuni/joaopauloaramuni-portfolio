// Layouts do fundo do tema matrix (ver components/MatrixFundo.jsx). Para
// trocar: "tema --matrix --wake" no terminal, ou ?matrix=wake na URL.
// A escolha fica salva no navegador, junto com o tema.
//   chuva  chuva de código desenhada em canvas, na tela toda (--rain em inglês)
//   wake   a mesa do "Wake up, Neo...", cobrindo o fundo
const MATRIX_CONFIG = {
  LAYOUTS: ["chuva", "wake"],
  // Nomes em inglês que levam ao mesmo layout (como --light / --claro)
  ALIASES: { rain: "chuva" },
  PADRAO: "chuva",
  STORAGE_KEY: "aramuni-matrix-layout",

  // Chuva em canvas
  VERDE: "#42c920",
  CABECA: "#e6ffe0", // primeiro caractere de cada coluna, quase branco
  FONTE_PX: 16,
  FPS: 22,
  // Meia-largura katakana + dígitos + alguns símbolos, como no filme
  CARACTERES:
    "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789Z:・.\"=*+-<>¦｜╌",
};

export default MATRIX_CONFIG;
