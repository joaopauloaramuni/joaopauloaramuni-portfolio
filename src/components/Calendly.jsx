import React from "react";
import { useTranslation } from "react-i18next";
import { InlineWidget } from "react-calendly";
import "./Calendly.css";

export default function Calendly() {
  const { t } = useTranslation();

  return (
    <div>
        <InlineWidget
          url="https://calendly.com/aramuni"
          className="calendly-frame"
        />
    </div>
  );
}
