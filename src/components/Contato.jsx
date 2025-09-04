import React, { useRef, useState } from "react";
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
import EMAILJS_CONFIG from "../emailjsConfig";

const Contato = ({ onBackToTerminal }) => { // recebe a função via props
  const { t } = useTranslation();
  const form = useRef();
  const [status, setStatus] = useState("");

  const seuLinkedIn = "https://www.linkedin.com/in/joaopauloaramuni/";
  const seuGitHub = "https://github.com/joaopauloaramuni";
  const seuEmail = "joaopauloaramuni@gmail.com";
  const seuWhatsapp = "https://wa.me/5531980402103";
  const seuDiscord = "https://discordapp.com/users/959151773728251914";
  const seuInstagram = "https://www.instagram.com/joaopauloaramuni";

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        form.current,
        EMAILJS_CONFIG.PUBLIC_KEY
      )
      .then(
        () => {
          setStatus(t("contato.sucesso"));
          e.target.reset();
        },
        () => {
          setStatus(t("contato.erro"));
        }
      );
  };

  return (
    <div className="curriculo-container loaded contato-container">
      <h3 className="contato-titulo">{t("contato.titulo")}</h3>
      <p className="contato-subtitulo">{t("contato.subtitulo")}</p>

      {/* Formulário */}
      <form ref={form} onSubmit={sendEmail} className="formulario-contato">
        <input
          type="text"
          name="user_name"
          placeholder={t("contato.nome")}
          required
          className="input-contato"
        />
        <input
          type="email"
          name="user_email"
          placeholder={t("contato.email")}
          required
          className="input-contato"
        />
        <textarea
          name="message"
          rows="5"
          placeholder={t("contato.mensagem")}
          required
          className="input-contato"
        ></textarea>

        <button type="submit" className="botao-contato">
          {t("contato.enviar")}
        </button>

        {/* Botão voltar ao terminal */}
        <button
          type="button"
          className="botao-contato"
          onClick={onBackToTerminal}
        >
          {t("contato.voltar_terminal") || "Voltar ao Terminal"}
        </button>

        {status && <p className="status-contato">{status}</p>}
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
