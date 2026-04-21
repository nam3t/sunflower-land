import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import { App } from "./App.js";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Dashboard root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
