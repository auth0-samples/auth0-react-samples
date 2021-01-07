import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./auth_config.json";
import history from "./utils/history";

/*
 By default the token is stored in memory

 If you want to be logged in automaticly after refreshing the web-page
 the token has to be stored in "localstorage"

 Read here about security warnings:
 https://auth0.com/docs/libraries/auth0-single-page-app-sdk
*/
const cacheLocation = "memory"; // "memory" or "localstorage"

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo 
      ? appState.returnTo
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    audience={config.audience}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    cacheLocation={cacheLocation}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
