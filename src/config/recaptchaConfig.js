// recaptchaConfig.js
// Google reCAPTCHA v2 ("Não sou um robô") do formulário de contato.
// https://www.google.com/recaptcha/admin
//
// Só a SITE KEY fica aqui: ela é pública e vai para o build (VITE_). A SECRET
// KEY nunca entra no código nem no .env.local: ela fica no painel do EmailJS
// (Email Templates → template FOR SENDER → Settings → "Enable reCAPTCHA V2
// verification"), e é o EmailJS que confere o token com o Google.
//
// Sem a site key (ex.: quem acabou de clonar o repositório), o formulário
// abre sem o reCAPTCHA e envia como antes.
const RECAPTCHA_CONFIG = {
  SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  SCRIPT_URL: "https://www.google.com/recaptcha/api.js",
  // Abaixo desta largura (px) o widget usa o tamanho compacto (164×144),
  // que cabe no celular; o normal tem 304×78
  COMPACT_BELOW: 480,
};

export default RECAPTCHA_CONFIG;
