// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { FaGlobeAmericas } from "react-icons/fa";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isPtActive = i18n.language.startsWith("pt");
  const isEnActive = i18n.language.startsWith("en");

  return (
    <div className="switcherContainer">
      <FaGlobeAmericas className={`icon ${isEnActive ? "active" : ""}`} />
      <span
        className={`langText ${isPtActive ? "active" : ""}`}
        onClick={() => changeLanguage("pt")}
      >
        PT
      </span>
      <span>|</span>
      <span
        className={`langText ${isEnActive ? "active" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </span>
    </div>
  );
};

export default LanguageSwitcher;
