import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Importa CSS do viewer
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Curriculo.css";

const Curriculo = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="curriculo-container">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl="/cv.pdf" plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

export default Curriculo;
