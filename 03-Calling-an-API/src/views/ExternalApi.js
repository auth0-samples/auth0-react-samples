import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

import Highlight from "../components/Highlight";

class ExternalApi extends Component {
  state = { showResult: false, apiMessage: {} };

  callApi = async () => {
    const { auth0 } = this.props;

    try {
      const token = await auth0.getTokenSilently();

      const response = await fetch("/api/external", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      this.setState({ showResult: true, apiMessage: responseData });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { apiMessage, showResult } = this.state;

    return (
      <Fragment>
        <div className="mb-5">
          <h1>External API</h1>
          <p>
            Ping an external API by clicking the button below. This will call
            the external API using an access token, and the API will validate it
            using the API's audience value.
          </p>

          <Button color="primary" className="mt-5" onClick={this.callApi}>
            Ping API
          </Button>
        </div>

        <div className="result-block-container">
          <div className={`result-block ${showResult && "show"}`}>
            <h6 className="muted">Result</h6>
            <Highlight>{JSON.stringify(apiMessage, null, 2)}</Highlight>
          </div>
        </div>
      </Fragment>
    );
  }
}

ExternalApi.propTypes = {
  auth0: PropTypes.object.isRequired
};

export default ExternalApi;
