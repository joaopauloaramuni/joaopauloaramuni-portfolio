/*
 * O que o i_oplmusic.c do Chocolate Doom 2.3.0 espera do i_sound.h e que o
 * i_sound.h do doomgeneric não traz. Incluído antes de cada fonte (-include).
 */
#ifndef CHOCO_COMPAT_H
#define CHOCO_COMPAT_H

typedef enum
{
    opl_doom1_1_666, /* Doom 1 v1.666 */
    opl_doom2_1_666, /* Doom 2 v1.666, Hexen, Heretic */
    opl_doom_1_9     /* Doom v1.9, Strife */
} opl_driver_ver_t;

void I_SetOPLDriverVer(opl_driver_ver_t ver);

/* O midifile.c usa a troca de bytes do SDL (via i_swap.h no Chocolate) */
#ifndef SDL_SwapBE16
#define SDL_SwapBE16(x) __builtin_bswap16(x)
#define SDL_SwapBE32(x) __builtin_bswap32(x)
#endif

#endif
