import React, { useEffect, useRef, useState } from "react";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import "./LivroVisitas.css";
import "./BotaoVoltar.css";
import emailjs from "@emailjs/browser";
import EMAILJS_CONFIG from "../config/emailJsConfig";
import GUESTBOOK_CONFIG from "../config/guestbookConfig";

const { MAX_NOME, MAX_MENSAGEM } = GUESTBOOK_CONFIG;

// Tira os caracteres de controle (quebra de linha, tab...) que chegam ao colar
// um texto: o banco recusa a mensagem com eles (supabase/livro_visitas.sql).
const limpar = (texto) => texto.replace(/\p{Cc}/gu, " ");

// Traduz o erro do Supabase. As regras do trigger guestbook_antispam e as
// constraints de tamanho vêm com o nome na mensagem ou com o código 23514.
function chaveDoErro(error) {
  const texto = `${error?.message ?? ""} ${error?.details ?? ""}`;
  if (texto.includes("guestbook_rate_limit")) return "guestbook.erro_limite";
  if (texto.includes("guestbook_limite_global")) return "guestbook.erro_limite_global";
  if (texto.includes("guestbook_cheio")) return "guestbook.erro_cheio";
  if (error?.code === "23514") return "guestbook.erro_tamanho";
  return "guestbook.erro";
}

const LivroVisitas = ({ mode = "home", onExit }) => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // CLI states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("name");
  // Chave i18n do erro mostrado no passo "error"
  const [erro, setErro] = useState("guestbook.erro");
  // Trava de envio: o Enter apertado duas vezes rápido (antes de o Supabase
  // responder) chamava o handleSubmit duas vezes e gravava a mensagem em dobro.
  // Ref, e não state, porque o segundo Enter chega antes de o React renderizar.
  const sending = useRef(false);
  const ref = useRef(null);
  useCommandAtTop(ref);

  useEffect(() => {
    if (mode === "list") {
      fetchMessages();
    }

    if (mode === "add") {
      setName("");
      setMessage("");
      setStep("name");
      setErro("guestbook.erro");
      sending.current = false;
    }
  }, [mode]);

  async function fetchMessages() {
    // Sem Supabase configurado, a lista fica vazia
    if (!supabase) return;

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
    if (sending.current) return;
    sending.current = true;

    const now = new Date();
    const time = now.toLocaleString();

    // Sem Supabase configurado, avisa o visitante em vez de não fazer nada
    if (!supabase) {
      setErro("guestbook.erro");
      setStep("error");
      return;
    }

    // Mesmas regras do banco: sem espaços nas pontas e dentro do limite.
    // O maxLength do input já segura, isso é só uma garantia a mais.
    const nome = name.trim();
    const texto = message.trim();
    if (
      !nome ||
      !texto ||
      nome.length > MAX_NOME ||
      texto.length > MAX_MENSAGEM
    ) {
      sending.current = false;
      setErro("guestbook.erro_tamanho");
      setStep("error");
      return;
    }

    // Enquanto grava, o campo some e aparece "enviando..."
    setStep("sending");

    // Salva no Supabase
    const { error } = await supabase
      .from("guestbook_messages")
      .insert([{ name: nome, message: texto }]);

    if (error) {
      console.error(error);
      setErro(chaveDoErro(error));
      setStep("error");
      return;
    }

    // Envia email notificando novo registro
    emailjs
      .send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_FOR_ME,
        {
          name: nome,
          email: "",
          message: `[guestbook add] ${texto}`,
          title: `Nova mensagem registrada no guestbook por: ${nome}`,
          time: time,
        },
        { publicKey: EMAILJS_CONFIG.PUBLIC_KEY, blockHeadless: true }
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
    <div className="guestbook-container" ref={ref}>
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
                  maxLength={MAX_NOME}
                  autoFocus
                  onChange={(e) =>
                    setName(limpar(e.target.value).slice(0, MAX_NOME))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) {
                      setStep("message");
                    }
                  }}
                />
              </div>
              <p
                className={`cli-contador${
                  name.length >= MAX_NOME ? " cli-contador-limite" : ""
                }`}
                aria-live="polite">
                {name.length}/{MAX_NOME}
              </p>
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
                  maxLength={MAX_MENSAGEM}
                  autoFocus
                  onChange={(e) =>
                    setMessage(limpar(e.target.value).slice(0, MAX_MENSAGEM))
                  }
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && message.trim()) {
                      await handleSubmit();
                    }
                  }}
                />
              </div>
              <p
                className={`cli-contador${
                  message.length >= MAX_MENSAGEM ? " cli-contador-limite" : ""
                }`}
                aria-live="polite">
                {message.length}/{MAX_MENSAGEM}
              </p>
            </>
          )}

          {step === "sending" && (
            <p className="cli-hint">{t("guestbook.enviando")}</p>
          )}

          {step === "done" && (
            <p className="cli-success">{t("guestbook.sucesso")}</p>
          )}

          {step === "error" && (
            <p className="cli-hint">
              {t(erro, { nome: MAX_NOME, mensagem: MAX_MENSAGEM })}
            </p>
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
