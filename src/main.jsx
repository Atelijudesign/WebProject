import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import "./styles/index.css";
import "./styles/tailwind.css";

// Auto-recovery for Vite dynamic chunk updates (official Vite preload error handling)
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    console.warn("Vite preload error detected, auto-refreshing...", event);
    window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <ProjectsProvider>
          <App />
        </ProjectsProvider>
      </LanguageProvider>
    </HelmetProvider>
  </React.StrictMode>
);
