import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({ children, ...initOptions }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  if (!initOptions.redirect_callback) {
    initOptions.redirect_callback = () =>
      window.history.replaceState({}, document.title, window.location.pathname);
  }

  const initAuth0 = async () => {
    const auth0FromHook = await createAuth0Client(initOptions);
    setAuth0(auth0FromHook);

    if (window.location.search.includes("code=")) {
      const { appState } = await auth0FromHook.handleRedirectCallback();

      initOptions.redirect_callback(appState);
    }

    const isAuthenticated = await auth0FromHook.isAuthenticated();

    setIsAuthenticated(isAuthenticated);

    if (isAuthenticated) {
      const user = await auth0FromHook.getUser();
      setUser(user);
    }

    setLoading(false);
  };

  useEffect(() => {
    initAuth0();
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.log(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => {
          console.log(...p);
          auth0Client.loginWithRedirect(...p);
        },
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
