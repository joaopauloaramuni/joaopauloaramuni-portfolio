import React, { useRef, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Curriculo.css";

const Curriculo = () => {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
                    fileUrl="/cv.pdf"
                    plugins={[defaultLayoutPluginInstance]}
                    onDocumentLoad={handleDocumentLoad} // disparado quando PDF pronto
                />
            </Worker>
        </div>
    );
};

export default Curriculo;
