import React from "react";
import { useTranslation } from "react-i18next";
import { InlineWidget } from "react-calendly";
import "./Calendly.css";

export default function Calendly() {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="calendly-title">{t("calendly.titulo")}</h3>
      <div className="calendly-container">
        <InlineWidget
          url="https://calendly.com/aramuni"
          styles={{ height: "100vh" }}
        />
      </div>
    </div>
  );
}
