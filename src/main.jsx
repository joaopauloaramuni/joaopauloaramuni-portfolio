import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./theme/theme.css";
import "./App.css";
import App from "./App.jsx";
import ThemeProvider from "./theme/ThemeProvider";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Router: permite ler o ?cmd= dos links diretos (aramuni.dev/?cmd=curriculo) */}
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
