import React, { Component } from "react";

import Loading from "../components/Loading";

function withAuthentication(WrappedComponent, auth0) {
  return class WithAuthentication extends Component {
    state = { loading: true, isAuthenticated: false };

    async componentDidMount() {
      const { path } = this.props;
      const isAuthenticated = await auth0.isAuthenticated();

      if (!isAuthenticated) {
        await auth0.loginWithRedirect({
          redirect_uri: `${window.location.origin}/callback`,
          appState: { targetUrl: path }
        });
      }

      this.setState({ loading: false, isAuthenticated });
    }

    render() {
      const { loading, isAuthenticated } = this.state;

      if (!isAuthenticated) return null;

      if (loading) {
        return <Loading />;
      }

      return <WrappedComponent auth0={auth0} {...this.props} />;
    }
  };
}

export default withAuthentication;
