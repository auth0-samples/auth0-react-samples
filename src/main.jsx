import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
/* highlight-start auth0-provider */
import { Auth0Provider } from "@auth0/auth0-react";
/* highlight-end auth0-provider */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* highlight-start auth0-provider */}
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {/* highlight-end auth0-provider */}
      <App />
      {/* highlight-start auth0-provider */}
    </Auth0Provider>
    {/* highlight-end auth0-provider */}
  </StrictMode>,
);
