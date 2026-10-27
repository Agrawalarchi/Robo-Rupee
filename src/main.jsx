import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/splash.css";
import "./styles/presentation.css";
import "./styles/team.css";
import "./styles/problem.css";
import "./styles/solution.css";
import "./styles/market-size.css";
import "./styles/roadmap.css";
import "./styles/AskSlide.css";
import "./styles/BusinessModelSlide.css";
import "./styles/slide-heading.css";
import "./styles/slide-layout.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
