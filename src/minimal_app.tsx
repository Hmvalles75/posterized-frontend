// A minimal React app to test Vite
import { createRoot } from "react-dom/client";

function MinimalApp() {
  return (
    <div>
      <h1>Posterized.AI</h1>
      <p>Welcome to Posterized.AI - Create Amazing Sports Posters</p>
      <p>This is a minimal version for testing.</p>
    </div>
  );
}

// Wait for DOM to load
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Render the app
createRoot(rootElement).render(<MinimalApp />);