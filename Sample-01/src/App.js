import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { Container } from "reactstrap";

import Layout from "./components/Layout";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./auth_config.json";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.replace(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      audience={config.audience}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <Layout>
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/external-api" component={ExternalApi} />
          </Switch>
        </Container>
        <Footer />
      </Layout>
    </Auth0Provider>
  );
};

export default App;
