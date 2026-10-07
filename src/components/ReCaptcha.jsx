import { useEffect, useImperativeHandle, useRef } from "react";
import RECAPTCHA_CONFIG from "../config/recaptchaConfig";
import { loadRecaptcha } from "../lib/recaptcha";

// Caixa "Não sou um robô" do Google reCAPTCHA v2.
//
//   onChange(token) → chamado com o token quando o visitante resolve o
//                     desafio, e com null quando ele expira, dá erro ou o
//                     widget é desenhado de novo
//   onError()       → o script do Google não carregou
//   ref.reset()     → limpa o widget (cada token só vale para um envio)
//
// O widget é desenhado num <div> novo a cada montagem: o reCAPTCHA não aceita
// desenhar duas vezes no mesmo elemento, e assim ele também acompanha a troca
// de tema (claro/escuro), que pede um widget novo.
export default function ReCaptcha({ siteKey, theme, language, onChange, onError, ref }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);

  // Sempre os callbacks mais recentes, sem desenhar o widget de novo
  const onChangeRef = useRef(onChange);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onChangeRef.current = onChange;
    onErrorRef.current = onError;
  });

  // O idioma só vale na primeira carga do script (ver lib/recaptcha.js)
  const languageRef = useRef(language);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetId.current !== null) window.grecaptcha?.reset(widgetId.current);
        onChangeRef.current?.(null);
      },
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    const slot = document.createElement("div");
    containerRef.current.appendChild(slot);

    loadRecaptcha(languageRef.current)
      .then((grecaptcha) => {
        if (cancelled) return;
        widgetId.current = grecaptcha.render(slot, {
          sitekey: siteKey,
          theme,
          size: window.innerWidth < RECAPTCHA_CONFIG.COMPACT_BELOW ? "compact" : "normal",
          callback: (token) => onChangeRef.current?.(token),
          "expired-callback": () => onChangeRef.current?.(null),
          "error-callback": () => onChangeRef.current?.(null),
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current?.();
      });

    return () => {
      cancelled = true;
      widgetId.current = null;
      slot.remove();
      onChangeRef.current?.(null);
    };
  }, [siteKey, theme]);

  return <div ref={containerRef} className="contato-captcha" />;
}
