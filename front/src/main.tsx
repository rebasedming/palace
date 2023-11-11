import React from "react";
import ReactDOM from "react-dom/client";
import { Stage } from "./Game";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div>
      <Stage />
    </div>
  </React.StrictMode>
);
