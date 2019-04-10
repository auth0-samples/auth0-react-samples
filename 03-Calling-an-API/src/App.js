import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import createAuth0Client from "@auth0/auth0-spa-js";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Callback from "./views/Callback";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";

// auth0 config
import config from "./auth_config";

// styles
import "samples-bootstrap-theme/dist/css/auth0-theme.css";
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

class App extends Component {
  state = { loading: true, auth0: null };

  async componentDidMount() {
    try {
      const auth0 = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience
      });

      this.setState({ loading: false, auth0 });
    } catch (error) {
      console.error(error);
    }
  }

  handleLoginClick = async () => {
    const { auth0 } = this.state;

    try {
      await auth0.loginWithRedirect({
        redirect_uri: `${window.location.origin}/callback`
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleLogoutClick = async event => {
    event && event.preventDefault();
    const { auth0 } = this.state;

    auth0.logout({ returnTo: window.location.origin });
  };

  render() {
    const { loading, auth0 } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <div id="app">
        <Router>
          <Switch>
            <Route
              path="/callback"
              render={props => <Callback auth0={auth0} {...props} />}
            />
            <Route
              path="/"
              render={() => (
                <Fragment>
                  <NavBar
                    auth0={auth0}
                    handleLoginClick={this.handleLoginClick}
                    handleLogoutClick={this.handleLogoutClick}
                  />
                  <Container className="mt-5">
                    <Route path="/" exact component={Home} />
                    <PrivateRoute
                      path="/profile"
                      auth0={auth0}
                      component={Profile}
                    />
                    <PrivateRoute
                      path="/external-api"
                      auth0={auth0}
                      component={ExternalApi}
                    />
                  </Container>
                  <Footer />
                </Fragment>
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
