import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global/index.scss";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "../amplify/amplifyconfiguration.ts";

/* Only configure Amplify in production */
if (import.meta.env.PROD) {
  Amplify.configure(amplifyConfig);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
