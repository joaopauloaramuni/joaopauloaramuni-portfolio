import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/theme.css";
import "./App.css";
import App from "./App.jsx";
import ThemeProvider from "./theme/ThemeProvider";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
