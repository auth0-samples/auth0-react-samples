import React, { Component } from "react";

import Loading from "../components/Loading";

class Callback extends Component {
  async componentDidMount() {
    const { auth0, history } = this.props;

    try {
      const result = await auth0.handleRedirectCallback();
      const targetUrl = result.appState && result.appState.targetUrl;

      history.push(targetUrl || "/");
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return <Loading />;
  }
}

export default Callback;
