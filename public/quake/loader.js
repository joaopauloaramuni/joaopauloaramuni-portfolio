/*
 * Carregador do Quake (comando "jogo" ou "quake").
 *
 * O motor (quake.js + quake.wasm) é o WinQuake compilado para WebAssembly
 * (ver scripts/quake). Os dados do jogo não vêm junto: o pak0.pak do episódio
 * shareware é extraído, aqui no navegador, do quake106.zip original da id
 * Software, que é servido sem modificação (com as licenças dentro dele).
 *
 *   quake106.zip  →  resource.1 (arquivo LHA, método -lh5-)  →  id1/pak0.pak
 *
 * Ordem de busca: ./quake106.zip, ./pak0.pak e, se nenhum existir, o visitante
 * pode escolher o próprio quake106.zip ou pak0.pak no computador.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var EN = (params.get("lang") || "").toLowerCase().indexOf("en") === 0;

  var TXT = EN
    ? {
        motor: "Loading engine...",
        baixando: "Downloading quake106.zip",
        extraindo: "Extracting pak0.pak...",
        iniciando: "Starting...",
        semDados:
          "Shareware data not found on the server. Choose quake106.zip (Quake 1.06 shareware) or pak0.pak on your computer:",
        escolher: "Choose file",
        invalido: "This file is not quake106.zip nor pak0.pak.",
        erro: "Could not start Quake: ",
        clique: "Click to play",
        dica: "Mouse aims · WASD moves · Space jumps · Click shoots · Esc menu",
        celular: "Quake needs a keyboard and mouse.",
      }
    : {
        motor: "Carregando o motor...",
        baixando: "Baixando quake106.zip",
        extraindo: "Extraindo pak0.pak...",
        iniciando: "Iniciando...",
        semDados:
          "Os dados do shareware não estão no servidor. Escolha o quake106.zip (Quake 1.06 shareware) ou o pak0.pak no seu computador:",
        escolher: "Escolher arquivo",
        invalido: "Esse arquivo não é o quake106.zip nem o pak0.pak.",
        erro: "Não foi possível iniciar o Quake: ",
        clique: "Clique para jogar",
        dica: "Mouse mira · WASD anda · Espaço pula · Clique atira · Esc menu",
        celular: "O Quake precisa de teclado e mouse.",
      };

  // Resolução do renderizador por software: 640x480 roda liso e fica nítido
  // no quadro do terminal (o canvas é esticado pelo CSS, em 4:3)
  var ARGS = "-width 640 -height 480";

  var $ = function (id) {
    return document.getElementById(id);
  };
  var statusEl = $("status");
  var barraEl = $("barra");
  var canvas = $("canvas");

  function status(texto, fracao) {
    statusEl.textContent = texto;
    if (fracao == null) {
      barraEl.hidden = true;
    } else {
      barraEl.hidden = false;
      barraEl.value = Math.round(fracao * 100);
    }
  }

  function avisarPai(tipo) {
    try {
      parent.postMessage({ origem: "quake", tipo: tipo }, location.origin);
    } catch {
      /* fora de um iframe */
    }
  }

  // ---------------------------------------------------------------------
  // ZIP (só o necessário: diretório central + deflate do navegador)
  // ---------------------------------------------------------------------

  function u16(b, o) {
    return b[o] | (b[o + 1] << 8);
  }
  function u32(b, o) {
    return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
  }

  function listarZip(bytes) {
    var fim = -1;
    for (var i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
      if (u32(bytes, i) === 0x06054b50) {
        fim = i;
        break;
      }
    }
    if (fim < 0) throw new Error("zip");
    var total = u16(bytes, fim + 10);
    var pos = u32(bytes, fim + 16);
    var entradas = [];
    for (var n = 0; n < total; n++) {
      if (u32(bytes, pos) !== 0x02014b50) throw new Error("zip");
      var tamNome = u16(bytes, pos + 28);
      entradas.push({
        nome: new TextDecoder("latin1").decode(bytes.subarray(pos + 46, pos + 46 + tamNome)),
        metodo: u16(bytes, pos + 10),
        compactado: u32(bytes, pos + 20),
        tamanho: u32(bytes, pos + 24),
        local: u32(bytes, pos + 42),
      });
      pos += 46 + tamNome + u16(bytes, pos + 30) + u16(bytes, pos + 32);
    }
    return entradas;
  }

  function lerDoZip(bytes, entrada) {
    var l = entrada.local;
    if (u32(bytes, l) !== 0x04034b50) throw new Error("zip");
    var inicio = l + 30 + u16(bytes, l + 26) + u16(bytes, l + 28);
    var dados = bytes.subarray(inicio, inicio + entrada.compactado);
    if (entrada.metodo === 0) return Promise.resolve(dados);
    if (entrada.metodo !== 8) return Promise.reject(new Error("zip: método " + entrada.metodo));
    var fluxo = new Blob([dados]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Response(fluxo).arrayBuffer().then(function (ab) {
      return new Uint8Array(ab);
    });
  }

  // ---------------------------------------------------------------------
  // LHA (-lh0-, -lh4-, -lh5-, -lh6-, -lh7-; cabeçalhos nível 0, 1 e 2)
  // ---------------------------------------------------------------------

  var NC = 510; // 256 literais + 256 tamanhos - 3 + 1
  var NT = 19;

  function Bits(fonte, inicio, fim) {
    this.b = fonte;
    this.p = inicio;
    this.fim = fim;
    this.buf = 0; // até 32 bits, alinhados à direita
    this.n = 0;
  }
  Bits.prototype.encher = function () {
    while (this.n <= 24) {
      var byte = this.p < this.fim ? this.b[this.p] : 0;
      this.p++;
      this.buf = ((this.buf << 8) | byte) >>> 0;
      this.n += 8;
    }
  };
  // Próximos 16 bits, sem consumir
  Bits.prototype.olhar16 = function () {
    if (this.n < 16) this.encher();
    return (this.buf >>> (this.n - 16)) & 0xffff;
  };
  Bits.prototype.pular = function (k) {
    if (this.n < k) this.encher();
    this.n -= k;
    this.buf &= this.n === 32 ? 0xffffffff : (1 << this.n) - 1 >>> 0;
  };
  Bits.prototype.ler = function (k) {
    if (k === 0) return 0;
    if (this.n < k) this.encher();
    var v = (this.buf >>> (this.n - k)) & ((1 << k) - 1);
    this.n -= k;
    this.buf &= (1 << this.n) - 1 >>> 0;
    return v;
  };

  // Tabela de decodificação de 16 bits para códigos de Huffman canônicos
  // (a mesma atribuição do make_table do LHarc: comprimento, depois símbolo)
  function Tabela(qtd) {
    this.len = new Uint8Array(qtd);
    this.sim = new Uint16Array(65536);
    this.unico = -1;
  }
  Tabela.prototype.montar = function (qtd) {
    var len = this.len;
    var inicio = 0;
    for (var bits = 1; bits <= 16; bits++) {
      var passo = 1 << (16 - bits);
      for (var s = 0; s < qtd; s++) {
        if (len[s] !== bits) continue;
        var ate = inicio + passo;
        if (ate > 65536) throw new Error("lha: tabela");
        this.sim.fill(s, inicio, ate);
        inicio = ate;
      }
    }
    if (inicio !== 65536) throw new Error("lha: tabela incompleta");
    this.unico = -1;
  };
  Tabela.prototype.constante = function (s) {
    this.len.fill(0);
    this.unico = s;
  };
  Tabela.prototype.decodificar = function (bits) {
    if (this.unico >= 0) return this.unico;
    var s = this.sim[bits.olhar16()];
    bits.pular(this.len[s]);
    return s;
  };

  function lerPtLen(bits, tab, nn, nbit, especial) {
    var n = bits.ler(nbit);
    if (n === 0) {
      tab.constante(bits.ler(nbit));
      return;
    }
    var len = tab.len;
    len.fill(0);
    var i = 0;
    while (i < n) {
      var c = bits.olhar16() >>> 13;
      if (c === 7) {
        var mascara = 1 << 12;
        var janela = bits.olhar16();
        while (janela & mascara) {
          mascara >>>= 1;
          c++;
        }
      }
      bits.pular(c < 7 ? 3 : c - 3);
      len[i++] = c;
      if (i === especial) {
        var zeros = bits.ler(2);
        while (zeros-- > 0) len[i++] = 0;
      }
    }
    tab.montar(nn);
  }

  function lerCLen(bits, tc, tt) {
    var n = bits.ler(9);
    if (n === 0) {
      tc.constante(bits.ler(9));
      return;
    }
    var len = tc.len;
    len.fill(0);
    var i = 0;
    while (i < n) {
      var c = tt.decodificar(bits);
      if (c <= 2) {
        var zeros = c === 0 ? 1 : c === 1 ? bits.ler(4) + 3 : bits.ler(9) + 20;
        while (zeros-- > 0) len[i++] = 0;
      } else {
        len[i++] = c - 2;
      }
    }
    tc.montar(NC);
  }

  function descompactarLh(fonte, inicio, fim, tamanho, dicbit) {
    var np = dicbit + 1;
    var pbit = dicbit <= 13 ? 4 : 5;
    var saida = new Uint8Array(tamanho);
    var bits = new Bits(fonte, inicio, fim);
    var tc = new Tabela(NC);
    var tt = new Tabela(NT);
    var tp = new Tabela(Math.max(np, NT));
    var pos = 0;
    var bloco = 0;
    while (pos < tamanho) {
      if (bloco === 0) {
        bloco = bits.ler(16);
        lerPtLen(bits, tt, NT, 5, 3);
        lerCLen(bits, tc, tt);
        lerPtLen(bits, tp, np, pbit, -1);
      }
      bloco--;
      var c = tc.decodificar(bits);
      if (c < 256) {
        saida[pos++] = c;
        continue;
      }
      var tam = c - 253; // c - 256 + 3
      var p = tp.decodificar(bits);
      if (p !== 0) p = (1 << (p - 1)) + bits.ler(p - 1);
      var de = pos - p - 1;
      if (de < 0) throw new Error("lha: distância");
      if (tam > tamanho - pos) tam = tamanho - pos;
      for (var k = 0; k < tam; k++) saida[pos++] = saida[de + k];
    }
    return saida;
  }

  var DICBIT = { "-lh4-": 12, "-lh5-": 13, "-lh6-": 15, "-lh7-": 16 };

  // Há um cabeçalho LHA em p? Método "-l??-", nível 0 a 2 e, nos níveis 0
  // e 1, a soma de verificação do cabeçalho (evita achar um no meio dos dados)
  function cabecalhoLha(b, p) {
    if (p + 24 > b.length) return false;
    if (b[p + 2] !== 0x2d || b[p + 3] !== 0x6c || b[p + 6] !== 0x2d) return false;
    var nivel = b[p + 20];
    if (nivel === 0 || nivel === 1) {
      var tam = b[p];
      if (tam < 20 || p + 2 + tam > b.length) return false;
      var soma = 0;
      for (var i = p + 2; i < p + 2 + tam; i++) soma = (soma + b[i]) & 0xff;
      return soma === b[p + 1];
    }
    return nivel === 2 && u16(b, p) >= 26;
  }

  // O resource.1 do quake106.zip não começa direto no primeiro cabeçalho:
  // como o lha do Unix, procura o próximo cabeçalho válido a partir de p
  function proximoCabecalho(b, p) {
    for (; p + 24 <= b.length; p++) {
      if (cabecalhoLha(b, p)) return p;
    }
    return -1;
  }

  // Percorre o arquivo LHA e devolve o primeiro arquivo cujo nome bate
  function extrairLha(b, combina) {
    var p = 0;
    var latin1 = new TextDecoder("latin1");
    for (;;) {
      if (!cabecalhoLha(b, p)) {
        // Bytes que não são cabeçalho (ou o 0 do fim): procura o próximo
        p = proximoCabecalho(b, p + 1);
        if (p < 0) break;
      }
      var nivel = b[p + 20];
      var metodo = latin1.decode(b.subarray(p + 2, p + 7));
      var compactado = u32(b, p + 7);
      var tamanho = u32(b, p + 11);
      var nome = "";
      var dir = "";
      var dados;
      var ext;
      if (nivel === 0 || nivel === 1) {
        var tamCab = b[p] + 2;
        var tamNome = b[p + 21];
        nome = latin1.decode(b.subarray(p + 22, p + 22 + tamNome));
        dados = p + tamCab;
        if (nivel === 1) {
          // Cabeçalhos estendidos depois do básico; o "compactado" os inclui
          ext = u16(b, p + tamCab - 2);
          var q = dados;
          while (ext > 0) {
            if (b[q] === 0x01) nome = latin1.decode(b.subarray(q + 1, q + ext - 2));
            if (b[q] === 0x02) dir = latin1.decode(b.subarray(q + 1, q + ext - 2));
            compactado -= ext;
            q += ext;
            ext = u16(b, q - 2);
          }
          dados = q;
        }
      } else if (nivel === 2) {
        var total = u16(b, p);
        ext = u16(b, p + 24);
        var r = p + 26;
        while (ext > 0) {
          if (b[r] === 0x01) nome = latin1.decode(b.subarray(r + 1, r + ext - 2));
          if (b[r] === 0x02) dir = latin1.decode(b.subarray(r + 1, r + ext - 2));
          r += ext;
          ext = u16(b, r - 2);
        }
        dados = p + total;
      } else {
        throw new Error("lha: cabeçalho nível " + nivel);
      }
      var caminho = (dir + (dir ? "/" : "") + nome).replace(/[\\\xff]/g, "/");
      if (combina(caminho)) {
        if (metodo === "-lh0-" || metodo === "-lz4-") return b.slice(dados, dados + tamanho);
        if (!(metodo in DICBIT)) throw new Error("lha: método " + metodo);
        return descompactarLh(b, dados, dados + compactado, tamanho, DICBIT[metodo]);
      }
      p = dados + compactado;
    }
    return null;
  }

  // ---------------------------------------------------------------------
  // Dados do jogo
  // ---------------------------------------------------------------------

  var ehPak = function (b) {
    return b.length > 12 && b[0] === 0x50 && b[1] === 0x41 && b[2] === 0x43 && b[3] === 0x4b; // PACK
  };
  var ehZip = function (b) {
    return b.length > 22 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04; // PK..
  };
  var ehPak0 = function (caminho) {
    return /(^|\/)pak0\.pak$/i.test(caminho);
  };

  // quake106.zip, resource.1 ou o próprio pak0.pak → pak0.pak
  function pakDe(bytes) {
    if (ehPak(bytes)) return Promise.resolve(bytes);
    if (!ehZip(bytes)) {
      // resource.1 solto (LHA)
      var pak = extrairLha(bytes, ehPak0);
      return pak ? Promise.resolve(pak) : Promise.reject(new Error(TXT.invalido));
    }
    var entradas = listarZip(bytes);
    var direto = entradas.find(function (e) {
      return ehPak0(e.nome);
    });
    if (direto) return lerDoZip(bytes, direto);
    var resource = entradas.find(function (e) {
      return /(^|\/)resource\.1$/i.test(e.nome);
    });
    if (!resource) return Promise.reject(new Error(TXT.invalido));
    return lerDoZip(bytes, resource).then(function (lha) {
      status(TXT.extraindo);
      // Deixa a tela atualizar antes do trabalho pesado (~18 MB)
      return new Promise(function (ok) {
        setTimeout(ok, 30);
      }).then(function () {
        var pak = extrairLha(lha, ehPak0);
        if (!pak) throw new Error(TXT.invalido);
        return pak;
      });
    });
  }

  // Baixa com progresso; devolve null se o arquivo não existir no servidor
  // (o servidor de SPA pode responder 200 com o index.html: por isso a
  // assinatura é conferida por quem chama)
  function baixar(url, rotulo) {
    return fetch(url).then(function (r) {
      if (!r.ok || /text\/html/i.test(r.headers.get("content-type") || "")) return null;
      var total = Number(r.headers.get("content-length")) || 0;
      if (!r.body || !total) {
        return r.arrayBuffer().then(function (ab) {
          return new Uint8Array(ab);
        });
      }
      var leitor = r.body.getReader();
      var pedacos = [];
      var recebido = 0;
      function proximo() {
        return leitor.read().then(function (parte) {
          if (parte.done) {
            var tudo = new Uint8Array(recebido);
            var o = 0;
            pedacos.forEach(function (p) {
              tudo.set(p, o);
              o += p.length;
            });
            return tudo;
          }
          pedacos.push(parte.value);
          recebido += parte.value.length;
          status(rotulo + " · " + Math.round((recebido / total) * 100) + "%", recebido / total);
          return proximo();
        });
      }
      return proximo();
    });
  }

  function dadosDoServidor() {
    status(TXT.baixando, 0);
    return baixar("quake106.zip", TXT.baixando)
      .catch(function () {
        return null;
      })
      .then(function (zip) {
        if (zip && ehZip(zip)) return pakDe(zip);
        return baixar("pak0.pak", "pak0.pak")
          .catch(function () {
            return null;
          })
          .then(function (pak) {
            return pak && ehPak(pak) ? pak : null;
          });
      });
  }

  // Sem dados no servidor: o visitante escolhe o arquivo
  function dadosDoVisitante() {
    return new Promise(function (ok) {
      var caixa = $("escolha");
      var input = $("arquivo");
      var erro = $("erro-arquivo");
      $("texto-escolha").textContent = TXT.semDados;
      $("botao-arquivo").textContent = TXT.escolher;
      caixa.hidden = false;
      status("");
      $("botao-arquivo").onclick = function () {
        input.click();
      };
      input.onchange = function () {
        var f = input.files && input.files[0];
        if (!f) return;
        erro.textContent = "";
        f.arrayBuffer()
          .then(function (ab) {
            status(TXT.extraindo);
            return pakDe(new Uint8Array(ab));
          })
          .then(function (pak) {
            caixa.hidden = true;
            ok(pak);
          })
          .catch(function (e) {
            status("");
            erro.textContent = e.message || TXT.invalido;
            input.value = "";
          });
      };
    });
  }

  // ---------------------------------------------------------------------
  // Motor
  // ---------------------------------------------------------------------

  var prontoMotor;
  var motorPronto = new Promise(function (ok) {
    prontoMotor = ok;
  });

  function travarMouse() {
    if (document.pointerLockElement !== canvas) {
      try {
        var r = canvas.requestPointerLock();
        if (r && r.catch) r.catch(function () {});
      } catch {
        /* sem pointer lock (ex.: sandbox) */
      }
    }
  }

  window.Module = {
    canvas: canvas,
    print: function (t) {
      console.log(t);
    },
    printErr: function (t) {
      console.warn(t);
    },
    setStatus: function () {},
    onRuntimeInitialized: function () {
      prontoMotor();
    },
    // Chamados pelo motor (sys_sdl.c, host.c, view.c, cl_demo.c)
    hideConsole: function () {
      $("tela").hidden = true;
      canvas.hidden = false;
      $("dica").hidden = false;
      canvas.focus();
    },
    showConsole: function () {
      // "quit" no console do Quake: volta ao terminal
      if (document.pointerLockElement) document.exitPointerLock();
      avisarPai("sair");
    },
    captureMouse: function () {
      /* o pointer lock só vale depois de um clique (ver abaixo) */
    },
    setGamma: function (g) {
      g = Number(Number(g).toFixed(2));
      canvas.style.filter = "brightness(" + (1.35 - g) * 2 + ")";
    },
    exportFile: function (caminho) {
      try {
        var dados = window.FS.readFile(caminho);
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([dados]));
        a.download = caminho.split("/").pop();
        a.click();
        setTimeout(function () {
          URL.revokeObjectURL(a.href);
        }, 1000);
      } catch (e) {
        console.error(e);
      }
    },
  };

  canvas.addEventListener("click", function () {
    travarMouse();
    $("dica").hidden = true;
  });
  canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  document.addEventListener("pointerlockchange", function () {
    avisarPai(document.pointerLockElement ? "mouse-travado" : "mouse-livre");
  });

  $("dica").textContent = TXT.clique + " — " + TXT.dica;
  if (matchMedia("(pointer: coarse)").matches) $("aviso-celular").textContent = TXT.celular;

  status(TXT.motor);
  var script = document.createElement("script");
  script.src = "quake.js";
  script.onerror = function () {
    status(TXT.erro + "quake.js");
  };
  document.body.appendChild(script);

  dadosDoServidor()
    .then(function (pak) {
      return pak || dadosDoVisitante();
    })
    .then(function (pak) {
      status(TXT.iniciando);
      return motorPronto.then(function () {
        var FS = window.Module.FS || window.FS;
        try {
          FS.mkdir("/id1");
        } catch {
          /* já existe (cfgs embutidos) */
        }
        FS.writeFile("/id1/pak0.pak", pak);
        avisarPai("iniciado");
        window.Module.ccall("qstart", "number", ["string"], [ARGS]);
      });
    })
    .catch(function (e) {
      console.error(e);
      status(TXT.erro + (e && e.message ? e.message : e));
    });
})();
