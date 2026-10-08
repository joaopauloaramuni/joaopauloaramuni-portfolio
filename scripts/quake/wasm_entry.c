/*
 * Entrada do Quake no portfólio: o emscripten do build não liga o main(argc, argv)
 * sozinho, então o JavaScript chama qstart("-arg valor ...") quando o pak0.pak
 * já está no sistema de arquivos (ver public/quake/loader.js).
 */
#include <string.h>
#include <emscripten.h>

int quake_main(int argc, char **argv);

EMSCRIPTEN_KEEPALIVE int qstart(const char *cmdline)
{
	static char buffer[1024];
	static char *argv[64];
	int argc = 0;
	char *token;

	strncpy(buffer, cmdline ? cmdline : "", sizeof(buffer) - 1);
	argv[argc++] = "quake";
	for (token = strtok(buffer, " "); token && argc < 63; token = strtok(NULL, " "))
		argv[argc++] = token;
	argv[argc] = NULL;

	return quake_main(argc, argv);
}
