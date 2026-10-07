import RECAPTCHA_CONFIG from "../config/recaptchaConfig";

// Carrega o script do Google reCAPTCHA v2 uma única vez, só quando o
// formulário de contato abre (quem não usa o "contato" não baixa nada).
//
// render=explicit: o widget é desenhado pelo componente ReCaptcha, e não
// automaticamente pelo script, para funcionar com as saídas do terminal que
// montam e desmontam. O idioma (hl) vale para a página inteira e só pode ser
// escolhido aqui, na primeira carga.

const ONLOAD_CALLBACK = "__aramuniRecaptchaOnload";

let loading = null;

export function loadRecaptcha(language) {
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    window[ONLOAD_CALLBACK] = () => {
      delete window[ONLOAD_CALLBACK];
      resolve(window.grecaptcha);
    };

    const params = new URLSearchParams({
      onload: ONLOAD_CALLBACK,
      render: "explicit",
      hl: language?.startsWith("en") ? "en" : "pt-BR",
    });
    const script = document.createElement("script");
    script.src = `${RECAPTCHA_CONFIG.SCRIPT_URL}?${params}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      // Rede bloqueou o Google (bloqueador de anúncios, firewall...):
      // permite tentar de novo na próxima vez que o contato abrir
      loading = null;
      delete window[ONLOAD_CALLBACK];
      script.remove();
      reject(new Error("Não foi possível carregar o reCAPTCHA"));
    };
    document.head.appendChild(script);
  });

  return loading;
}
