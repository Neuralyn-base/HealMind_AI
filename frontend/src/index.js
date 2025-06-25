import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

if (!localStorage.getItem('token')) {
  localStorage.setItem('token', 'DEMO_KEY_123');
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
