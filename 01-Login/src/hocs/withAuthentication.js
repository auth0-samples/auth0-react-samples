import React, { Component } from "react";

import Loading from "../components/Loading";

function withAuthentication(WrappedComponent, auth0) {
  return class WithAuthentication extends Component {
    state = { loading: true };

    async componentDidMount() {
      const { path } = this.props;
      const isAuthenticated = await auth0.isAuthenticated();

      if (!isAuthenticated) {
        await auth0.loginWithRedirect({
          redirect_uri: `${window.location.origin}/callback`,
          appState: { targetUrl: path }
        });
      }

      this.setState({ loading: false });
    }

    render() {
      const { loading } = this.state;

      if (loading) {
        return <Loading />;
      }

      return <WrappedComponent auth0={auth0} {...this.props} />;
    }
  };
}

export default withAuthentication;
