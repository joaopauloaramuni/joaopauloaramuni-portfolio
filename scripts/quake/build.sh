#!/usr/bin/env bash
# Recompila o motor do "aragame --quake" (public/quake/quake.js + quake.wasm).
#
# Só é preciso para atualizar o motor: os arquivos gerados já estão no repo.
# Requer o Emscripten (emcc no PATH): https://emscripten.org/docs/getting_started
#
#   bash scripts/quake/build.sh
#
# Fonte: Qwasm (WinQuake/SDL2 em WebAssembly, GPL-2.0) de Gregory Maynard-Hoare,
# https://github.com/GMH-Code/Quake-WASM, no commit fixado abaixo. A única
# mudança é a entrada: o main() vira quake_main() e o JavaScript chama
# qstart() depois de colocar o pak0.pak no sistema de arquivos
# (ver wasm_entry.c e public/quake/loader.js).
set -euo pipefail

REPO="https://github.com/GMH-Code/Quake-WASM.git"
COMMIT="f56b5e71e4be8effede29bae1785a5306dcc0249"

AQUI="$(cd "$(dirname "$0")" && pwd)"
DESTINO="$AQUI/../../public/quake"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

command -v emcc >/dev/null || { echo "emcc não encontrado (instale o Emscripten)"; exit 1; }

git clone --quiet "$REPO" "$TMP/qwasm"
git -C "$TMP/qwasm" checkout --quiet "$COMMIT"
cd "$TMP/qwasm/WinQuake"
cp "$AQUI/wasm_entry.c" .

# Renderização por software (sem GL4ES): o visual original e um wasm de ~1 MB
SRCS="chase.c cl_demo.c cl_input.c cl_main.c cl_parse.c cl_tent.c cmd.c common.c
console.c crc.c cvar.c host.c host_cmd.c keys.c mathlib.c menu.c net_bsd.c
net_dgrm.c net_loop.c net_main.c net_udp.c net_vcr.c pr_cmds.c pr_edict.c
pr_exec.c r_part.c sbar.c snd_dma.c snd_mem.c snd_mix.c sv_main.c sv_move.c
sv_phys.c sv_user.c view.c wad.c world.c zone.c d_edge.c d_fill.c d_init.c
d_modech.c d_part.c d_polyse.c d_scan.c d_sky.c d_sprite.c d_surf.c d_vars.c
d_zpoint.c draw.c model.c nonintel.c r_aclip.c r_alias.c r_bsp.c r_draw.c
r_edge.c r_efrag.c r_light.c r_main.c r_misc.c r_sky.c r_sprite.c r_surf.c
r_vars.c screen.c cd_null.c snd_sdl.c vid_sdl.c wasm_entry.c"

CFLAGS="-O3 -ffast-math -funroll-loops -fomit-frame-pointer -sUSE_SDL=2 -DSDL
-Wno-implicit-function-declaration -Wno-everything"

OBJS=""
for f in $SRCS; do
  emcc $CFLAGS -c "$f" -o "${f%.c}.o"
  OBJS="$OBJS ${f%.c}.o"
done
emcc $CFLAGS -Dmain=quake_main -c sys_sdl.c -o sys_sdl.o

# id1/ traz só os .cfg do Qwasm (teclas WASD etc.), embutidos no quake.js;
# o pak0.pak entra em tempo de execução
emcc $OBJS sys_sdl.o -O3 -sUSE_SDL=2 -sINITIAL_MEMORY=64MB -sTOTAL_STACK=2MB \
  -sALLOW_MEMORY_GROWTH -sFORCE_FILESYSTEM=1 -lidbfs.js --embed-file id1 \
  -sEXPORTED_FUNCTIONS=_qstart \
  -sEXPORTED_RUNTIME_METHODS=FS,ccall \
  -o "$TMP/quake.js"

cp "$TMP/quake.js" "$TMP/quake.wasm" "$DESTINO/"
echo "Pronto: $DESTINO/quake.js e quake.wasm"
