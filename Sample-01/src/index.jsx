import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { getConfig } from "./config";
import 'bootstrap/dist/css/bootstrap.min.css';

// Implementation based on auth0-react example: https://github.com/auth0/auth0-react/blob/main/EXAMPLES.md
const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
};

const Auth0ProviderWithRedirectCallback = ({ children }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };
  return (
    <Auth0Provider
      {...providerConfig}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Auth0ProviderWithRedirectCallback>
      <App />
    </Auth0ProviderWithRedirectCallback>
  </BrowserRouter>,
);
