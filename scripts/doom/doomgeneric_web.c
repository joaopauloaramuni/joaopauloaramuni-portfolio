/*
 * Plataforma do Doom no portfólio (comando "jogo --doom" ou "doom").
 *
 * O doomgeneric (Chocolate Doom enxuto, GPL-2.0) só pede meia dúzia de
 * funções DG_*: aqui elas viram chamadas ao JavaScript (public/doom/loader.js),
 * que desenha o quadro no <canvas>, toca os efeitos sonoros pelo Web Audio e
 * manda teclado e mouse para cá. O laço de frames também é do JavaScript: ele
 * chama dg_tick() a cada tic (35 por segundo), sem bloquear a página.
 * A música vem do OPL emulado (opl_web.c), também puxada pelo JavaScript.
 *
 * Compilado para wasm32-wasi (ver build.sh); o doom1.wad entra num sistema de
 * arquivos em memória do próprio loader.js.
 */
#include <stdint.h>
#include <string.h>
#include <stdio.h>

#include "doomgeneric.h"
#include "doomkeys.h"
#include "d_event.h"
#include "i_sound.h"
#include "w_wad.h"
#include "z_zone.h"
#include "m_controls.h"
#include "i_system.h"
#include "m_config.h"

#define JS(nome) __attribute__((import_module("doom"), import_name(nome)))

JS("desenhar") void js_desenhar(const pixel_t *tela, int largura, int altura);
JS("agora") uint32_t js_agora(void);
JS("titulo") void js_titulo(const char *titulo);
JS("som_tocar") void js_som_tocar(int canal, const void *dados, int tamanho, int lump, int vol, int sep);
JS("som_ajustar") void js_som_ajustar(int canal, int vol, int sep);
JS("som_parar") void js_som_parar(int canal);
JS("som_tocando") int js_som_tocando(int canal);
JS("sair") void js_sair(void);

/* ------------------------------------------------------------------ */
/* Teclado: fila de eventos vinda do JavaScript                        */
/* ------------------------------------------------------------------ */

#define FILA 64
static unsigned short fila[FILA];
static unsigned int escrita, leitura;

__attribute__((export_name("dg_tecla")))
void dg_tecla(int pressionada, int tecla)
{
    fila[escrita] = (unsigned short)(((pressionada ? 1 : 0) << 8) | (tecla & 0xff));
    escrita = (escrita + 1) % FILA;
    if (escrita == leitura)
        leitura = (leitura + 1) % FILA; /* fila cheia: perde a mais antiga */
}

int DG_GetKey(int *pressionada, unsigned char *tecla)
{
    if (leitura == escrita)
        return 0;
    unsigned short v = fila[leitura];
    leitura = (leitura + 1) % FILA;
    *pressionada = v >> 8;
    *tecla = v & 0xff;
    return 1;
}

/* Mouse (só com o pointer lock): botões em bits e movimento horizontal.
 * O vertical fica de fora, como o "novert" de quem joga Doom com mouse */
__attribute__((export_name("dg_mouse")))
void dg_mouse(int botoes, int dx)
{
    event_t ev;
    ev.type = ev_mouse;
    ev.data1 = botoes;
    ev.data2 = dx;
    ev.data3 = 0;
    ev.data4 = 0;
    D_PostEvent(&ev);
}

/* ------------------------------------------------------------------ */
/* Vídeo e tempo                                                       */
/* ------------------------------------------------------------------ */

void DG_Init(void) {}

void DG_DrawFrame(void)
{
    js_desenhar(DG_ScreenBuffer, DOOMGENERIC_RESX, DOOMGENERIC_RESY);
}

/* O navegador não dorme: quem espera o próximo tic é o JavaScript */
void DG_SleepMs(uint32_t ms) { (void)ms; }

uint32_t DG_GetTicksMs(void) { return js_agora(); }

void DG_SetWindowTitle(const char *titulo) { js_titulo(titulo); }

/* ------------------------------------------------------------------ */
/* Entrada e saída                                                     */
/* ------------------------------------------------------------------ */

/* "Quit Game" no menu: o I_Quit do doomgeneric só roda as funções de saída
 * (sem exit). Esta é a primeira delas (a última registrada): grava a
 * configuração e avisa o JavaScript, que encerra o motor ali mesmo. As
 * outras não rodam, e nem precisam: uma delas (G_CheckDemoStatus) é chamada
 * com outra assinatura, o que no WebAssembly derruba o motor */
static void ao_sair(void)
{
    M_SaveDefaults();
    js_sair();
}

/* doom2 = 1 quando o visitante escolheu o doom2.wad (o loader.js grava o
 * arquivo com esse nome); senão, o doom1.wad (shareware) ou o doom.wad */
