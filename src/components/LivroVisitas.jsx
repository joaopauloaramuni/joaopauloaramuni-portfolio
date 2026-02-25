import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import "./LivroVisitas.css";
import emailjs from "emailjs-com";
import EMAILJS_CONFIG from "../config/emailJsConfig";

const LivroVisitas = ({ mode = "home", onExit }) => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // CLI states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("name");

  useEffect(() => {
    if (mode === "list") {
      fetchMessages();
    }

    if (mode === "add") {
      setName("");
      setMessage("");
      setStep("name");
    }
  }, [mode]);

  async function fetchMessages() {
    setLoading(true);

    const { data, error } = await supabase
      .from("guestbook_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setMessages(data);
    }

    setLoading(false);
  }

  async function handleSubmit() {
    const now = new Date();
    const time = now.toLocaleString();

    // Salva no Supabase
    const { error } = await supabase
      .from("guestbook_messages")
      .insert([{ name, message }]);

    if (error) {
      console.error(error);
      return;
    }

    // Envia email notificando novo registro
    emailjs
      .send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_FOR_ME,
        {
          name: name,
          email: "",
          message: `[guestbook add] ${message}`,
          title: `Nova mensagem registrada no guestbook por: ${name}`,
          time: time,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      )
      .then(
        () => {
          console.log("Email do guestbook enviado com sucesso!");
        },
        (err) => {
          console.error("Erro ao enviar email do guestbook:", err);
        }
      );

    // Atualiza UI
    setStep("done");
    fetchMessages();
  }

  return (
    <div className="guestbook-container">
      <div className="guestbook-header">
        <h2 className="guestbook-title">{t("guestbook.titulo")}</h2>
        <p className="guestbook-subtitle">
          {t("guestbook.subtitulo")}
        </p>
      </div>

      {/* HOME */}
      {mode === "home" && (
        <div className="guestbook-commands">
          <p className="cli-hint">{t("guestbook.hint")}</p>

          <p className="command-line">
            <span className="command">guestbook list</span>
            <span className="command-desc">
              → {t("guestbook.listar")}
            </span>
          </p>

          <p className="command-line">
            <span className="command">guestbook add</span>
            <span className="command-desc">
              → {t("guestbook.adicionar")}
            </span>
          </p>

          <p className="command-line">
            <span className="command">guestbook help</span>
            <span className="command-desc">
              → {t("guestbook.ajuda")}
            </span>
          </p>
        </div>
      )}

      {/* LIST */}
      {mode === "list" && (
        <div className="guestbook-messages">
          {loading ? (
            <p className="cli-hint">
              {t("guestbook.carregando")}
            </p>
          ) : messages.length === 0 ? (
            <p className="cli-hint">
              {t("guestbook.vazio")}
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="guestbook-entry">
                <p className="guestbook-name">
                  {msg.name} —{" "}
                  {new Date(msg.created_at).toLocaleDateString()}
                </p>
                <p className="guestbook-message">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ADD - CLI */}
      {mode === "add" && (
        <div className="guestbook-cli-add">
          {step === "name" && (
            <>
              <p className="cli-hint">{t("guestbook.nome_label")}:</p>
              <div className="cli-input-line">
                <span className="cli-prefix">&gt;</span>
                <input
                  className="cli-input"
                  type="text"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) {
                      setStep("message");
                    }
                  }}
                />
              </div>
            </>
          )}

          {step === "message" && (
            <>
              <p className="cli-hint">{t("guestbook.mensagem_label")}:</p>
              <div className="cli-input-line">
                <span className="cli-prefix">&gt;</span>
                <input
                  className="cli-input"
                  type="text"
                  value={message}
                  autoFocus
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && message.trim()) {
                      await handleSubmit();
                    }
                  }}
                />
              </div>
            </>
          )}

          {step === "done" && (
            <p className="cli-success">{t("guestbook.sucesso")}</p>
          )}

          <br />
          
          {onExit && (
            <button
              className="btn-voltar-terminal"
              onClick={onExit}>
              {t("guestbook.voltar_terminal")}
            </button>
          )}
        </div>
      )}

      {/* HELP */}
      {mode === "help" && (
        <div className="guestbook-commands">
          <p className="cli-hint">{t("guestbook.uso")}</p>

          <p className="command-line">
            <span className="command">guestbook</span>
            <span className="command-desc">
              → {t("guestbook.descricao")}
            </span>
          </p>

          <p className="command-line">
            <span className="command">guestbook list</span>
            <span className="command-desc">
              → {t("guestbook.listar")}
            </span>
          </p>

          <p className="command-line">
            <span className="command">guestbook add</span>
            <span className="command-desc">
              → {t("guestbook.adicionar")}
            </span>
          </p>

          <p className="command-line">
            <span className="command">guestbook help</span>
            <span className="command-desc">
              → {t("guestbook.ajuda")}
            </span>
          </p>

          <br />

          <p className="cli-hint">{t("guestbook.exemplo_list")}</p>

          <p className="command-line">
            <span className="command">guestbook list</span>
          </p>

          <br />

          <p className="cli-hint">{t("guestbook.exemplo_add")}</p>

          <div className="guestbook-entry">
            <p className="guestbook-name">&gt; guestbook add</p>
            <p className="guestbook-message">
              &gt; {t("guestbook.nome_label")}: {t("guestbook.example_name")}
            </p>
            <p className="guestbook-message">
              &gt; {t("guestbook.mensagem_label")}: {t("guestbook.example_message")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivroVisitas;