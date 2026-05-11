import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

if (import.meta.env.VITE_API_BASE_URL) {
  setBaseUrl(import.meta.env.VITE_API_BASE_URL);
}

setAuthTokenGetter(() => {
  return localStorage.getItem("admin_token");
});

createRoot(document.getElementById("root")!).render(<App />);