__attribute__((export_name("dg_iniciar")))
void dg_iniciar(int doom2)
{
    static char *argv[] = {"doom", "-iwad", "doom1.wad", NULL};
    if (doom2)
        argv[2] = "doom2.wad";
    doomgeneric_Create(3, argv);
    I_AtExit(ao_sair, false);

    /* Controles de hoje: WASD anda, setas e mouse viram, Ctrl ou clique
     * esquerdo atira, Espaço ou clique direito abrem portas. As teclas do
     * Doom original (setas, Alt, vírgula e ponto) continuam valendo */
    key_up = 'w';
    key_down = 's';
    key_strafeleft = 'a';
    key_straferight = 'd';
    key_use = ' ';
    mousebfire = 0;
    mousebuse = 1;
    mousebstrafe = -1;
    mousebforward = -1;
}

__attribute__((export_name("dg_tick")))
void dg_tick(void)
{
    doomgeneric_Tick();
}

/* ------------------------------------------------------------------ */
/* Som: os efeitos (lumps DS* do WAD) tocam no Web Audio               */
/* ------------------------------------------------------------------ */

static boolean prefixo_sfx;

static snddevice_t dispositivos[] = {
    SNDDEVICE_SB, SNDDEVICE_PAS, SNDDEVICE_GUS,
    SNDDEVICE_WAVEBLASTER, SNDDEVICE_SOUNDCANVAS, SNDDEVICE_AWE32,
};

static boolean som_init(boolean usar_prefixo)
{
    prefixo_sfx = usar_prefixo;
    return true;
}

static void som_nada(void) {}

static int som_lump(sfxinfo_t *sfx)
{
    char nome[16];
    if (sfx->link != NULL)
        sfx = sfx->link;
    if (prefixo_sfx)
        snprintf(nome, sizeof(nome), "ds%s", sfx->name);
    else
        snprintf(nome, sizeof(nome), "%s", sfx->name);
    return W_GetNumForName(nome);
}

static int som_tocar(sfxinfo_t *sfx, int canal, int vol, int sep)
{
    int lump = sfx->lumpnum;
    if (lump < 0)
        return -1;
    void *dados = W_CacheLumpNum(lump, PU_STATIC);
    js_som_tocar(canal, dados, W_LumpLength(lump), lump, vol, sep);
    return canal;
}

static void som_ajustar(int canal, int vol, int sep) { js_som_ajustar(canal, vol, sep); }
static void som_parar(int canal) { js_som_parar(canal); }
static boolean som_tocando(int canal) { return js_som_tocando(canal) != 0; }

sound_module_t DG_sound_module = {
    dispositivos,
    sizeof(dispositivos) / sizeof(*dispositivos),
    som_init,
    som_nada,
    som_lump,
    som_nada,
    som_ajustar,
    som_tocar,
    som_parar,
    som_tocando,
    NULL,
};

/* Música: o i_oplmusic.c do Chocolate Doom toca as faixas do WAD num chip
 * OPL emulado (ver opl_web.c). O doomgeneric chama sempre o DG_music_module,
 * então ele só repassa para o music_opl_module */
static boolean mus_init(void) { return music_opl_module.Init(); }
static void mus_shutdown(void) { music_opl_module.Shutdown(); }
static void mus_volume(int v) { music_opl_module.SetMusicVolume(v); }
static void mus_pausar(void) { music_opl_module.PauseMusic(); }
static void mus_retomar(void) { music_opl_module.ResumeMusic(); }
static void *mus_registrar(void *d, int t) { return music_opl_module.RegisterSong(d, t); }
static void mus_liberar(void *h) { music_opl_module.UnRegisterSong(h); }
static void mus_tocar(void *h, boolean loop) { music_opl_module.PlaySong(h, loop); }
static void mus_parar(void) { music_opl_module.StopSong(); }
static boolean mus_tocando(void) { return music_opl_module.MusicIsPlaying(); }

music_module_t DG_music_module = {
    dispositivos,
    sizeof(dispositivos) / sizeof(*dispositivos),
    mus_init,
    mus_shutdown,
    mus_volume,
    mus_pausar,
    mus_retomar,
    mus_registrar,
    mus_liberar,
    mus_tocar,
    mus_parar,
    mus_tocando,
    NULL,
};

/* Variáveis que o i_sound.c liga à configuração e que, no doomgeneric,
 * moram no i_sdlsound.c (que fica de fora) */
int use_libsamplerate = 0;
float libsamplerate_scale = 0.65f;

/* O WASI não roda programas: a caixa de erro do zenity (i_system.c) cai
 * aqui e o erro aparece pelo stderr, no loader.js */
int system(const char *comando)
{
    (void)comando;
    return -1;
}
