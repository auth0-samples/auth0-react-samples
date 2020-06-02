import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import config from "../auth_config.json";

const { apiOrigin = "http://localhost:3001" } = config;

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState();
  const [error, setError] = useState({ error: "consent_required" });

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setError(null);
    } catch (error) {
      setError(error);
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setError(null);
    } catch (error) {
      setError(error);
    }

    await callApi();
  };

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <>
      <div className="mb-5">
        {error && error.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {error && error.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}

        <h1>External API</h1>
        <p>
          Ping an external API by clicking the button below. This will call the
          external API using an access token, and the API will validate it using
          the API's audience value.
        </p>

        <Button color="primary" className="mt-5" onClick={callApi}>
          Ping API
        </Button>
      </div>

      <div className="result-block-container">
        <div className={`result-block ${showResult && "show"}`}>
          <h6 className="muted">Result</h6>
          <Highlight>{JSON.stringify(apiMessage, null, 2)}</Highlight>
        </div>
      </div>
    </>
  );
};

export default withAuthenticationRequired(ExternalApi);
