import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthenticationProvider } from "./global";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <AuthenticationProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthenticationProvider>,
  document.getElementById("root")
);
