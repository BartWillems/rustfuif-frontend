import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { AuthenticationProvider } from "./global";
import "./index.css";
import App from "./App";

Sentry.init({
  dsn:
    "https://836635c7c619407f8ee19abd3eed06fb@o464327.ingest.sentry.io/5472355",
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.5,
});

ReactDOM.render(
  <AuthenticationProvider>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </AuthenticationProvider>,
  document.getElementById("root")
);
