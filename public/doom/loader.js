/*
 * Carregador do Doom (comando "jogo --doom" ou "doom").
 *
 * O motor (doom.wasm) é o doomgeneric, um Chocolate Doom enxuto, compilado
 * para WebAssembly/WASI (ver scripts/doom). Não há Emscripten: este arquivo
 * faz o papel dele, com um WASI mínimo (arquivos em memória, stdout e
 * stderr) e a plataforma do jogo (doomgeneric_web.c): o quadro de 320x200
 * vai para o <canvas>, os efeitos sonoros do WAD tocam no Web Audio, a
 * música sai do chip OPL emulado no motor (opl_web.c) e o teclado e o mouse
 * voltam para o motor.
 *
 * Dados do jogo: ./doom1.wad (Doom shareware 1.9, da id Software, servido
 * sem modificação). Se não estiver no servidor, o visitante pode escolher o
 * doom1.wad, o doom.wad ou o doom2.wad no computador.
 *
 * Os jogos salvos e a configuração ficam no IndexedDB do navegador.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var EN = (params.get("lang") || "").toLowerCase().indexOf("en") === 0;

  var TXT = EN
    ? {
        motor: "Loading engine...",
        baixando: "Downloading doom1.wad",
        iniciando: "Starting...",
        semDados:
          "Shareware data not found on the server. Choose doom1.wad (Doom shareware), doom.wad or doom2.wad on your computer:",
        escolher: "Choose file",
        invalido: "This file is not a Doom IWAD (doom1.wad, doom.wad or doom2.wad).",
        erro: "Could not start Doom: ",
        clique: "Click to play",
        dica: "WASD moves · Mouse turns · Click shoots · Space opens doors · Esc menu",
        celular: "Doom needs a keyboard (and a mouse helps).",
      }
    : {
        motor: "Carregando o motor...",
        baixando: "Baixando doom1.wad",
        iniciando: "Iniciando...",
        semDados:
          "Os dados do shareware não estão no servidor. Escolha o doom1.wad (Doom shareware), o doom.wad ou o doom2.wad no seu computador:",
        escolher: "Escolher arquivo",
        invalido: "Esse arquivo não é um IWAD do Doom (doom1.wad, doom.wad ou doom2.wad).",
        erro: "Não foi possível iniciar o Doom: ",
        clique: "Clique para jogar",
        dica: "WASD anda · Mouse vira · Clique atira · Espaço abre portas · Esc menu",
        celular: "O Doom precisa de teclado (e o mouse ajuda).",
      };

  var TICRATE = 35;
  // Pixels de mouse → unidades do Doom (a sensibilidade do menu vale por cima)
  var MOUSE_ESCALA = 4;

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
      parent.postMessage({ origem: "doom", tipo: tipo }, location.origin);
    } catch {
      /* fora de um iframe */
    }
  }

  // ---------------------------------------------------------------------
  // Jogos salvos e configuração (IndexedDB)
  // ---------------------------------------------------------------------

  var IDB_NOME = "portfolio-doom";
  var IDB_LOJA = "arquivos";

  function abrirIdb() {
    return new Promise(function (ok) {
      try {
        var req = indexedDB.open(IDB_NOME, 1);
        req.onupgradeneeded = function () {
          req.result.createObjectStore(IDB_LOJA);
        };
        req.onsuccess = function () {
          ok(req.result);
        };
        req.onerror = function () {
          ok(null);
        };
      } catch {
        ok(null); // navegação privada ou IndexedDB bloqueado
      }
    });
  }
  var idb = abrirIdb();

  function salvosCarregar() {
    return idb.then(function (db) {
      if (!db) return {};
      return new Promise(function (ok) {
        var tudo = {};
        try {
          var req = db.transaction(IDB_LOJA).objectStore(IDB_LOJA).openCursor();
          req.onsuccess = function () {
            var c = req.result;
            if (!c) return ok(tudo);
            tudo[c.key] = new Uint8Array(c.value);
            c.continue();
          };
          req.onerror = function () {
            ok(tudo);
          };
        } catch {
          ok(tudo);
        }
      });
    });
  }

  function salvoGravar(caminho, dados) {
    idb.then(function (db) {
      if (!db) return;
      try {
        db.transaction(IDB_LOJA, "readwrite").objectStore(IDB_LOJA).put(dados.slice(), caminho);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  function salvoApagar(caminho) {
    idb.then(function (db) {
      if (!db) return;
      try {
        db.transaction(IDB_LOJA, "readwrite").objectStore(IDB_LOJA).delete(caminho);
      } catch {
        /* nada a fazer */
      }
    });
  }

  // ---------------------------------------------------------------------
  // WASI mínimo: só as chamadas que o doom.wasm importa
  // ---------------------------------------------------------------------

  var E = { OK: 0, BADF: 8, EXIST: 20, INVAL: 28, ISDIR: 31, NOENT: 44, NOTDIR: 54 };

  function Saida(codigo) {
    this.codigo = codigo;
  }

  function criarWasi(arquivos, iwads) {
    var memoria = null;
    var dirs = { "": true };
    var fds = [];
    fds[3] = { dir: true, caminho: "" }; // a raiz, "pré-aberta"
    var linhas = { 1: "", 2: "" };
    var ultimoErro = "";

    var dv = function () {
      return new DataView(memoria.buffer);
    };
    var bytes = function () {
      return new Uint8Array(memoria.buffer);
    };
    var texto = function (p, n) {
      return new TextDecoder().decode(bytes().subarray(p, p + n));
    };
    // Normaliza "./a//b" → "a/b" (sem barra no começo)
    var normal = function (base, rel) {
      var partes = (base ? base + "/" : "").concat(rel).split("/");
      var r = [];
      partes.forEach(function (p) {
        if (!p || p === ".") return;
        if (p === "..") r.pop();
        else r.push(p);
      });
      return r.join("/");
    };
    var novoFd = function (obj) {
      var fd = 4;
      while (fds[fd]) fd++;
      fds[fd] = obj;
      return fd;
    };
    // Só os jogos salvos e a configuração vão para o IndexedDB (o IWAD e o
    // MIDI temporário da música, em tmp/, ficam de fora)
    var persistente = function (caminho) {
      return iwads.indexOf(caminho) < 0 && !/^tmp\//.test(caminho);
    };

    var api = {
      fd_close: function (fd) {
        var f = fds[fd];
        if (!f) return E.BADF;
        if (f.sujo && persistente(f.caminho)) salvoGravar(f.caminho, arquivos[f.caminho]);
        delete fds[fd];
        return E.OK;
      },
      fd_fdstat_get: function (fd, p) {
        var f = fd <= 2 ? { tty: true } : fds[fd];
        if (!f) return E.BADF;
        var d = dv();
        d.setUint8(p, f.tty ? 2 : f.dir ? 3 : 4);
        d.setUint16(p + 2, 0, true);
        d.setBigUint64(p + 8, 0xffffffffffffffffn, true);
        d.setBigUint64(p + 16, 0xffffffffffffffffn, true);
        return E.OK;
      },
      fd_fdstat_set_flags: function () {
        return E.OK;
      },
      fd_prestat_get: function (fd, p) {
        if (fd !== 3) return E.BADF;
        dv().setUint32(p, 0, true);
        dv().setUint32(p + 4, 1, true);
        return E.OK;
      },
      fd_prestat_dir_name: function (fd, p, n) {
        if (fd !== 3) return E.BADF;
        if (n >= 1) bytes()[p] = 0x2f; // "/"
        return E.OK;
      },
      fd_read: function (fd, iovs, n, lidos) {
        var f = fds[fd];
        if (fd === 0) {
          dv().setUint32(lidos, 0, true);
          return E.OK;
        }
        if (!f || f.dir) return E.BADF;
        var dados = arquivos[f.caminho];
        var d = dv();
        var total = 0;
        for (var i = 0; i < n; i++) {
          var ptr = d.getUint32(iovs + i * 8, true);
          var len = d.getUint32(iovs + i * 8 + 4, true);
          var parte = dados.subarray(f.pos, Math.min(f.pos + len, f.tam));
          bytes().set(parte, ptr);
          f.pos += parte.length;
          total += parte.length;
          if (parte.length < len) break;
        }
        dv().setUint32(lidos, total, true);
        return E.OK;
      },
      fd_write: function (fd, iovs, n, escritos) {
        var d = dv();
        var total = 0;
        var i, ptr, len;
        if (fd === 1 || fd === 2) {
          for (i = 0; i < n; i++) {
            ptr = d.getUint32(iovs + i * 8, true);
            len = d.getUint32(iovs + i * 8 + 4, true);
            linhas[fd] += texto(ptr, len);
            total += len;
          }
          var partes = linhas[fd].split("\n");
          linhas[fd] = partes.pop();
          partes.forEach(function (l) {
            if (fd === 2) {
              if (l.trim()) ultimoErro = l.trim();
              console.warn(l);
            } else {
              console.log(l);
            }
          });
          dv().setUint32(escritos, total, true);
          return E.OK;
        }
        var f = fds[fd];
        if (!f || f.dir) return E.BADF;
        for (i = 0; i < n; i++) {
          ptr = d.getUint32(iovs + i * 8, true);
          len = d.getUint32(iovs + i * 8 + 4, true);
          var fim = f.pos + len;
          var atual = arquivos[f.caminho];
          if (fim > atual.length) {
            var maior = new Uint8Array(Math.max(fim, atual.length * 2, 4096));
            maior.set(atual.subarray(0, f.tam));
            arquivos[f.caminho] = atual = maior;
          }
          atual.set(bytes().subarray(ptr, ptr + len), f.pos);
          f.pos = fim;
          if (fim > f.tam) f.tam = fim;
          total += len;
        }
        // Mantém o tamanho real (o buffer cresce em dobro)
        arquivos[f.caminho] = arquivos[f.caminho].subarray(0, f.tam);
        f.sujo = true;
        dv().setUint32(escritos, total, true);
        return E.OK;
      },
      fd_seek: function (fd, offset, whence, novo) {
        var f = fds[fd];
        if (!f || f.dir) return E.BADF;
        var base = whence === 0 ? 0 : whence === 1 ? f.pos : f.tam;
        var pos = base + Number(offset);
        if (pos < 0) return E.INVAL;
        f.pos = pos;
        dv().setBigUint64(novo, BigInt(pos), true);
        return E.OK;
      },
      path_open: function (dirfd, _dflags, p, n, oflags, _rb, _ri, _fdflags, fdOut) {
        var base = fds[dirfd];
        if (!base || !base.dir) return E.BADF;
        var caminho = normal(base.caminho, texto(p, n));
        var CREAT = 1;
        var DIRECTORY = 2;
        var EXCL = 4;
        var TRUNC = 8;
        if (dirs[caminho]) {
          dv().setUint32(fdOut, novoFd({ dir: true, caminho: caminho }), true);
          return E.OK;
        }
        if (oflags & DIRECTORY) return arquivos[caminho] ? E.NOTDIR : E.NOENT;
        var existe = caminho in arquivos;
        if (existe && oflags & EXCL && oflags & CREAT) return E.EXIST;
        if (!existe && !(oflags & CREAT)) return E.NOENT;
        if (!existe || oflags & TRUNC) arquivos[caminho] = new Uint8Array(0);
        var fd = novoFd({
          caminho: caminho,
          pos: 0,
          tam: arquivos[caminho].length,
          sujo: !existe || !!(oflags & TRUNC),
        });
        dv().setUint32(fdOut, fd, true);
        return E.OK;
      },
      path_create_directory: function (dirfd, p, n) {
        var base = fds[dirfd];
        if (!base || !base.dir) return E.BADF;
        var caminho = normal(base.caminho, texto(p, n));
        if (dirs[caminho] || caminho in arquivos) return E.EXIST;
        dirs[caminho] = true;
        return E.OK;
      },
      path_remove_directory: function (dirfd, p, n) {
        var base = fds[dirfd];
        if (!base || !base.dir) return E.BADF;
        var caminho = normal(base.caminho, texto(p, n));
        if (!dirs[caminho]) return E.NOENT;
        delete dirs[caminho];
        return E.OK;
      },
      path_unlink_file: function (dirfd, p, n) {
        var base = fds[dirfd];
        if (!base || !base.dir) return E.BADF;
        var caminho = normal(base.caminho, texto(p, n));
        if (dirs[caminho]) return E.ISDIR;
        if (!(caminho in arquivos)) return E.NOENT;
        delete arquivos[caminho];
        salvoApagar(caminho);
        return E.OK;
      },
      path_rename: function (fd1, p1, n1, fd2, p2, n2) {
        var b1 = fds[fd1];
        var b2 = fds[fd2];
        if (!b1 || !b2) return E.BADF;
        var de = normal(b1.caminho, texto(p1, n1));
        var para = normal(b2.caminho, texto(p2, n2));
        if (!(de in arquivos)) return E.NOENT;
        arquivos[para] = arquivos[de];
        delete arquivos[de];
        salvoApagar(de);
        if (persistente(para)) salvoGravar(para, arquivos[para]);
        return E.OK;
      },
      proc_exit: function (codigo) {
        throw new Saida(codigo);
      },
      random_get: function (p, n) {
        crypto.getRandomValues(bytes().subarray(p, p + n));
        return E.OK;
      },
      // Sem variáveis de ambiente (o opl.c procura OPL_DRIVER)
      environ_sizes_get: function (qtd, tam) {
        dv().setUint32(qtd, 0, true);
        dv().setUint32(tam, 0, true);
        return E.OK;
      },
      environ_get: function () {
        return E.OK;
      },
    };

    // Pastas dos arquivos que vieram do IndexedDB (ex.: .savegame/)
    Object.keys(arquivos).forEach(function (c) {
      var partes = c.split("/");
      for (var i = 1; i < partes.length; i++) dirs[partes.slice(0, i).join("/")] = true;
    });

    return {
      api: api,
      ligar: function (mem) {
        memoria = mem;
      },
      ultimoErro: function () {
        return ultimoErro;
      },
    };
  }

  // ---------------------------------------------------------------------
  // Som: efeitos DMX do WAD (PCM 8 bits) no Web Audio
  // ---------------------------------------------------------------------

  // O navegador só libera o áudio depois de um clique ou tecla: o contexto
  // nasce aí (até lá, os efeitos são ignorados)
  var audio = null;
  function liberarAudio() {
    if (!audio) {
      try {
        audio = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return;
      }
    }
    if (audio.state === "suspended") audio.resume().catch(function () {});
  }

  // Música: o motor gera o áudio do chip OPL (estéreo, 16 bits) em blocos;
  // cada quadro agenda blocos suficientes para ~0,25 s à frente
  var MUSICA_BLOCO = 2048;
  var MUSICA_FOLGA = 0.25;
  var pararMusica = function () {};

  var sons = {}; // lump → AudioBuffer
  var canais = []; // canal → { fonte, ganho, pan }

  function decodificarDmx(dados, lump) {
    if (lump in sons) return sons[lump];
    var buf = null;
    if (audio && dados.length > 8 && (dados[0] | (dados[1] << 8)) === 3) {
      var taxa = dados[2] | (dados[3] << 8);
      var tam = (dados[4] | (dados[5] << 8) | (dados[6] << 16) | (dados[7] << 24)) >>> 0;
      // Como no Chocolate Doom: 16 bytes de enchimento em cada ponta
      if (tam <= dados.length - 8 && tam > 48) {
        var amostras = dados.subarray(8 + 16, 8 + tam - 16);
        try {
          buf = audio.createBuffer(1, amostras.length, taxa);
          var canal = buf.getChannelData(0);
          for (var i = 0; i < amostras.length; i++) canal[i] = (amostras[i] - 128) / 128;
        } catch {
          buf = null;
        }
      }
    }
    sons[lump] = buf;
    return buf;
  }

  function ajustarCanal(c, vol, sep) {
    c.ganho.gain.value = Math.max(0, Math.min(127, vol)) / 127;
    if (c.pan) c.pan.pan.value = Math.max(-1, Math.min(1, (sep - 127) / 127));
  }

  function pararCanal(n) {
    var c = canais[n];
    if (!c) return;
    canais[n] = null;
    try {
      c.fonte.onended = null;
      c.fonte.stop();
    } catch {
      /* já parou */
    }
  }

  // ---------------------------------------------------------------------
  // Teclado → códigos do Doom (doomkeys.h), pela posição da tecla
  // (e.code): WASD e atalhos ficam no lugar em qualquer layout (ABNT, US...)
  // ---------------------------------------------------------------------

  var TECLAS = {
    ArrowUp: 0xad,
    ArrowDown: 0xaf,
    ArrowLeft: 0xac,
    ArrowRight: 0xae,
    Enter: 13,
    NumpadEnter: 13,
    Escape: 27,
    Tab: 9,
    Backspace: 0x7f,
    Space: 32,
    ControlLeft: 0xa3,
    ControlRight: 0xa3,
    ShiftLeft: 0x80 + 0x36,
    ShiftRight: 0x80 + 0x36,
    AltLeft: 0x80 + 0x38,
    AltRight: 0x80 + 0x38,
    Pause: 0xff,
    CapsLock: 0x80 + 0x3a,
    Home: 0x80 + 0x47,
    End: 0x80 + 0x4f,
    PageUp: 0x80 + 0x49,
    PageDown: 0x80 + 0x51,
    Insert: 0x80 + 0x52,
    Delete: 0x80 + 0x53,
    Minus: 0x2d,
    NumpadSubtract: 0x2d,
    Equal: 0x3d,
    NumpadAdd: 0x3d,
    Comma: 0x2c,
    Period: 0x2e,
    Slash: 0x2f,
    Semicolon: 0x3b,
    Quote: 0x27,
    BracketLeft: 0x5b,
    BracketRight: 0x5d,
    Backslash: 0x5c,
    Backquote: 0x60,
    F1: 0x80 + 0x3b,
    F2: 0x80 + 0x3c,
    F3: 0x80 + 0x3d,
    F4: 0x80 + 0x3e,
    F5: 0x80 + 0x3f,
    F6: 0x80 + 0x40,
    F7: 0x80 + 0x41,
    F8: 0x80 + 0x42,
    F9: 0x80 + 0x43,
    F10: 0x80 + 0x44,
    F11: 0x80 + 0x57,
    F12: 0x80 + 0x58,
  };

  function teclaDoom(e) {
    if (e.code in TECLAS) return TECLAS[e.code];
    var m = /^Key([A-Z])$/.exec(e.code);
    if (m) return m[1].toLowerCase().charCodeAt(0);
    m = /^(?:Digit|Numpad)([0-9])$/.exec(e.code);
    if (m) return m[1].charCodeAt(0);
    return 0;
  }

  // ---------------------------------------------------------------------
  // Dados do jogo
  // ---------------------------------------------------------------------

  // IWAD e se é o Doom II (tem MAP01): devolve null se não for um IWAD
  function lerIwad(b) {
    if (b.length < 12 || b[0] !== 0x49 || b[1] !== 0x57 || b[2] !== 0x41 || b[3] !== 0x44) {
      return null; // "IWAD"
    }
    var dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    var qtd = dv.getInt32(4, true);
    var dir = dv.getInt32(8, true);
    if (qtd <= 0 || dir < 12 || dir + qtd * 16 > b.length) return null;
    var doom2 = false;
    for (var i = 0; i < qtd && !doom2; i++) {
      var p = dir + i * 16 + 8;
      doom2 =
        b[p] === 0x4d && b[p + 1] === 0x41 && b[p + 2] === 0x50 && b[p + 3] === 0x30 && b[p + 4] === 0x31; // MAP01
    }
    return { dados: b, doom2: doom2 };
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
    return baixar("doom1.wad", TXT.baixando)
      .catch(function () {
        return null;
      })
      .then(function (b) {
        return b ? lerIwad(b) : null;
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
        f.arrayBuffer().then(function (ab) {
          var iwad = lerIwad(new Uint8Array(ab));
          if (!iwad) {
            erro.textContent = TXT.invalido;
            input.value = "";
            return;
          }
          caixa.hidden = true;
          ok(iwad);
        });
      };
    });
  }

  // ---------------------------------------------------------------------
  // Motor
  // ---------------------------------------------------------------------

  var motor = fetch("doom.wasm").then(function (r) {
    if (!r.ok) throw new Error("doom.wasm");
    return WebAssembly.compileStreaming
      ? WebAssembly.compileStreaming(r).catch(function () {
          return fetch("doom.wasm")
            .then(function (r2) {
              return r2.arrayBuffer();
            })
            .then(function (ab) {
              return WebAssembly.compile(ab);
            });
        })
      : r.arrayBuffer().then(function (ab) {
          return WebAssembly.compile(ab);
        });
  });

  var ctx = canvas.getContext("2d", { alpha: false });
  var imagem = null;
  var exp = null;
  var rodando = false;
  var inicio = performance.now();

  function agora() {
    return Math.floor(performance.now() - inicio);
  }

  // "Quit Game" no menu (ver ao_sair no doomgeneric_web.c): para o motor
  // ali mesmo, com a exceção de saída, e volta ao terminal
  function sair() {
    if (rodando) {
      rodando = false;
      if (document.pointerLockElement) document.exitPointerLock();
      for (var i = 0; i < canais.length; i++) pararCanal(i);
      pararMusica();
      avisarPai("sair");
    }
    throw new Saida(0);
  }

  function falhou(e, wasi) {
    rodando = false;
    pararMusica();
    if (document.pointerLockElement) document.exitPointerLock();
    var msg = (wasi && wasi.ultimoErro()) || (e && e.message) || String(e);
    console.error(e);
    canvas.hidden = true;
    $("dica").hidden = true;
    $("tela").hidden = false;
    status(TXT.erro + msg);
  }

  function iniciar(iwad, salvos) {
    var nome = iwad.doom2 ? "doom2.wad" : "doom1.wad";
    var arquivos = salvos;
    arquivos[nome] = iwad.dados;
    var wasi = criarWasi(arquivos, [nome]);
    var memoria;

    var plataforma = {
      desenhar: function (p, larg, alt) {
        if (!imagem || imagem.width !== larg || imagem.height !== alt) {
          canvas.width = larg;
          canvas.height = alt;
          imagem = ctx.createImageData(larg, alt);
        }
        // XRGB (0x00RRGGBB) → RGBA
        var src = new Uint32Array(memoria.buffer, p, larg * alt);
        var dst = new Uint32Array(imagem.data.buffer);
        for (var i = 0; i < src.length; i++) {
          var v = src[i];
          dst[i] = 0xff000000 | ((v & 0xff) << 16) | (v & 0xff00) | ((v >>> 16) & 0xff);
        }
        ctx.putImageData(imagem, 0, 0);
      },
      agora: agora,
      titulo: function () {},
      sair: sair,
      som_tocar: function (canal, p, tam, lump, vol, sep) {
        pararCanal(canal);
        if (!audio) return;
        var buf = decodificarDmx(new Uint8Array(memoria.buffer, p, tam), lump);
        if (!buf) return;
        var fonte = audio.createBufferSource();
        fonte.buffer = buf;
        var ganho = audio.createGain();
        var pan = audio.createStereoPanner ? audio.createStereoPanner() : null;
        fonte.connect(ganho);
        if (pan) {
          ganho.connect(pan);
          pan.connect(audio.destination);
        } else {
          ganho.connect(audio.destination);
        }
        var c = { fonte: fonte, ganho: ganho, pan: pan };
        ajustarCanal(c, vol, sep);
        fonte.onended = function () {
          if (canais[canal] === c) canais[canal] = null;
        };
        canais[canal] = c;
        fonte.start();
      },
      som_ajustar: function (canal, vol, sep) {
        if (canais[canal]) ajustarCanal(canais[canal], vol, sep);
      },
      som_parar: pararCanal,
      som_tocando: function (canal) {
        return canais[canal] ? 1 : 0;
      },
    };

    var musica = { proximo: 0, fontes: [], ganho: null };

    function tocarMusica() {
      if (!audio || audio.state !== "running") return;
      var taxa = exp.dg_musica_taxa();
      if (!taxa) return;
      if (!musica.ganho) {
        musica.ganho = audio.createGain();
        // O OPL emulado sai baixo perto dos efeitos (PCM em escala cheia)
        musica.ganho.gain.value = 3;
        musica.ganho.connect(audio.destination);
      }
      var t = audio.currentTime;
      // Ficou para trás (aba em segundo plano, engasgo): recomeça já
      if (musica.proximo < t + 0.02) musica.proximo = t + 0.05;
      while (musica.proximo < t + MUSICA_FOLGA) {
        var p = exp.dg_musica(MUSICA_BLOCO);
        if (!p) return;
        var pcm = new Int16Array(memoria.buffer, p, MUSICA_BLOCO * 2);
        var buf = audio.createBuffer(2, MUSICA_BLOCO, taxa);
        var esq = buf.getChannelData(0);
        var dir = buf.getChannelData(1);
        for (var i = 0; i < MUSICA_BLOCO; i++) {
          esq[i] = pcm[2 * i] / 32768;
          dir[i] = pcm[2 * i + 1] / 32768;
        }
        var fonte = audio.createBufferSource();
        fonte.buffer = buf;
        fonte.connect(musica.ganho);
        fonte.start(musica.proximo);
        musica.proximo += MUSICA_BLOCO / taxa;
        musica.fontes.push(fonte);
        fonte.onended = function () {
          musica.fontes.shift();
        };
      }
    }

    pararMusica = function () {
      musica.fontes.forEach(function (f) {
        try {
          f.onended = null;
          f.stop();
        } catch {
          /* já parou */
        }
      });
      musica.fontes = [];
    };

    return motor.then(function (modulo) {
      return WebAssembly.instantiate(modulo, {
        wasi_snapshot_preview1: wasi.api,
        doom: plataforma,
      }).then(function (inst) {
        exp = inst.exports;
        memoria = exp.memory;
        wasi.ligar(memoria);

        $("tela").hidden = true;
        canvas.hidden = false;
        $("dica").hidden = false;
        canvas.focus();
        avisarPai("iniciado");

        rodando = true;
        try {
          exp._initialize();
          exp.dg_iniciar(iwad.doom2 ? 1 : 0);
        } catch (e) {
          if (e instanceof Saida) return falhou(e, wasi);
          throw e;
        }

        // Um tic por vez, no ritmo do Doom (35 por segundo): o motor não
        // fica esperando dentro do wasm e a página segue leve
        var ultimoTic = Math.floor((agora() * TICRATE) / 1000);
        function quadro() {
          if (!rodando) return;
          var tic = Math.floor((agora() * TICRATE) / 1000);
          try {
            if (tic !== ultimoTic) {
              ultimoTic = tic;
              exp.dg_tick();
            }
            if (rodando) tocarMusica();
          } catch (e) {
            if (e instanceof Saida && e.codigo === 0 && !rodando) return;
            return falhou(e, wasi);
          }
          requestAnimationFrame(quadro);
        }
        requestAnimationFrame(quadro);
      });
    });
  }

  // ---------------------------------------------------------------------
  // Entrada: teclado, mouse (pointer lock) e foco
  // ---------------------------------------------------------------------

  var ultimoEsc = 0;

  function tecla(e, pressionada) {
    liberarAudio();
    if (!exp || !rodando) return;
    var k = teclaDoom(e);
    if (!k) return;
    e.preventDefault();
    if (k === 27 && pressionada) ultimoEsc = performance.now();
    if (pressionada && e.repeat) return; // o Doom repete sozinho onde precisa
    exp.dg_tecla(pressionada ? 1 : 0, k);
  }
  window.addEventListener("keydown", function (e) {
    tecla(e, true);
  });
  window.addEventListener("keyup", function (e) {
    tecla(e, false);
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

  var botoes = 0;
  function mouse(e, dx) {
    if (!exp || !rodando || document.pointerLockElement !== canvas) return;
    // e.buttons: 1 esquerdo, 2 direito, 4 meio, na ordem do Doom
    botoes = e.buttons & 7;
    exp.dg_mouse(botoes, dx);
  }
  canvas.addEventListener("mousemove", function (e) {
    mouse(e, Math.round((e.movementX || 0) * MOUSE_ESCALA));
  });
  canvas.addEventListener("mousedown", function (e) {
    liberarAudio();
    if (document.pointerLockElement !== canvas) {
      travarMouse();
      $("dica").hidden = true;
      return;
    }
    mouse(e, 0);
  });
  canvas.addEventListener("mouseup", function (e) {
    mouse(e, 0);
  });
  canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // O Esc que solta o pointer lock nem sempre chega como tecla: se não
  // chegou, entrega um ao Doom para abrir o menu, como no jogo original
  document.addEventListener("pointerlockchange", function () {
    var travado = document.pointerLockElement === canvas;
    avisarPai(travado ? "mouse-travado" : "mouse-livre");
    if (travado || !exp || !rodando) return;
    if (botoes) {
      botoes = 0;
      exp.dg_mouse(0, 0);
    }
    setTimeout(function () {
      if (!rodando || performance.now() - ultimoEsc < 500) return;
      exp.dg_tecla(1, 27);
      exp.dg_tecla(0, 27);
    }, 60);
  });

  // Perdeu o foco com tecla apertada: solta tudo para o jogador não sair
  // andando sozinho
  window.addEventListener("blur", function () {
    if (!exp || !rodando) return;
    [0xad, 0xaf, 0xac, 0xae, 0xa3, 0x80 + 0x36, 0x80 + 0x38, 32, 119, 97, 115, 100].forEach(function (k) {
      exp.dg_tecla(0, k);
    });
  });

  $("dica").textContent = TXT.clique + " — " + TXT.dica;
  if (matchMedia("(pointer: coarse)").matches) $("aviso-celular").textContent = TXT.celular;

  status(TXT.motor);
  Promise.all([
    dadosDoServidor().then(function (iwad) {
      return iwad || dadosDoVisitante();
    }),
    salvosCarregar(),
  ])
    .then(function (r) {
      status(TXT.iniciando);
      return iniciar(r[0], r[1]);
    })
    .catch(function (e) {
      falhou(e, null);
    });
})();
