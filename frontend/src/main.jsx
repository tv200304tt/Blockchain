import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app"; 

 // Nếu app.jsx viết thường
ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
