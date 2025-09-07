import React, { useRef, useState, useEffect } from "react";
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
import EMAILJS_CONFIG from "../config/emailJsConfig.js";

const Contato = ({ onExit }) => {
  const { t } = useTranslation();
  const form = useRef();
  const nomeInputRef = useRef(null);
  const [status, setStatus] = useState("");
  const statusRef = useRef(null);

  useEffect(() => {
    // Foca no campo nome quando o componente montar
    if (nomeInputRef.current) {
      nomeInputRef.current.focus();
    }
  }, []);

  const seuLinkedIn = "https://www.linkedin.com/in/joaopauloaramuni/";
  const seuGitHub = "https://github.com/joaopauloaramuni";
  const seuEmail = "joaopauloaramuni@gmail.com";
  const seuWhatsapp = "https://wa.me/5531980402103";
  const seuDiscord = "https://discordapp.com/users/959151773728251914";
  const seuInstagram = "https://www.instagram.com/joaopauloaramuni";

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const nome = formData.get("name");
    const email = formData.get("email");
    const mensagem = formData.get("message");
    const now = new Date();
    const time = now.toLocaleString();

    // Email para você (notificação)
    emailjs
      .send(
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
      )
      .then(
        () => {
          console.log("Email para você enviado!");
        },
        (err) => {
          console.error("Erro ao enviar para você:", err);
          setStatus(t("contato.erro"));
        }
      );

    // Email de confirmação para o remetente
    emailjs
      .send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_FOR_SENDER,
        {
          name: nome,
          email: email,
          message: mensagem,
          title: "Recebemos sua mensagem!", // assunto do email de confirmação
          time: time,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      )
      .then(
        () => {
          console.log("Email de confirmação enviado ao remetente!");
          setStatus(t("contato.sucesso"));
          e.target.reset();
        },
        (err) => {
          console.error("Erro ao enviar confirmação:", err);
          setStatus(t("contato.erro"));
        }
      );
  };

  return (
    <div className="box-container loaded contato-container">
      <h3 className="contato-titulo">{t("contato.titulo")}</h3>
      <div className="box-status">
        <p
          ref={statusRef}
          className={status ? "status-contato" : "contato-subtitulo"}
        >
          {status || t("contato.subtitulo")}
        </p>
      </div>
      {/* Formulário */}
      <form ref={form} onSubmit={sendEmail} className="formulario-contato">
        <input
          ref={nomeInputRef}
          type="text"
          name="name"
          placeholder={t("contato.nome")}
          required
          className="input-contato"
        />
        <input
          type="email"
          name="email"
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
