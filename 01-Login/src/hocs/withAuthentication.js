import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-spa";

function withAuthentication(WrappedComponent) {
  const WithAuthentication = props => {
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const { path } = props;

    useEffect(() => {
      const fn = async () => {
        if (!isAuthenticated) {
          await loginWithRedirect({
            redirect_uri: window.location.origin,
            appState: { targetUrl: path }
          });
        }

        setLoading(false);
      };
      fn();
    }, [isAuthenticated, loginWithRedirect, props, path]);

    if (!isAuthenticated) return null;

    if (loading) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthentication;
}

export default withAuthentication;
