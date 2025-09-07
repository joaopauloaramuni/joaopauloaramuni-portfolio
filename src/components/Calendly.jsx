import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Calendly.css";

export default function Calendly() {
  const { t } = useTranslation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h3 className="calendly-title">{t("calendly.titulo")}</h3>
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/aramuni"
      ></div>
    </div>
  );
}
