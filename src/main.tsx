import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PosterProvider } from "./context/PosterContext";

// Make sure DOM is loaded
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Render the app
createRoot(rootElement).render(
  <PosterProvider>
    <App />
  </PosterProvider>
);
