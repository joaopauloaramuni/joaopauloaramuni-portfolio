/*
 * Substitui o SDL.h para os fontes do Chocolate Doom usados na música do
 * Doom (opl.c, midifile.c). Não há SDL nem threads no navegador: os mutexes
 * não fazem nada e a espera do OPL_Delay faz a música andar
 * (ver opl_web_esperar em opl_web.c). O build.sh copia este arquivo como SDL.h.
 */
#ifndef SDL_WEB_H
#define SDL_WEB_H

#include <stdint.h>
#include <string.h>

typedef int SDL_mutex;
typedef int SDL_cond;

void opl_web_esperar(void);

static int sdl_web_objeto;
#define SDL_CreateMutex() (&sdl_web_objeto)
#define SDL_CreateCond() (&sdl_web_objeto)
#define SDL_DestroyMutex(m) ((void)(m))
#define SDL_DestroyCond(c) ((void)(c))
#define SDL_LockMutex(m) ((void)(m))
#define SDL_UnlockMutex(m) ((void)(m))
#define SDL_CondSignal(c) ((void)(c))
#define SDL_CondWait(c, m) opl_web_esperar()

#ifndef SDL_SwapBE16
#define SDL_SwapBE16(x) __builtin_bswap16(x)
#define SDL_SwapBE32(x) __builtin_bswap32(x)
#endif

#endif
