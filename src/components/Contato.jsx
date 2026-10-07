import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaEnvelope,
  FaWhatsapp,
  FaDiscord,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";
import "./Contato.css";
import EMAILJS_CONFIG from "../config/emailJsConfig";
import RECAPTCHA_CONFIG from "../config/recaptchaConfig";
import ReCaptcha from "./ReCaptcha";
import { useTheme } from "../theme/themeContext";

// Limites dos campos (o EmailJS aceita até 50 kB por envio no plano gratuito)
const MAX_NOME = 100;
const MAX_EMAIL = 254;
const MAX_MENSAGEM = 2000;

const Contato = ({ onExit }) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const form = useRef();
  const nomeInputRef = useRef(null);
  const captchaRef = useRef(null);
  // Chave do i18n da mensagem de status ("" mostra o subtítulo). Guardar a
  // chave, e não o texto, faz a mensagem acompanhar a troca de idioma.
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaFailed, setCaptchaFailed] = useState(false);
  const statusRef = useRef(null);

  // Sem a site key (.env.local vazio), o formulário funciona sem o reCAPTCHA
  const captchaEnabled = Boolean(RECAPTCHA_CONFIG.SITE_KEY);
  // O bloco só aparece se o script do Google carregou
  const showCaptcha = captchaEnabled && !captchaFailed;

  useEffect(() => {
    // Foca no campo nome quando o componente montar
    if (nomeInputRef.current) {
      nomeInputRef.current.focus();
    }
  }, []);

  const handleCaptchaChange = useCallback((token) => {
    setCaptchaToken(token);
    // Resolveu o desafio: apaga o aviso "confirme que você não é um robô"
    if (token) setStatus((atual) => (atual === "contato.captcha_pendente" ? "" : atual));
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaFailed(true);
    setStatus("contato.captcha_indisponivel");
  }, []);

  const seuLinkedIn = "https://www.linkedin.com/in/joaopauloaramuni/";
  const seuGitHub = "https://github.com/joaopauloaramuni";
  const seuEmail = "joaopauloaramuni@gmail.com";
  const seuWhatsapp = "https://wa.me/5531980402103";
  const seuDiscord = "https://discordapp.com/users/959151773728251914";
  const seuInstagram = "https://www.instagram.com/joaopauloaramuni";

  const sendEmail = async (e) => {
    e.preventDefault();
    if (sending) return;

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Campo isca: invisível para pessoas, robôs costumam preencher. Finge que
    // deu certo para o robô não tentar de novo, mas não envia nada.
    if (formData.get("website")) {
      setStatus("contato.sucesso");
      formElement.reset();
      return;
    }

    // Cada token do reCAPTCHA vale para um envio só
    if (captchaEnabled && !captchaToken) {
      setStatus(captchaFailed ? "contato.captcha_indisponivel" : "contato.captcha_pendente");
      return;
    }

    const nome = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const mensagem = String(formData.get("message") ?? "").trim();
    const time = new Date().toLocaleString();

    setSending(true);
    setStatus("contato.enviando");

    try {
      // 1) Confirmação para o remetente. É o envio que vai para um endereço
      // digitado pelo visitante, então é ele que leva o token do reCAPTCHA: o
      // EmailJS confere o token com o Google e recusa o envio se for inválido.
      // Por isso ele vem primeiro: sem passar no reCAPTCHA, nada é enviado.
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_FOR_SENDER,
        {
          name: nome,
          email: email,
          message: mensagem,
          title: "Recebemos sua mensagem!", // assunto do email de confirmação
          time: time,
          ...(captchaEnabled && { "g-recaptcha-response": captchaToken }),
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // 2) Notificação para mim. Sem token: o Google só aceita conferir cada
      // token uma vez, e este template também é usado pelo guestbook.
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_FOR_ME,
        {
          name: nome,
          email: email,
          message: mensagem,
          title: `Nova mensagem do site de: ${nome}`, // assunto do email
          time: time,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setStatus("contato.sucesso");
      formElement.reset();
    } catch (err) {
      console.error("Erro ao enviar a mensagem de contato:", err);
      setStatus("contato.erro");
    } finally {
      setSending(false);
      // Token já usado (ou recusado): pede um desafio novo
      captchaRef.current?.reset();
    }
  };

  return (
    <div className="box-container loaded contato-container">
      <h3 className="contato-titulo">{t("contato.titulo")}</h3>
      <div className="box-status">
        <p
          ref={statusRef}
          className={status ? "status-contato" : "contato-subtitulo"}
          role="status"
          aria-live="polite"
        >
          {status ? t(status) : t("contato.subtitulo")}
        </p>
      </div>
      {/* Formulário */}
      <form ref={form} onSubmit={sendEmail} className="formulario-contato">
        <input
          ref={nomeInputRef}
          type="text"
          name="name"
          placeholder={t("contato.nome")}
          aria-label={t("contato.nome")}
          maxLength={MAX_NOME}
          autoComplete="name"
          required
          className="input-contato"
        />
        <input
          type="email"
          name="email"
          placeholder={t("contato.email")}
          aria-label={t("contato.email")}
          maxLength={MAX_EMAIL}
          autoComplete="email"
          required
          className="input-contato"
        />
        <textarea
          name="message"
          rows="5"
          placeholder={t("contato.mensagem")}
          aria-label={t("contato.mensagem")}
          maxLength={MAX_MENSAGEM}
          required
          className="input-contato"
        ></textarea>

        {/* Campo isca (honeypot): escondido de quem enxerga e de leitores de
            tela, mas robôs que preenchem tudo caem nele */}
        <div className="contato-isca" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {/* Verificação anti-spam no estilo de um comando do terminal */}
        {showCaptcha && (
          <div className={`contato-verificacao${captchaToken ? " ok" : ""}`}>
            <div className="contato-verificacao-texto">
              <span className="contato-verificacao-comando">$ verificar --humano</span>
              <span className="contato-verificacao-dica" aria-live="polite">
                {captchaToken ? t("contato.captcha_ok") : t("contato.captcha_dica")}
              </span>
            </div>
            <ReCaptcha
              ref={captchaRef}
              siteKey={RECAPTCHA_CONFIG.SITE_KEY}
              theme={theme === "light" ? "light" : "dark"}
              language={i18n.language}
              onChange={handleCaptchaChange}
              onError={handleCaptchaError}
            />
          </div>
        )}

        <button
          type="submit"
          className="botao-contato"
          disabled={sending}
          aria-busy={sending}
        >
          {sending ? t("contato.enviando_botao") : t("contato.enviar")}
        </button>

        {/* Botão voltar ao terminal */}
        <button type="button" className="botao-contato" onClick={onExit}>
          {t("contato.voltar_terminal")}
        </button>
      </form>

      {/* Ícones */}
      <div className="contato-links">
        <a href={seuLinkedIn} target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="contato-icone" />
        </a>
        <a href={seuGitHub} target="_blank" rel="noopener noreferrer">
          <FaGithub className="contato-icone" />
        </a>
        <a href={seuInstagram} target="_blank" rel="noopener noreferrer">
          <FaInstagram className="contato-icone" />
        </a>
        <a href={seuWhatsapp} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="contato-icone" />
        </a>
        <a href={seuDiscord} target="_blank" rel="noopener noreferrer">
          <FaDiscord className="contato-icone" />
        </a>
        <a href={`mailto:${seuEmail}`}>
          <FaEnvelope className="contato-icone" />
        </a>
      </div>
    </div>
  );
};

export default Contato;
