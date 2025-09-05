import React, { useRef, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useTranslation } from "react-i18next";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Curriculo.css";

const Curriculo = () => {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const { i18n } = useTranslation();

    const lang = i18n.language.startsWith("en") ? "en" : "pt";
    const fileUrl = `/cv-${lang}.pdf`;

    const handleDocumentLoad = () => {
        setIsLoaded(true);
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            className={`curriculo-container ${isLoaded ? "loaded" : ""}`}
            ref={containerRef}
        >
            {!isLoaded && <div className="spinner">Carregando PDF...</div>}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    onDocumentLoad={handleDocumentLoad}
                />
            </Worker>
        </div>
    );
};

export default Curriculo;
