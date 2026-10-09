/*
 * Música do Doom no portfólio: driver OPL para o navegador.
 *
 * O Doom toca a música (lumps D_* do WAD, em MUS) num chip FM Yamaha OPL2,
 * o da placa AdLib/Sound Blaster, com os timbres do lump GENMIDI. O
 * i_oplmusic.c do Chocolate Doom faz isso de forma fiel ao DMX original, e
 * o Nuked OPL3 (opl3.c) emula o chip. Este arquivo é o driver que liga os
 * dois ao Web Audio, no lugar do opl_sdl.c: em vez de um callback do
 * SDL_mixer numa thread de áudio, o JavaScript (public/doom/loader.js)
 * pede blocos de amostras com dg_musica(), e o tempo da música anda junto
 * com as amostras geradas (é ele que dispara os eventos da partitura).
 *
 * Baseado no opl_sdl.c do Chocolate Doom 2.3.0 (GPL-2.0, Simon Howard).
 */
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include "opl3.h"
#include "opl.h"
#include "opl_internal.h"
#include "opl_queue.h"

typedef struct
{
    unsigned int rate;     /* vezes por segundo que o timer avança */
    unsigned int enabled;
    unsigned int value;
    uint64_t expire_time;
} opl_timer_t;

static opl_callback_queue_t *fila;
static uint64_t agora_us;       /* tempo da música, em microssegundos */
static uint64_t pausa_us;       /* tempo passado em pausa */
static int pausado;
static int travado;             /* OPL_Lock(): nada de callbacks */
static unsigned int taxa;       /* amostras por segundo */

static opl3_chip chip;
static int registrador;
static opl_timer_t timer1 = {12500, 0, 0, 0};
static opl_timer_t timer2 = {3125, 0, 0, 0};

/* Bloco devolvido ao JavaScript: estéreo intercalado, 16 bits */
#define MAX_AMOSTRAS 8192
static int16_t bloco[MAX_AMOSTRAS * 2];

static void AvancarTempo(unsigned int n)
{
    opl_callback_t callback;
    void *dados;
    uint64_t us = ((uint64_t)n * OPL_SECOND) / taxa;

    agora_us += us;
    if (pausado)
        pausa_us += us;

    while (!travado && !OPL_Queue_IsEmpty(fila)
           && agora_us >= OPL_Queue_Peek(fila) + pausa_us)
    {
        if (!OPL_Queue_Pop(fila, &callback, &dados))
            break;
        callback(dados);
    }
}

/* Gera n amostras, parando em cada evento da partitura para que ele
 * aconteça no ponto certo do áudio (como o OPL_Mix_Callback do SDL) */
static void Gerar(int16_t *saida, unsigned int total)
{
    unsigned int feito = 0;
    while (feito < total)
    {
        uint64_t n = total - feito;
        if (!pausado && !travado && !OPL_Queue_IsEmpty(fila))
        {
            uint64_t proximo = OPL_Queue_Peek(fila) + pausa_us;
            uint64_t ate = proximo > agora_us ? proximo - agora_us : 0;
            uint64_t k = (ate * taxa + OPL_SECOND - 1) / OPL_SECOND;
            if (k < n)
                n = k;
        }
        if (n > 0)
            OPL3_GenerateStream(&chip, saida + feito * 2, (uint32_t)n);
        feito += (unsigned int)n;
        AvancarTempo((unsigned int)n);
    }
}

__attribute__((export_name("dg_musica")))
int16_t *dg_musica(int n)
{
    if (fila == NULL || n <= 0)
        return NULL;
    if (n > MAX_AMOSTRAS)
        n = MAX_AMOSTRAS;
    Gerar(bloco, (unsigned int)n);
    return bloco;
}

__attribute__((export_name("dg_musica_taxa")))
int dg_musica_taxa(void)
{
    return fila != NULL ? (int)taxa : 0;
}

/* O OPL_Delay do opl.c espera numa condição do SDL até um callback rodar;
 * aqui não há outra thread para gerar áudio, então a espera mesma faz o
 * tempo andar (ver sdl_web.h) */
void opl_web_esperar(void)
{
    static int16_t lixo[64 * 2];
    int salvo = travado;
    travado = 0;
    Gerar(lixo, 64);
    travado = salvo;
}

static int Web_Init(unsigned int port_base)
{
    (void)port_base;
    taxa = opl_sample_rate;
    fila = OPL_Queue_Create();
    agora_us = 0;
    pausa_us = 0;
    pausado = 0;
    travado = 0;
    OPL3_Reset(&chip, taxa);
    return 1;
}

static void Web_Shutdown(void)
{
    if (fila != NULL)
    {
        OPL_Queue_Destroy(fila);
        fila = NULL;
    }
}

static void Timer_CalcularFim(opl_timer_t *t)
{
    if (t->enabled)
    {
        int tics = 0x100 - t->value;
        t->expire_time = agora_us + ((uint64_t)tics * OPL_SECOND) / t->rate;
    }
}

static unsigned int Web_PortRead(opl_port_t port)
{
    unsigned int r = 0;
    if (port == OPL_REGISTER_PORT_OPL3)
        return 0xff;
    if (timer1.enabled && agora_us > timer1.expire_time)
        r |= 0x80 | 0x40;
    if (timer2.enabled && agora_us > timer2.expire_time)
        r |= 0x80 | 0x20;
    return r;
}

static void EscreverRegistrador(unsigned int reg, unsigned int v)
{
    switch (reg)
    {
        case OPL_REG_TIMER1:
            timer1.value = v;
            Timer_CalcularFim(&timer1);
            break;
        case OPL_REG_TIMER2:
            timer2.value = v;
            Timer_CalcularFim(&timer2);
            break;
        case OPL_REG_TIMER_CTRL:
            if (v & 0x80)
            {
                timer1.enabled = 0;
                timer2.enabled = 0;
            }
            else
            {
                if ((v & 0x40) == 0)
                {
                    timer1.enabled = (v & 0x01) != 0;
                    Timer_CalcularFim(&timer1);
                }
                if ((v & 0x20) == 0)
                {
                    timer2.enabled = (v & 0x02) != 0;
                    Timer_CalcularFim(&timer2);
                }
            }
            break;
        default:
            OPL3_WriteRegBuffered(&chip, (uint16_t)reg, (uint8_t)v);
            break;
    }
}

static void Web_PortWrite(opl_port_t port, unsigned int v)
{
    if (port == OPL_REGISTER_PORT)
        registrador = v;
    else if (port == OPL_REGISTER_PORT_OPL3)
        registrador = v | 0x100;
    else if (port == OPL_DATA_PORT)
        EscreverRegistrador(registrador, v);
}

static void Web_SetCallback(uint64_t us, opl_callback_t cb, void *dados)
{
    OPL_Queue_Push(fila, cb, dados, agora_us - pausa_us + us);
}

static void Web_ClearCallbacks(void) { OPL_Queue_Clear(fila); }
static void Web_Lock(void) { travado = 1; }
static void Web_Unlock(void) { travado = 0; }
static void Web_SetPaused(int p) { pausado = p; }

static void Web_AdjustCallbacks(float fator)
{
    OPL_Queue_AdjustCallbacks(fila, agora_us, fator);
}

/* O opl.c procura um driver com este nome na lista dele */
opl_driver_t opl_sdl_driver = {
    "web",
    Web_Init,
    Web_Shutdown,
    Web_PortRead,
    Web_PortWrite,
    Web_SetCallback,
    Web_ClearCallbacks,
    Web_Lock,
    Web_Unlock,
    Web_SetPaused,
    Web_AdjustCallbacks,
};
