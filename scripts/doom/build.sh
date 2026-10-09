#!/usr/bin/env bash
# Recompila o motor do "jogo --doom" (public/doom/doom.wasm).
#
# Só é preciso para atualizar o motor: o doom.wasm gerado já está no repo.
# Requer o Zig (traz o clang e a libc do WASI prontos):
#   https://ziglang.org/download  ou  pip install ziglang
#
#   bash scripts/doom/build.sh
#
# Fontes, nos commits fixados abaixo e sem modificações:
# - doomgeneric (Chocolate Doom enxuto, GPL-2.0) de ozkl,
#   https://github.com/ozkl/doomgeneric: o jogo;
# - Chocolate Doom 2.3.0 (GPL-2.0), https://github.com/chocolate-doom/chocolate-doom:
#   a música (i_oplmusic.c, midifile.c) e o chip OPL emulado (opl/, Nuked OPL3).
# A plataforma (vídeo, teclado, mouse e efeitos) é o doomgeneric_web.c e o
# driver da música, o opl_web.c; os dois conversam com o public/doom/loader.js.
set -euo pipefail

REPO="https://github.com/ozkl/doomgeneric.git"
COMMIT="dcb7a8dbc7a16ce3dda29382ac9aae9d77d21284"
CHOCO_REPO="https://github.com/chocolate-doom/chocolate-doom.git"
CHOCO_COMMIT="939cbfeb115338cf7868e516019a4ae832b1ebde" # chocolate-doom-2.3.0

AQUI="$(cd "$(dirname "$0")" && pwd)"
DESTINO="$AQUI/../../public/doom"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if command -v zig >/dev/null; then
  ZIG="zig"
elif python3 -c "import ziglang" 2>/dev/null; then
  ZIG="python3 -m ziglang"
else
  echo "zig não encontrado (instale o Zig ou: pip install ziglang)"
  exit 1
fi

git clone --quiet "$REPO" "$TMP/dg"
git -C "$TMP/dg" checkout --quiet "$COMMIT"
git clone --quiet "$CHOCO_REPO" "$TMP/choco"
git -C "$TMP/choco" checkout --quiet "$CHOCO_COMMIT"
cd "$TMP/dg/doomgeneric"
cp "$AQUI/doomgeneric_web.c" "$AQUI/opl_web.c" "$AQUI/choco_compat.h" .
cp "$TMP/choco/src/i_oplmusic.c" "$TMP/choco/src/midifile.c" "$TMP/choco/src/midifile.h" .
for f in opl.c opl.h opl3.c opl3.h opl_internal.h opl_queue.c opl_queue.h; do
  cp "$TMP/choco/opl/$f" .
done

# Sem SDL: o i_sound.c inclui o SDL_mixer.h sem usar nada dele, e o opl.c e
# o midifile.c só precisam de mutexes (aqui, vazios) e troca de bytes
mkdir -p "$TMP/inc"
: > "$TMP/inc/SDL_mixer.h"
cp "$AQUI/sdl_web.h" "$TMP/inc/SDL.h"

# Os mesmos fontes do Makefile.emscripten, trocando a plataforma SDL
# (doomgeneric_emscripten.c, i_sdlsound.c, i_sdlmusic.c) pela web
SRCS="dummy.c am_map.c doomdef.c doomstat.c dstrings.c d_event.c d_items.c
d_iwad.c d_loop.c d_main.c d_mode.c d_net.c f_finale.c f_wipe.c g_game.c
hu_lib.c hu_stuff.c info.c i_cdmus.c i_endoom.c i_joystick.c i_scale.c
i_sound.c i_system.c i_timer.c memio.c m_argv.c m_bbox.c m_cheat.c m_config.c
m_controls.c m_fixed.c m_menu.c m_misc.c m_random.c p_ceilng.c p_doors.c
p_enemy.c p_floor.c p_inter.c p_lights.c p_map.c p_maputl.c p_mobj.c p_plats.c
p_pspr.c p_saveg.c p_setup.c p_sight.c p_spec.c p_switch.c p_telept.c p_tick.c
p_user.c r_bsp.c r_data.c r_draw.c r_main.c r_plane.c r_segs.c r_sky.c
r_things.c sha1.c sounds.c statdump.c st_lib.c st_stuff.c s_sound.c tables.c
v_video.c wi_stuff.c w_checksum.c w_file.c w_main.c w_wad.c z_zone.c
w_file_stdc.c i_input.c i_video.c doomgeneric.c mus2mid.c doomgeneric_web.c
i_oplmusic.c midifile.c opl.c opl3.c opl_queue.c opl_web.c"

# 320x200, a resolução original: o canvas estica para 4:3 como num monitor
# CRT da época. Reactor: o JavaScript chama dg_iniciar() e dg_tick()
$ZIG cc -target wasm32-wasi -O2 -DFEATURE_SOUND \
  -DDOOMGENERIC_RESX=320 -DDOOMGENERIC_RESY=200 \
  -D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_MMAN \
  -I"$TMP/inc" -include choco_compat.h -w -mexec-model=reactor -Wl,-z,stack-size=1048576 \
  -lwasi-emulated-signal -lwasi-emulated-process-clocks -lwasi-emulated-mman \
  $SRCS -o "$TMP/doom.wasm"

cp "$TMP/doom.wasm" "$DESTINO/"
echo "Pronto: $DESTINO/doom.wasm"
