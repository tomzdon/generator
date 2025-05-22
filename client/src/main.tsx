
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Only import used font weights
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

createRoot(document.getElementById("root")!).render(<App />);
