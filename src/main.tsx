import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.tsx";
import "./index.css";
import { GOOGLE_CONFIG } from './config/google';

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CONFIG.clientId}>
    <App />
  </GoogleOAuthProvider>
);
